import json, re

with open('data/fragen.json', encoding='utf-8') as f:
    data = json.load(f)

ersetzungen = 0
for t in data['themen']:
    for z in t.get('zitate', []):
        # 1. Lk 19,40 — Kontext ergänzen
        if z['quelle'] == 'Lk 19,40':
            z['text'] = '„Wenn diese schweigen, werden die Steine schreien.“ — Jesu Antwort beim Einzug in Jerusalem: Das Lob Gottes lässt sich nicht aufhalten.'
            ersetzungen += 1
        # 2. Joel 1,3 (Heuschreckenplage-Kontext) → Ps 78,4
        if z['quelle'] == 'Joel 1,3':
            z['text'] = '„Wir erzählen es der kommenden Generation: die Ruhmestaten des Herrn und seine Wunder.“'
            z['quelle'] = 'Ps 78,4'
            z['link'] = 'https://www.die-bibel.de/bibel/BB/PSA.78.4-PSA.78.4'
            ersetzungen += 1
        # 3. Röm 9,20 (hart ohne Kontext) → Hiob 42,5
        if z['quelle'] == 'Röm 9,20':
            z['text'] = '„Ich hatte von dir nur vom Hörensagen gehört; nun aber hat mein Auge dich gesehen.“'
            z['quelle'] = 'Hiob 42,5'
            z['link'] = 'https://www.die-bibel.de/bibel/BB/JOB.42.5-JOB.42.5'
            ersetzungen += 1

print(f'{ersetzungen} Zitate ersetzt')

with open('data/fragen.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

compact = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
with open('index.html', encoding='utf-8') as f:
    html = f.read()
html_new = re.sub(r'window\.FRAGEN_DATA\s*=\s*\{.*?\};', 'window.FRAGEN_DATA = ' + compact + ';', html, flags=re.DOTALL)
assert html_new != html or 'FRAGEN_DATA' in html
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_new)
print('index.html aktualisiert')
