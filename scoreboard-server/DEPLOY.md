# Scoreboard vom Supabase auf den VPS umziehen

Ziel: Das Konfi-Check-Scoreboard läuft als kleiner Python-Dienst mit SQLite auf dem
Hostinger-VPS — kein automatisches Pausieren mehr, keine Kosten.

Die App selbst bleibt auf GitHub Pages (`quiz.staaken-evangelisch.de`), nur die
Datenbank zieht um. Die API läuft unter
`https://konfirmation.staaken-evangelisch.de/api/konfi-check/`.

---

## Schritt 1 — Dateien auf den Server kopieren (vom Mac aus)

```bash
cd "/Users/viktorweber/Documents/EKBO/KU/Apps KU/konfi-check/scoreboard-server"

ssh root@187.77.85.192 "mkdir -p /opt/konfi-check-scoreboard"

scp server.py import_supabase.py supabase-export.json \
    root@187.77.85.192:/opt/konfi-check-scoreboard/

scp konfi-check-scoreboard.service \
    root@187.77.85.192:/etc/systemd/system/konfi-check-scoreboard.service

scp konfi-check-scoreboard.nginx-snippet \
    root@187.77.85.192:/etc/nginx/snippets/konfi-check-scoreboard.conf
```

## Schritt 2 — Dienst starten (auf dem Server)

```bash
ssh root@187.77.85.192

systemctl daemon-reload
systemctl enable --now konfi-check-scoreboard
systemctl status konfi-check-scoreboard --no-pager

# Kurztest direkt auf dem Server (muss [] liefern):
curl -s http://127.0.0.1:8766/scores
```

## Schritt 3 — Die 323 Altdaten importieren

```bash
sudo -u www-data python3 /opt/konfi-check-scoreboard/import_supabase.py \
     /opt/konfi-check-scoreboard/supabase-export.json

# Erwartete Ausgabe: "Import fertig: 323 neue Einträge, 323 insgesamt …"
curl -s http://127.0.0.1:8766/scores | head -c 300
```

## Schritt 4 — nginx einbinden

In `/etc/nginx/sites-enabled/` die Datei für `konfirmation.staaken-evangelisch.de`
öffnen und im **443-Server-Block** direkt unter der `root`-Zeile ergänzen:

```nginx
include /etc/nginx/snippets/konfi-check-scoreboard.conf;
```

Dann:

```bash
nginx -t      # die bekannte Warnung "protocol options redefined" ist harmlos
systemctl reload nginx
```

## Schritt 5 — Von außen prüfen

```bash
curl -s https://konfirmation.staaken-evangelisch.de/api/konfi-check/scores | head -c 300
```

Muss die Einträge als JSON liefern. **Wenn das klappt: Bescheid geben** — dann wird
die App umgestellt (`python3 scoreboard-server/switch_to_vps.py`, committen, pushen).

---

## Danach: Supabase abschalten

Wenn das neue Scoreboard ein paar Tage stabil läuft:

1. Keepalive-Workflow löschen: `.github/workflows/supabase-keepalive.yml`
2. Im Supabase-Dashboard das Projekt löschen (Daten liegen gesichert in
   `supabase-export.json` und in der SQLite-Datenbank)

## Backup

Die Datenbank liegt unter `/var/lib/konfi-check/scores.db`. Sicherung z. B. mit:

```bash
sqlite3 /var/lib/konfi-check/scores.db ".backup '/root/scores-backup.db'"
```

## Notfall: zurück zu Supabase

`git revert` des Umstellungs-Commits in `js/app.js` — Supabase bleibt bis zur
endgültigen Löschung unverändert bestehen.
