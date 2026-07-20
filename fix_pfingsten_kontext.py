import json, re

with open('data/fragen.json', encoding='utf-8') as f:
    data = json.load(f)

t = next(t for t in data['themen'] if t['id'] == 'pfingsten')

erklaerungen = {
    'pf1': 'Der Name kommt vom griechischen »Pentekoste« — der 50. Tag nach Ostern (7 Wochen + 1 Tag). Das griechische Wort erinnert daran, dass Pfingsten ursprünglich ein jüdisches Fest war — die Christen gaben ihm eine neue Bedeutung. 25 und 40 Tage nach Ostern passen nicht: 40 Tage nach Ostern ist Christi Himmelfahrt, danach folgen noch einmal 10 Tage bis Pfingsten.',
    'pf2': 'Wind, Feuer, Zungenreden — der Heilige Geist kam auf die versammelten Jünger. Lukas beschreibt es als Sturm, Feuer und das Sprechen in fremden Sprachen (Apg 2,1-4). Die anderen Antworten gehören zu anderen Ereignissen: Jesu Erscheinungen fanden nach Ostern statt, die Himmelfahrt 40 Tage nach Ostern, und ein 40-tägiges Fasten der Jünger ist an Pfingsten nirgends erwähnt.',
    'pf3': 'An diesem Tag entstand die erste Gemeinde — Menschen hörten die Botschaft und schlossen sich zusammen. Wenn Pfingsten der Geburtstag der Kirche ist, dann nicht der Kirche als Institution — sondern als lebendige Gemeinschaft von Menschen, die gemeinsam glauben und handeln. „Todestag", „Jahrestag" und „Namenstag" sind gängige Wörter, aber keine kirchliche Bezeichnung für Pfingsten.',
    'pf4': 'Apg 2,41: »An diesem Tag kamen etwa dreitausend Menschen hinzu.« 3000 Menschen an einem einzigen Tag — das zeigt die Sprengkraft der Pfingstbotschaft. Heute sind es weltweit über 2 Milliarden Christen. Die Zahl 120 stammt aus Apg 1,15 — so viele Jünger waren vor Pfingsten versammelt, nicht die Zahl der Neugetauften. 500 nennt Paulus als Zeugen der Auferstehung (1 Kor 15,6), und 12 war die Zahl der ursprünglichen Apostel.',
    'pf5': 'Die Taube ist das klassische Symbol des Heiligen Geistes — schon bei Jesu Taufe erschien er so. Dieses Fresko aus der Wiener Karlskirche (18. Jh.) zeigt ihn mit goldenen Lichtstrahlen. In der Kunst erscheint der Heilige Geist fast immer als Taube oder als Feuer — beides sind Bilder für etwas, das man sieht und spürt, aber nicht festhalten kann. Die Taube nach der Sintflut (1 Mo 8) brachte ein Ölblatt und steht für das Ende der Flut, nicht für den Geist; auch Marias Seele oder ein Engel werden nirgends als Taube dargestellt.',
    'pf6': 'Schawuot (das jüdische Wochenfest, 50 Tage nach Pessach) erinnert an die Gabe der Tora am Sinai — Lukas setzt bewusst Pfingsten an diesen Tag: Gottes Geist ersetzt das Gesetz. Wie Gott am Sinai die Tora gab, so gibt er jetzt seinen Geist. Das Alte wird nicht abgeschafft — es wird erfüllt. Pessach (das Passahfest) liegt 50 Tage davor und war der Rahmen für Jesu Kreuzigung; Jom Kippur (Versöhnungstag) und Sukkot (Laubhüttenfest) fallen erst im Herbst.',
    'pf7': 'Vater, Sohn, Heiliger Geist — drei Personen, ein Gott. Das Trinitätsdogma wurde im 4. Jh. formuliert. Die Dreieinigkeit ist kein mathematisches Rätsel, sondern eine Aussage über Gottes Wesen: Gott ist Beziehung. Vater, Sohn und Geist stehen in ewiger Gemeinschaft. Der Heilige Geist ist also weder nur ein Engel (ein geschaffenes Wesen) noch bloß das menschliche Gewissen oder ein Buch, sondern Gott selbst in seiner dritten „Erscheinungsweise".',
    'pf8': 'Lukas listet in Apg 2 eine beeindruckende Völkerliste auf: Parther, Meder, Elamiter, Bewohner Mesopotamiens, Judäas, Kappadoziens, Ägyptens, Libyens, Roms, Kretas, Arabiens... Das unterstreicht: Die Botschaft des Evangeliums ist von Anfang an für alle Völker bestimmt — nicht nur für Menschen aus der Region Jerusalem, nicht nur für drei Großstädte und nicht nur für die zwölf Stämme Israels.',
    'pf9': 'Petrus — der wenige Wochen zuvor Jesus dreimal verleugnet hatte — trat nun mutig vor die Menge und predigte. Er zitierte den Propheten Joel und rief: Jesus von Nazareth ist der verheißene Christus, auferstanden und erhöht! Rund 3.000 Menschen ließen sich daraufhin taufen (Apg 2,14–41). Er zog sich also gerade nicht zurück, schrieb keinen Brief und vertröstete niemanden auf den nächsten Tag — er handelte sofort.',
    'pf10': 'Glossolalie (griech. glossa = Zunge, lalein = reden) bezeichnet das ekstatische Reden in unverständlichen Lauten als Zeichen des Heiligen Geistes. Paulus kennt diese Gabe, mahnt aber: Im Gottesdienst soll jemand übersetzen, damit alle etwas davon haben (1 Kor 14). Beim Pfingstgeschehen dagegen verstehen alle in ihrer eigenen Sprache — das ist ein anderes Phänomen als Glossolalie. Das gemeinsame Vorlesen der Schrift, das stille Beten und das Sprechen des Glaubensbekenntnisses sind bekannte gottesdienstliche Elemente, aber keine „Glossolalie".',
}

for q in t['fragen']:
    if q['id'] in erklaerungen:
        q['erklaerung'] = erklaerungen[q['id']]

zitat_kontext = {
    'Joh 3,8': '„Der Wind weht, wo er will, und du hörst sein Sausen wohl, aber du weißt nicht, woher er kommt und wohin er fährt. So ist es bei jedem, der aus dem Geist geboren ist.“ Jesus erklärt damit Nikodemus, dass Gottes Geist genauso wenig zu kontrollieren ist wie der Wind — man spürt seine Wirkung, ohne ihn zu greifen.',
    '2 Kor 3,17': 'Paulus vergleicht das Leben unter dem alten Gesetz mit einem Schleier vor dem Gesicht — wer sich aber dem Geist Christi zuwendet, wird frei, „mit aufgedecktem Angesicht" Gott zu begegnen. Freiheit heißt hier: nicht mehr aus Zwang, sondern aus Beziehung zu leben.',
    'Gal 5,22': 'Paulus stellt der „Frucht des Geistes" die „Werke des Fleisches" gegenüber (Streit, Neid, Zügellosigkeit u.a.). Die volle Aufzählung lautet: Liebe, Freude, Friede, Geduld, Freundlichkeit, Güte, Treue, Sanftmut, Selbstbeherrschung — neun Eigenschaften, die wie Früchte an einem Baum wachsen, nicht erzwungen werden.',
    'Röm 8,26': 'Paulus schreibt das mitten in einem Kapitel über die Hoffnung der Christen im Leiden: Wenn wir nicht wissen, wie und worum wir beten sollen, tritt der Geist selbst mit „unaussprechlichem Seufzen" für uns ein — Gebet als etwas, das nicht an perfekte Worte gebunden ist.',
    'Sach 4,6': 'Der Prophet Sacharja tröstet damit den Statthalter Serubbabel, der den zerstörten Tempel in Jerusalem wieder aufbauen soll — eine scheinbar unmögliche Aufgabe. Die Zusage: Nicht militärische Stärke, sondern Gottes Geist wird das Werk vollenden.',
    'Eph 5,18-19': 'Der ganze Vers lautet: „Berauscht euch nicht mit Wein — sondern lasst euch vom Geist erfüllen und redet miteinander in Psalmen, Hymnen und geistlichen Liedern.“ Paulus stellt zwei Arten des „Außer-sich-Seins" gegenüber: den Rausch des Weins und die Erfüllung durch Gottes Geist, die sich in gemeinsamem Singen und Danken zeigt.',
    'Apg 1,8': 'Das sind die letzten Worte Jesu vor seiner Himmelfahrt, unmittelbar vor dem Pfingstereignis: „Ihr werdet die Kraft des Heiligen Geistes empfangen, der auf euch kommen wird, und werdet meine Zeugen sein in Jerusalem und in ganz Judäa und Samarien und bis an das Ende der Erde.“ Ein Auftrag, der mit Pfingsten in Erfüllung geht.',
}

for z in t['zitate']:
    if z['quelle'] in zitat_kontext:
        z['text'] = zitat_kontext[z['quelle']]

with open('data/fragen.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Pfingsten-Fragen aktualisiert:', len(erklaerungen))
print('Pfingsten-Zitate aktualisiert:', len(zitat_kontext))

# HTML neu einbetten
with open('data/fragen.json', encoding='utf-8') as f:
    data = json.load(f)
compact = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
with open('index.html', encoding='utf-8') as f:
    html = f.read()
html_new = re.sub(r'window\.FRAGEN_DATA\s*=\s*\{.*?\};', 'window.FRAGEN_DATA = ' + compact + ';', html, flags=re.DOTALL)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_new)
print('index.html aktualisiert')
