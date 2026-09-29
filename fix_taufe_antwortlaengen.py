"""Gleicht die Antwortlängen bei tf9 an — die richtige Antwort darf nicht die längste sein."""
import json, re

with open('data/fragen.json', encoding='utf-8') as f:
    data = json.load(f)

t = next(t for t in data['themen'] if t['id'] == 'taufe')
q = next(q for q in t['fragen'] if q['id'] == 'tf9')

q['antworten'] = [
    "Johannes war ein Konkurrent, dessen Anhänger man gewinnen wollte",
    "Die Taufe galt als heidnischer Brauch, den man ablehnen musste",
    "Johannes taufte zur Vergebung der Sünden — wozu beim Sündlosen?",
    "Jesus war nach damaligem jüdischem Recht dafür noch viel zu jung"
]
q['richtig'] = 2

print('tf9 Längen neu:', [len(a) for a in q['antworten']], '| richtig:', q['richtig'])

with open('data/fragen.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

compact = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
with open('index.html', encoding='utf-8') as f:
    html = f.read()
html_new = re.sub(r'window\.FRAGEN_DATA\s*=\s*\{.*?\};', 'window.FRAGEN_DATA = ' + compact + ';', html, flags=re.DOTALL)
assert html_new != html, 'FRAGEN_DATA nicht gefunden'
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_new)
print('index.html aktualisiert')
