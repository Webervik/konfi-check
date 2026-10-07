#!/usr/bin/env python3
"""Scoreboard-Endpunkt für Konfi-Check — ersetzt Supabase, speichert in SQLite.

Endpunkte (hinter nginx unter /api/konfi-check/):
  GET    /scores        Liste der letzten Einträge (JSON-Array)
  POST   /scores        Neuer Eintrag {name, gruppe, thema, punkte, gesamt}
  DELETE /scores/<id>   Einzelnen Eintrag löschen
"""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from collections import deque
from datetime import datetime, timezone
from pathlib import Path
import json
import os
import re
import sqlite3
import time
import uuid

HOST = "127.0.0.1"
PORT = 8766
DATA_DIR = Path(os.environ.get("STATE_DIRECTORY", "/var/lib/konfi-check"))
DB_FILE = DATA_DIR / "scores.db"
ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "https://quiz.staaken-evangelisch.de")

MAX_BODY = 4096
MAX_NAME = 30
MAX_FELD = 60
LIMIT_DEFAULT = 1000
WRITE_LIMIT_PER_MIN = 40
ID_MUSTER = re.compile(r"^[0-9a-f-]{8,36}$")

SCHREIBZUGRIFFE = deque()


def db():
    verbindung = sqlite3.connect(DB_FILE, timeout=5)
    verbindung.row_factory = sqlite3.Row
    return verbindung


def init_db() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with db() as verbindung:
        verbindung.execute(
            """CREATE TABLE IF NOT EXISTS scores (
                   id TEXT PRIMARY KEY,
                   name TEXT NOT NULL,
                   gruppe TEXT NOT NULL,
                   thema TEXT NOT NULL,
                   punkte INTEGER NOT NULL,
                   gesamt INTEGER NOT NULL,
                   erstellt_am TEXT NOT NULL
               )"""
        )
        verbindung.execute(
            "CREATE INDEX IF NOT EXISTS idx_scores_erstellt ON scores(erstellt_am DESC)"
        )


def ratelimit_ok() -> bool:
    jetzt = time.monotonic()
    while SCHREIBZUGRIFFE and SCHREIBZUGRIFFE[0] < jetzt - 60:
        SCHREIBZUGRIFFE.popleft()
    if len(SCHREIBZUGRIFFE) >= WRITE_LIMIT_PER_MIN:
        return False
    SCHREIBZUGRIFFE.append(jetzt)
    return True


class ScoreboardHandler(BaseHTTPRequestHandler):
    server_version = "KonfiCheckScoreboard/1.0"
    protocol_version = "HTTP/1.1"

    def log_message(self, *_args) -> None:
        return

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
        self.send_header("Vary", "Origin")

    def send_json(self, status: int, payload) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self._cors()
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Content-Length", "0")
        self._cors()
        self.end_headers()

    def do_GET(self) -> None:
        if self.path.split("?")[0] != "/scores":
            self.send_json(404, {"error": "not found"})
            return
        try:
            with db() as verbindung:
                zeilen = verbindung.execute(
                    "SELECT id, name, gruppe, thema, punkte, gesamt, erstellt_am "
                    "FROM scores ORDER BY erstellt_am DESC LIMIT ?",
                    (LIMIT_DEFAULT,),
                ).fetchall()
            self.send_json(200, [dict(z) for z in zeilen])
        except sqlite3.Error:
            self.send_json(500, {"error": "db"})

    def do_POST(self) -> None:
        if self.path != "/scores":
            self.send_json(404, {"error": "not found"})
            return
        if not ratelimit_ok():
            self.send_json(429, {"error": "zu viele Anfragen"})
            return

        try:
            laenge = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            laenge = 0
        if laenge <= 0 or laenge > MAX_BODY:
            self.send_json(413, {"error": "body"})
            return

        try:
            daten = json.loads(self.rfile.read(laenge))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_json(400, {"error": "json"})
            return
        if not isinstance(daten, dict):
            self.send_json(400, {"error": "json"})
            return

        name = str(daten.get("name", "")).strip()[:MAX_NAME]
        gruppe = str(daten.get("gruppe", "")).strip()[:MAX_FELD]
        thema = str(daten.get("thema", "")).strip()[:MAX_FELD]
        try:
            punkte = int(daten.get("punkte", 0))
            gesamt = int(daten.get("gesamt", 0))
        except (TypeError, ValueError):
            self.send_json(400, {"error": "zahlen"})
            return
        if not name or not gruppe or not thema:
            self.send_json(422, {"error": "pflichtfelder"})
            return
        if not (0 <= punkte <= 999) or not (1 <= gesamt <= 999) or punkte > gesamt:
            self.send_json(422, {"error": "punkte"})
            return

        eintrag = {
            "id": str(uuid.uuid4()),
            "name": name,
            "gruppe": gruppe,
            "thema": thema,
            "punkte": punkte,
            "gesamt": gesamt,
            "erstellt_am": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        }
        try:
            with db() as verbindung:
                verbindung.execute(
                    "INSERT INTO scores (id, name, gruppe, thema, punkte, gesamt, erstellt_am) "
                    "VALUES (:id, :name, :gruppe, :thema, :punkte, :gesamt, :erstellt_am)",
                    eintrag,
                )
            self.send_json(201, eintrag)
        except sqlite3.Error:
            self.send_json(500, {"error": "db"})

    def do_DELETE(self) -> None:
        teile = self.path.split("?")[0].strip("/").split("/")
        if len(teile) != 2 or teile[0] != "scores":
            self.send_json(404, {"error": "not found"})
            return
        if not ratelimit_ok():
            self.send_json(429, {"error": "zu viele Anfragen"})
            return
        eintrag_id = teile[1]
        if not ID_MUSTER.match(eintrag_id):
            self.send_json(400, {"error": "id"})
            return
        try:
            with db() as verbindung:
                verbindung.execute("DELETE FROM scores WHERE id = ?", (eintrag_id,))
            self.send_json(200, {"ok": True})
        except sqlite3.Error:
            self.send_json(500, {"error": "db"})


if __name__ == "__main__":
    init_db()
    ThreadingHTTPServer((HOST, PORT), ScoreboardHandler).serve_forever()
