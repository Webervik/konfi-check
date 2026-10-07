#!/usr/bin/env python3
"""Importiert den Supabase-Export in die SQLite-Datenbank des Scoreboards.

Aufruf auf dem Server:
    sudo -u www-data python3 /opt/konfi-check-scoreboard/import_supabase.py \
        /opt/konfi-check-scoreboard/supabase-export.json

Mehrfaches Ausführen ist unschädlich: Vorhandene IDs werden übersprungen.
"""
import json
import sqlite3
import sys
from pathlib import Path

DB_FILE = Path("/var/lib/konfi-check/scores.db")


def main() -> int:
    if len(sys.argv) < 2:
        print("Aufruf: import_supabase.py <export.json>", file=sys.stderr)
        return 1
    export = Path(sys.argv[1])
    if not export.exists():
        print(f"Datei nicht gefunden: {export}", file=sys.stderr)
        return 1

    eintraege = json.loads(export.read_text(encoding="utf-8"))
    eintraege = [e for e in eintraege if not str(e.get("name", "")).startswith("__keepalive")]

    verbindung = sqlite3.connect(DB_FILE, timeout=10)
    verbindung.execute(
        """CREATE TABLE IF NOT EXISTS scores (
               id TEXT PRIMARY KEY, name TEXT NOT NULL, gruppe TEXT NOT NULL,
               thema TEXT NOT NULL, punkte INTEGER NOT NULL, gesamt INTEGER NOT NULL,
               erstellt_am TEXT NOT NULL)"""
    )
    verbindung.execute("CREATE INDEX IF NOT EXISTS idx_scores_erstellt ON scores(erstellt_am DESC)")

    vorher = verbindung.execute("SELECT COUNT(*) FROM scores").fetchone()[0]
    with verbindung:
        verbindung.executemany(
            "INSERT OR IGNORE INTO scores (id, name, gruppe, thema, punkte, gesamt, erstellt_am) "
            "VALUES (:id, :name, :gruppe, :thema, :punkte, :gesamt, :erstellt_am)",
            [
                {
                    "id": e["id"],
                    "name": e["name"],
                    "gruppe": e["gruppe"],
                    "thema": e["thema"],
                    "punkte": e["punkte"],
                    "gesamt": e["gesamt"],
                    "erstellt_am": e["erstellt_am"],
                }
                for e in eintraege
            ],
        )
    nachher = verbindung.execute("SELECT COUNT(*) FROM scores").fetchone()[0]
    verbindung.close()
    print(f"Import fertig: {nachher - vorher} neue Einträge, {nachher} insgesamt in der Datenbank.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
