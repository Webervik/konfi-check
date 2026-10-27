#!/usr/bin/env bash
# Spielt den Konfi-Check-Scoreboard-Dienst auf den VPS auf.
# Aufruf vom Mac aus:
#     bash "/Users/viktorweber/Documents/EKBO/KU/Apps KU/konfi-check/scoreboard-server/deploy.sh"
#
# Das Skript ist mehrfach ausführbar. Schlägt etwas fehl, bricht es ab,
# und die nginx-Konfiguration wird automatisch zurückgesetzt.

set -euo pipefail

SERVER="root@187.77.85.192"
QUELLE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API="https://konfirmation.staaken-evangelisch.de/api/konfi-check/scores"
SOCKET="/tmp/konfi-check-deploy.sock"

# Vorhandene VPS-Schlüssel anbieten und EINE Verbindung für alle Schritte
# wiederverwenden — sonst fragt SSH bei jedem Schritt erneut nach dem Passwort.
SSH_OPTS=(
    -o "ControlMaster=auto"
    -o "ControlPath=$SOCKET"
    -o "ControlPersist=10m"
    -i "$HOME/.ssh/hostinger_vps"
    -i "$HOME/.ssh/hostinger_backup_ed25519"
)

verbindung_schliessen() {
    ssh "${SSH_OPTS[@]}" -O exit "$SERVER" 2>/dev/null || true
}
trap verbindung_schliessen EXIT

echo "==> 0/6  Verbindung aufbauen"
echo "    Falls jetzt nach Passwort oder Passphrase gefragt wird: nur dieses eine Mal."
ssh "${SSH_OPTS[@]}" "$SERVER" "echo '    verbunden mit' \$(hostname)"

echo "==> 0b/6  Ist Port 8772 frei?"
ssh "${SSH_OPTS[@]}" "$SERVER" bash -s <<'FERNSTEUERUNG'
set -euo pipefail
PORTS=$(ss -tlnp 2>/dev/null || true)
if printf '%s\n' "$PORTS" | grep -q "127.0.0.1:8772 "; then
    if systemctl is-active --quiet konfi-check-scoreboard; then
        echo "    Port 8772 gehört dem eigenen Dienst — wird gleich neu gestartet"
    else
        echo "FEHLER: Port 8772 ist von einem fremden Dienst belegt:"
        printf "%s\n" "$PORTS" | grep "127.0.0.1:8772 " | sed 's/^/      /'
        exit 1
    fi
else
    echo "    frei"
fi
FERNSTEUERUNG

echo "==> 1/6  Dateien auf den Server kopieren"
ssh "${SSH_OPTS[@]}" "$SERVER" "mkdir -p /opt/konfi-check-scoreboard"
scp -q "${SSH_OPTS[@]}" "$QUELLE/server.py" "$QUELLE/import_supabase.py" "$QUELLE/supabase-export.json" \
    "$SERVER:/opt/konfi-check-scoreboard/"
scp -q "${SSH_OPTS[@]}" "$QUELLE/konfi-check-scoreboard.service" \
    "$SERVER:/etc/systemd/system/konfi-check-scoreboard.service"
scp -q "${SSH_OPTS[@]}" "$QUELLE/konfi-check-scoreboard.nginx-snippet" \
    "$SERVER:/etc/nginx/snippets/konfi-check-scoreboard.conf"
echo "    ok"

echo "==> 2/6  Dienst starten"
ssh "${SSH_OPTS[@]}" "$SERVER" bash -s <<'FERNSTEUERUNG'
set -euo pipefail
systemctl daemon-reload
systemctl enable konfi-check-scoreboard >/dev/null 2>&1
systemctl restart konfi-check-scoreboard
sleep 2
systemctl is-active --quiet konfi-check-scoreboard || {
    echo "FEHLER: Dienst läuft nicht. Protokoll:"
    journalctl -u konfi-check-scoreboard -n 20 --no-pager
    exit 1
}
echo "    Dienst aktiv"
FERNSTEUERUNG

echo "==> 3/6  Dienst lokal auf dem Server testen"
ssh "${SSH_OPTS[@]}" "$SERVER" 'code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8772/scores); \
    echo "    HTTP $code"; [ "$code" = "200" ] || exit 1'

echo "==> 4/6  Altdaten importieren (323 Einträge, mehrfach ausführbar)"
ssh "${SSH_OPTS[@]}" "$SERVER" "sudo -u www-data python3 /opt/konfi-check-scoreboard/import_supabase.py \
    /opt/konfi-check-scoreboard/supabase-export.json | sed 's/^/    /'"

echo "==> 5/6  nginx einbinden"
ssh "${SSH_OPTS[@]}" "$SERVER" bash -s <<'FERNSTEUERUNG'
set -uo pipefail
# -R statt -r: folgt den Symlinks in sites-enabled nach sites-available.
# Treffer über realpath entdoppeln, damit Symlink und Ziel nicht doppelt zählen.
TREFFER=$(grep -Rl "konfirmation\.staaken-evangelisch\.de" \
    /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ /etc/nginx/sites-available/ 2>/dev/null \
    | xargs -r -n1 realpath 2>/dev/null | sort -u || true)

# Nur Dateien mit einem root-Verzeichnis (also der eigentliche 443-Block)
ZIEL=""
for datei in $TREFFER; do
    if grep -qE "^[[:space:]]*root[[:space:]]" "$datei"; then
        ZIEL="$datei"
        break
    fi
done

if [ -z "$ZIEL" ]; then
    echo "FEHLER: Keine passende nginx-Datei gefunden."
    echo "    Treffer für konfirmation.staaken-evangelisch.de:"
    echo "${TREFFER:-      (keine)}" | sed 's/^/      /'
    echo "    Inhalt sites-enabled:"; ls -la /etc/nginx/sites-enabled/ | sed 's/^/      /'
    exit 1
fi
set -e
echo "    Datei: $ZIEL"

if grep -q "konfi-check-scoreboard.conf" "$ZIEL"; then
    echo "    include ist bereits vorhanden"
else
    SICherung="${ZIEL}.vor-konfi-check.$(date +%Y%m%d%H%M%S)"
    cp "$ZIEL" "$SICherung"
    echo "    Sicherung: $SICherung"
    # include direkt nach der ersten root-Zeile einfügen (steht im 443-Block)
    awk '
        !eingefuegt && /^[[:space:]]*root[[:space:]]/ {
            print
            print "    include /etc/nginx/snippets/konfi-check-scoreboard.conf;"
            eingefuegt = 1
            next
        }
        { print }
    ' "$SICherung" > "$ZIEL"
    grep -q "konfi-check-scoreboard.conf" "$ZIEL" || { cp "$SICherung" "$ZIEL"; echo "FEHLER: Einfügen misslungen"; exit 1; }

    # Rückgabewert von nginx -t direkt auswerten (kein Pipe: grep -q loest sonst
    # ein Broken Pipe aus und laesst den Test faelschlich scheitern).
    # Die Warnungen "protocol options redefined" sind bekannt und harmlos.
    if nginx -t >/tmp/konfi-check-nginx-test.log 2>&1; then
        echo "    nginx-Test bestanden"
    else
        echo "FEHLER: nginx-Test fehlgeschlagen — Sicherung wird zurückgespielt"
        sed 's/^/      /' /tmp/konfi-check-nginx-test.log
        cp "$SICherung" "$ZIEL"
        exit 1
    fi
fi
systemctl reload nginx
echo "    nginx neu geladen"
FERNSTEUERUNG

echo "==> 6/6  Von außen prüfen"
sleep 2
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API" --max-time 15)
ANZAHL=$(curl -s "$API" --max-time 15 | python3 -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?")
echo "    $API"
echo "    HTTP $CODE, Einträge: $ANZAHL"

if [ "$CODE" = "200" ]; then
    echo
    echo "FERTIG. Das Scoreboard läuft jetzt auf deinem VPS."
    echo "Sag Claude Bescheid — dann wird die App umgestellt."
else
    echo
    echo "Die API antwortet noch nicht wie erwartet. Bitte die Ausgabe oben an Claude geben."
    exit 1
fi
