#!/usr/bin/env python3
"""Stellt js/app.js von Supabase auf den eigenen Scoreboard-Dienst um.

Erst ausführen, wenn der Dienst auf dem VPS läuft und erreichbar ist!
Aufruf aus dem Ordner konfi-check:  python3 scoreboard-server/switch_to_vps.py
"""
from pathlib import Path
import sys

APP = Path("js/app.js")

ERSETZUNGEN = [
    # 1) Konstanten
    (
        """const SUPABASE_URL = 'https://jhelduwnmjpomzrowgmr.supabase.co';""",
        """const SCORE_API = 'https://konfirmation.staaken-evangelisch.de/api/konfi-check';""",
    ),
    # 2) Header-Objekt
    (
        """const SB_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
};""",
        """const SB_HEADERS = { 'Content-Type': 'application/json' };""",
    ),
    # 3) Speichern
    (
        """    await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
      method: 'POST',
      headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ name, gruppe, thema, punkte, gesamt }),
      signal: controller.signal,
    });""",
        """    await fetch(`${SCORE_API}/scores`, {
      method: 'POST',
      headers: SB_HEADERS,
      body: JSON.stringify({ name, gruppe, thema, punkte, gesamt }),
      signal: controller.signal,
    });""",
    ),
    # 4) Laden
    (
        """    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/scores?select=*&order=erstellt_am.desc&limit=1000`,
      { headers: SB_HEADERS, signal: controller.signal }
    );""",
        """    const res = await fetch(
      `${SCORE_API}/scores`,
      { headers: SB_HEADERS, signal: controller.signal }
    );""",
    ),
    # 5) Löschen
    (
        """    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/scores?id=eq.${id}`,
      { method: 'DELETE', headers: SB_HEADERS }
    );""",
        """    const res = await fetch(
      `${SCORE_API}/scores/${id}`,
      { method: 'DELETE', headers: SB_HEADERS }
    );""",
    ),
]


def main() -> int:
    quelltext = APP.read_text(encoding="utf-8")
    if "SCORE_API" in quelltext:
        print("app.js nutzt bereits SCORE_API — nichts zu tun.")
        return 0

    for alt, neu in ERSETZUNGEN:
        if alt not in quelltext:
            print("FEHLER: Codestelle nicht gefunden:\n" + alt[:120], file=sys.stderr)
            return 1
        quelltext = quelltext.replace(alt, neu, 1)

    # Den nun ungenutzten Supabase-Schlüssel entfernen
    zeilen = [z for z in quelltext.splitlines(keepends=True) if "const SUPABASE_KEY" not in z]
    quelltext = "".join(zeilen)

    if "SUPABASE" in quelltext:
        rest = [z.strip() for z in quelltext.splitlines() if "SUPABASE" in z]
        print("WARNUNG: Supabase-Reste gefunden:", rest, file=sys.stderr)

    APP.write_text(quelltext, encoding="utf-8")
    print("app.js umgestellt auf:", "https://konfirmation.staaken-evangelisch.de/api/konfi-check")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
