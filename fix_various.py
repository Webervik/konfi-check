import json, re

# ── 1. fragen.json ──────────────────────────────────────────────────────────
with open('data/fragen.json', encoding='utf-8') as f:
    data = json.load(f)

for t in data['themen']:
    if t['id'] == 'jesus-historisch':
        for z in t['zitate']:
            if 'Nazareth' in z['text']:
                z['text'] = '„Kann aus Nazareth etwas Gutes kommen?" — Nathanael fragte das skeptisch, als Philippus ihm von Jesus erzählte. Die Antwort: „Komm und sieh!"'
                print("✓ Nazareth-Zitat erweitert")

        for q in t['fragen']:
            # Fix jh6: Historiker-Frage
            if q['id'] == 'jh6':
                q['antworten'] = ['Sueton', 'Tacitus', 'Plinius der Ältere', 'Herodot']
                q['erklaerung'] = (
                    'Der römische Historiker Tacitus schreibt um 116 n.Chr. in seinen »Annalen« (XV, 44): '
                    'Christus wurde unter der Regierung des Tiberius durch den Prokurator Pontius Pilatus '
                    'hingerichtet. Tacitus nennt die Christen nach ihm. Auch Flavius Josephus, ein jüdischer '
                    'Historiker (ca. 93 n.Chr.), erwähnt Jesus — wenn auch in einem umstrittenen Textstück.'
                )
                print("✓ jh6 Antworten und Erklärung aktualisiert")

            # Fix jh9: Rabbi — Vorauswahl prüfen (richtig bleibt 1, keine Änderung nötig im JSON)
            # (Vorauswahl ist ein UI-Problem, wird in app.js geprüft)

            # Fix jh10: Bergpredigt — "bei Lukas" aus Frage entfernen
            if q['id'] == 'jh10':
                q['frage'] = 'Was ist die Bergpredigt — und wie heißt die Parallelversion bei Lukas?'
                q['antworten'][1] = 'Jesu zentrale Lehrrede (Mt 5–7); die kürzere Parallelversion heißt »Feldrede« (Lk 6,17–49)'
                print("✓ jh10 Bergpredigt-Frage angepasst")

with open('data/fragen.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✓ fragen.json gespeichert")

# ── 2. app.js: "Gemeinden" → "Gemeinde" ────────────────────────────────────
with open('js/app.js', encoding='utf-8') as f:
    js = f.read()

js_new = js.replace(
    'Mehr über unsere Gemeinden, Veranstaltungen',
    'Mehr über unsere Gemeinde, Veranstaltungen'
)
if js_new != js:
    print("✓ app.js: 'Gemeinden' → 'Gemeinde'")
else:
    print("! app.js: Kein Match für Gemeinden-Text")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(js_new)

# ── 3. index.html: FRAGEN_DATA aktualisieren ───────────────────────────────
with open('data/fragen.json', encoding='utf-8') as f:
    data = json.load(f)

compact = json.dumps(data, ensure_ascii=False, separators=(',', ':'))

with open('index.html', encoding='utf-8') as f:
    html = f.read()

html_new = re.sub(
    r'window\.FRAGEN_DATA\s*=\s*\{.*?\};',
    'window.FRAGEN_DATA = ' + compact + ';',
    html, flags=re.DOTALL
)

if html_new != html:
    print("✓ index.html FRAGEN_DATA aktualisiert")
else:
    print("! index.html: Kein Match")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_new)

print("\nFertig!")
