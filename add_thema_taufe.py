"""Fügt das Thema 'Taufe' hinzu — 10 Fragen in aufsteigender Komplexität + 7 Zitate mit Kontext."""
import json, re

BIBEL = 'https://www.die-bibel.de/bibel/BB/'

thema = {
    "id": "taufe",
    "titel": "Taufe",
    "icon": "💧",
    "farbe": "#2980b9",
    "fragen": [
        # ---------- Leicht ----------
        {
            "id": "tf1",
            "typ": "multiple-choice",
            "schwierigkeit": 1,
            "frage": "Welches Element gehört zu jeder christlichen Taufe?",
            "antworten": ["Wasser", "Öl", "Weihrauch", "Asche"],
            "richtig": 0,
            "erklaerung": "Wasser — das verbindet alle christlichen Kirchen weltweit, ob getaucht oder begossen wird. Öl (Salbung), Weihrauch und Asche (Aschermittwoch) haben in der Kirche ihren eigenen Platz, gehören aber nicht zur Taufe selbst. Wasser steht für beides zugleich: für Reinigung und für Lebensgefahr — man kann darin untergehen und daraus auftauchen.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "tf2",
            "typ": "multiple-choice",
            "schwierigkeit": 1,
            "frage": "An welchem Ort in der Kirche wird traditionell getauft?",
            "antworten": ["An der Kanzel", "Am Taufstein", "An der Orgel", "Am Altar"],
            "richtig": 1,
            "erklaerung": "Am Taufstein (auch Taufbecken oder Taufe genannt). In vielen alten Kirchen steht er bewusst am Eingang: Durch die Taufe kommt man in die Gemeinde hinein. Von der Kanzel wird gepredigt, am Altar Abendmahl gefeiert, an der Orgel musiziert — jeder Ort hat seine eigene Aufgabe. Schau beim nächsten Kirchenbesuch mal nach, wo der Taufstein steht.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "tf3",
            "typ": "multiple-choice",
            "schwierigkeit": 1,
            "frage": "In wessen Namen wird in der evangelischen Kirche getauft?",
            "antworten": [
                "Im Namen Jesu Christi, unseres Herrn und Erlösers",
                "Im Namen der Kirche und ihrer Gemeinde vor Ort",
                "Im Namen des Vaters, des Sohnes und des Heiligen Geistes",
                "Im Namen Gottes, Abrahams und aller Propheten"
            ],
            "richtig": 2,
            "erklaerung": "Getauft wird mit der trinitarischen Formel aus Mt 28,19. Spannend: Die Apostelgeschichte erzählt mehrfach von Taufen »auf den Namen Jesu« (Apg 2,38) — die frühe Kirche kannte offenbar beide Formen nebeneinander. Die trinitarische Formel setzte sich durch und ist heute die Grundlage dafür, dass die Kirchen ihre Taufen gegenseitig anerkennen. Getauft wird ausdrücklich nicht auf eine Gemeinde oder eine Konfession.",
            "bibelstelle": "Mt 28,19",
            "bibellink": BIBEL + "MAT.28.19-MAT.28.19"
        },
        # ---------- Mittel ----------
        {
            "id": "tf4",
            "typ": "multiple-choice",
            "schwierigkeit": 2,
            "frage": "Was bedeutet das griechische Wort »baptizein«, von dem sich »taufen« ableitet?",
            "antworten": ["besprengen, benetzen", "reinwaschen, säubern", "segnen, weihen", "eintauchen, untertauchen"],
            "richtig": 3,
            "erklaerung": "»Baptizein« heißt eintauchen oder untertauchen — die Urkirche taufte durch vollständiges Untertauchen, meist in fließendem Wasser. Das Besprengen setzte sich erst später durch, vor allem bei Kindertaufen. Auch das deutsche Wort »taufen« hängt mit »tief« zusammen. Reinwaschen und Weihen beschreiben Wirkungen, die man der Taufe zuschrieb, aber nicht die Wortbedeutung.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "tf5",
            "typ": "multiple-choice",
            "schwierigkeit": 2,
            "frage": "Warum tauft die evangelische Kirche auch Säuglinge?",
            "antworten": [
                "Weil Gottes Zusage dem Glauben des Menschen vorausgeht",
                "Weil ungetaufte Kinder sonst nicht in den Himmel kommen",
                "Weil die Bibel die Kindertaufe ausdrücklich anordnet",
                "Weil Kinder sonst nicht am Abendmahl teilnehmen dürfen"
            ],
            "richtig": 0,
            "erklaerung": "Der entscheidende Gedanke: Gott sagt Ja zu einem Menschen, bevor dieser irgendetwas leisten oder verstehen kann. Ehrlich bleiben muss man dabei: Das Neue Testament kennt kein ausdrückliches Gebot der Kindertaufe — es berichtet nur davon, dass »ganze Häuser« getauft wurden (Apg 16,15.33), wozu vermutlich auch Kinder gehörten. In der Reformation stritt Luther darüber heftig mit den Täufern, die nur Erwachsene taufen wollten. Die Vorstellung, ungetaufte Kinder kämen nicht in den Himmel, hat die evangelische Kirche ausdrücklich verworfen.",
            "bibelstelle": "Apg 16,33",
            "bibellink": BIBEL + "ACT.16.33-ACT.16.33"
        },
        {
            "id": "tf6",
            "typ": "multiple-choice",
            "schwierigkeit": 2,
            "frage": "Woran erinnerte sich Martin Luther selbst, wenn ihn Zweifel und Angst quälten?",
            "antworten": ["»Ich bin erwählt«", "»Ich bin gesegnet«", "»Ich bin berufen«", "»Ich bin getauft«"],
            "richtig": 3,
            "erklaerung": "»Baptizatus sum« — ich bin getauft. Luther soll es sich in dunklen Stunden auf den Tisch geschrieben haben. Der Gedanke dahinter: Die Taufe ist etwas, das mir von außen zugesprochen wurde. Sie hängt nicht davon ab, wie stark mein Glaube sich gerade anfühlt, und sie lässt sich nicht verlieren. Gerade weil Luther unter schweren Anfechtungen litt, war ihm dieser Halt wichtig.",
            "bibelstelle": None,
            "bibellink": None
        },
        # ---------- Schwer ----------
        {
            "id": "tf7",
            "typ": "multiple-choice",
            "schwierigkeit": 3,
            "frage": "Welchen Zusammenhang sieht Paulus zwischen der Taufe und dem Tod Christi?",
            "antworten": [
                "Der Getaufte wird von der Erbsünde Adams vollständig befreit",
                "Der Getaufte stirbt mit Christus und wird mit ihm auferweckt",
                "Der Getaufte empfängt den Geist und die Gabe der Prophetie",
                "Der Getaufte tritt an die Stelle der Beschneidung des Bundes"
            ],
            "richtig": 1,
            "erklaerung": "In Röm 6,3-4 deutet Paulus die Taufe als Mitsterben und Mitauferstehen: Wer untergetaucht wird, geht mit Christus ins Grab; wer auftaucht, beginnt ein neues Leben. Das Untertauchen war für ihn also nicht nur Technik, sondern Bild. Der Geist (Apg 2,38) und der Vergleich mit der Beschneidung (Kol 2,11) kommen im Neuen Testament ebenfalls vor — aber Röm 6 argumentiert vom Tod her. Von »Erbsünde« spricht erst die spätere Theologie, vor allem Augustin.",
            "bibelstelle": "Röm 6,3-4",
            "bibellink": BIBEL + "ROM.6.3-ROM.6.4"
        },
        {
            "id": "tf8",
            "typ": "multiple-choice",
            "schwierigkeit": 3,
            "frage": "In welchem Verhältnis stehen Taufe und Konfirmation zueinander?",
            "antworten": [
                "Die Konfirmation vollendet die zuvor unvollständige Taufe",
                "Die Konfirmation wiederholt die Taufe im Erwachsenenalter",
                "Die Konfirmation ist das dritte Sakrament der evangelischen Kirche",
                "Die Konfirmation bestätigt die Taufe, ersetzt sie aber nicht"
            ],
            "richtig": 3,
            "erklaerung": "»Confirmare« heißt bestätigen. Wer als Kind getauft wurde, sagt in der Konfirmation selbst Ja zu dem, was damals über ihm zugesprochen wurde. Die Taufe war dabei nie unvollständig — sie gilt von Anfang an ganz. Wiederholt wird sie auch nicht: Eine Taufe geschieht ein einziges Mal. Und ein Sakrament ist die Konfirmation nicht; die evangelische Kirche kennt nur zwei: Taufe und Abendmahl. Wer ungetauft konfirmiert wird, wird im Rahmen der Konfirmation getauft.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "tf9",
            "typ": "multiple-choice",
            "schwierigkeit": 3,
            "frage": "Warum war ausgerechnet Jesu eigene Taufe für die frühen Christen erklärungsbedürftig?",
            "antworten": [
                "Johannes war ein Konkurrent, dessen Anhänger man gewinnen wollte",
                "Die Taufe galt als heidnischer Brauch, den man ablehnen musste",
                "Johannes taufte zur Sündenvergebung — beim Sündlosen wirkte das befremdlich",
                "Jesus war nach damaligem jüdischem Recht dafür noch zu jung"
            ],
            "richtig": 2,
            "erklaerung": "Johannes rief zur Umkehr und taufte »zur Vergebung der Sünden« (Mk 1,4). Dass Jesus sich dieser Taufe unterzog, warf für die junge Christenheit die Frage auf: Wofür denn? Man sieht der Überlieferung die Verlegenheit an: Markus erzählt es noch schlicht, Matthäus fügt hinzu, dass Johannes sich zunächst weigert (Mt 3,14), Lukas erwähnt Johannes kaum noch, und das Johannesevangelium berichtet die Taufe gar nicht mehr. Genau deshalb halten Historiker sie für besonders gut bezeugt: Niemand erfindet eine Geschichte, die ihm peinlich ist. Fachleute nennen das das »Kriterium der Verlegenheit«.",
            "bibelstelle": "Mk 1,9-11",
            "bibellink": BIBEL + "MRK.1.9-MRK.1.11"
        },
        {
            "id": "tf10",
            "typ": "multiple-choice",
            "schwierigkeit": 3,
            "frage": "Warum erkennen die großen Kirchen in Deutschland die Taufen der jeweils anderen an?",
            "antworten": [
                "Weil sich die Kirchen auf einen gemeinsamen Taufritus geeinigt haben",
                "Weil nicht die Kirche tauft, sondern Christus durch ihren Dienst",
                "Weil die Taufe kein Sakrament, sondern nur ein äußeres Zeichen ist",
                "Weil das staatliche Kirchenrecht die Anerkennung vorschreibt"
            ],
            "richtig": 1,
            "erklaerung": "Der theologische Grund: Handelnder ist Gott, nicht die jeweilige Konfession. Deshalb zählt, dass mit Wasser und im Namen des dreieinigen Gottes getauft wurde — nicht, wer dabei am Taufstein stand. 2007 haben elf Kirchen in Deutschland das in der »Magdeburger Erklärung« gemeinsam festgehalten, darunter die katholische, die evangelische und die orthodoxen Kirchen. Ein einheitlicher Ritus wurde dafür gerade nicht vereinbart, und der Staat hat damit nichts zu tun. Wer die Konfession wechselt, wird darum nicht neu getauft.",
            "bibelstelle": "Eph 4,5",
            "bibellink": BIBEL + "EPH.4.5-EPH.4.5"
        },
    ],
    "zitate": [
        {
            "text": "„Geht zu allen Völkern und macht die Menschen zu meinen Jüngern: Tauft sie im Namen des Vaters und des Sohnes und des Heiligen Geistes.“",
            "quelle": "Mt 28,19",
            "link": BIBEL + "MAT.28.19-MAT.28.19",
            "kontext": "Die letzten Worte des Matthäusevangeliums, gesprochen auf einem Berg in Galiläa. Aus diesem sogenannten Taufbefehl stammt die Formel, die bis heute bei jeder Taufe gesprochen wird."
        },
        {
            "text": "„Ihr alle, die ihr auf Christus getauft seid, habt Christus angezogen. Da ist nicht Jude noch Grieche, nicht Sklave noch Freier, nicht Mann noch Frau.“",
            "quelle": "Gal 3,27-28",
            "link": BIBEL + "GAL.3.27-GAL.3.28",
            "kontext": "Paulus schreibt an eine zerstrittene Gemeinde. Sein Argument: In der Taufe fallen genau die Unterschiede weg, die damals über den sozialen Rang entschieden — Herkunft, Stand, Geschlecht."
        },
        {
            "text": "„Wir sind mit Christus begraben durch die Taufe in den Tod, damit auch wir in einem neuen Leben wandeln.“",
            "quelle": "Röm 6,4",
            "link": BIBEL + "ROM.6.4-ROM.6.4",
            "kontext": "Paulus deutet das Untertauchen als Begräbnis und das Auftauchen als Auferstehung — die Taufe als der Punkt, an dem das alte Leben endet und ein neues beginnt."
        },
        {
            "text": "„Fürchte dich nicht, denn ich habe dich erlöst; ich habe dich bei deinem Namen gerufen; du bist mein!“",
            "quelle": "Jes 43,1",
            "link": BIBEL + "ISA.43.1-ISA.43.1",
            "kontext": "Ursprünglich ein Zuspruch an das Volk Israel im babylonischen Exil. Weil hier Name und Zugehörigkeit zusammenkommen, gehört der Vers zu den beliebtesten Taufsprüchen überhaupt."
        },
        {
            "text": "„Ein Herr, ein Glaube, eine Taufe.“",
            "quelle": "Eph 4,5",
            "link": BIBEL + "EPH.4.5-EPH.4.5",
            "kontext": "Der Epheserbrief wirbt für die Einheit der Christen. Der Satz ist bis heute das wichtigste Argument dafür, dass eine Taufe nicht wiederholt und über Konfessionsgrenzen hinweg anerkannt wird."
        },
        {
            "text": "„Und als Jesus aus dem Wasser stieg, sah er den Himmel offen und den Geist wie eine Taube herabkommen. Und eine Stimme sprach: Du bist mein lieber Sohn.“",
            "quelle": "Mk 1,10-11",
            "link": BIBEL + "MRK.1.10-MRK.1.11",
            "kontext": "Die Taufe Jesu im Jordan bei Markus — die älteste Fassung der Geschichte. Der offene Himmel und die Stimme sind hier keine Belohnung für eine Leistung: Jesus hat zu diesem Zeitpunkt noch nichts getan."
        },
        {
            "text": "„Lasst die Kinder zu mir kommen und hindert sie nicht daran! Denn Menschen wie ihnen gehört das Reich Gottes.“",
            "quelle": "Mk 10,14",
            "link": BIBEL + "MRK.10.14-MRK.10.14",
            "kontext": "Jesus weist seine eigenen Jünger zurecht, die Kinder abweisen wollten. Der Satz ist zwar kein Taufbefehl, wurde aber in der Kirche früh als Begründung dafür herangezogen, auch Kinder zu taufen."
        },
    ]
}

with open('data/fragen.json', encoding='utf-8') as f:
    data = json.load(f)

if any(t['id'] == 'taufe' for t in data['themen']):
    raise SystemExit('Thema "taufe" existiert bereits — Abbruch.')

# Nach "gemeinde" einsortieren, damit es thematisch bei Kirche/Gemeinde steht
data['themen'].append(thema)

with open('data/fragen.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Thema 'Taufe' hinzugefügt: {len(thema['fragen'])} Fragen, {len(thema['zitate'])} Zitate")
print('Schwierigkeitsverteilung:', {s: sum(1 for q in thema['fragen'] if q['schwierigkeit'] == s) for s in (1, 2, 3)})

# --- Re-Embed in index.html ---
compact = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
with open('index.html', encoding='utf-8') as f:
    html = f.read()
html_new = re.sub(r'window\.FRAGEN_DATA\s*=\s*\{.*?\};', 'window.FRAGEN_DATA = ' + compact + ';', html, flags=re.DOTALL)
if html_new == html:
    raise SystemExit('FEHLER: FRAGEN_DATA in index.html nicht gefunden!')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_new)
print('index.html aktualisiert, Themen gesamt:', len(data['themen']))
