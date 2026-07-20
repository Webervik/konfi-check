import json, re

with open('data/fragen.json', encoding='utf-8') as f:
    data = json.load(f)

t = next(t for t in data['themen'] if t['id'] == 'pfingsten')

# Originaltext (der eigentliche Bibelvers) + separater Kontext
zitate_neu = {
    'Joh 3,8': {
        'text': '„Der Wind weht, wo er will, und du hörst sein Sausen wohl, aber du weißt nicht, woher er kommt und wohin er fährt. So ist es bei jedem, der aus dem Geist geboren ist.“',
        'kontext': 'Jesus erklärt das Nikodemus: Gottes Geist ist so wenig zu kontrollieren wie der Wind — man spürt seine Wirkung, ohne ihn zu greifen.',
    },
    '2 Kor 3,17': {
        'text': '„Wo der Geist des Herrn ist, da ist Freiheit.“',
        'kontext': 'Paulus vergleicht das Leben unter dem alten Gesetz mit einem Schleier vor dem Gesicht — wer sich dem Geist Christi zuwendet, wird frei, Gott „mit aufgedecktem Angesicht" zu begegnen.',
    },
    'Gal 5,22': {
        'text': '„Die Frucht des Geistes ist Liebe, Freude, Friede …“',
        'kontext': 'Paulus stellt der „Frucht des Geistes" die „Werke des Fleisches" gegenüber. Die volle Aufzählung: Liebe, Freude, Friede, Geduld, Freundlichkeit, Güte, Treue, Sanftmut, Selbstbeherrschung.',
    },
    'Röm 8,26': {
        'text': '„Der Geist hilft unserer Schwachheit auf.“',
        'kontext': 'Mitten in einem Kapitel über Hoffnung im Leiden: Wenn wir nicht wissen, wie wir beten sollen, tritt der Geist selbst mit „unaussprechlichem Seufzen" für uns ein.',
    },
    'Sach 4,6': {
        'text': '„Nicht durch Heer und Kraft, sondern durch meinen Geist.“',
        'kontext': 'Der Prophet Sacharja tröstet damit Serubbabel, der den zerstörten Tempel in Jerusalem wieder aufbauen soll — eine scheinbar unmögliche Aufgabe.',
    },
    'Eph 5,18-19': {
        'text': '„Berauscht euch nicht mit Wein — sondern lasst euch vom Geist erfüllen und redet miteinander in Psalmen, Hymnen und geistlichen Liedern.“',
        'kontext': 'Paulus stellt zwei Arten des „Außer-sich-Seins" gegenüber: den Rausch des Weins und die Erfüllung durch Gottes Geist, die sich in gemeinsamem Singen und Danken zeigt.',
    },
    'Apg 1,8': {
        'text': '„Ihr werdet die Kraft des Heiligen Geistes empfangen — und meine Zeugen sein.“',
        'kontext': 'Die letzten Worte Jesu vor seiner Himmelfahrt, unmittelbar vor Pfingsten: „…und werdet meine Zeugen sein in Jerusalem und in ganz Judäa und Samarien und bis an das Ende der Erde.“',
    },
}

count = 0
for z in t['zitate']:
    if z['quelle'] in zitate_neu:
        z['text'] = zitate_neu[z['quelle']]['text']
        z['kontext'] = zitate_neu[z['quelle']]['kontext']
        count += 1

with open('data/fragen.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print('Zitate korrigiert:', count)

with open('data/fragen.json', encoding='utf-8') as f:
    data = json.load(f)
compact = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
with open('index.html', encoding='utf-8') as f:
    html = f.read()
html_new = re.sub(r'window\.FRAGEN_DATA\s*=\s*\{.*?\};', 'window.FRAGEN_DATA = ' + compact + ';', html, flags=re.DOTALL)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_new)
print('index.html aktualisiert')
