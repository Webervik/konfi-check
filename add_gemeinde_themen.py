import json

with open('data/fragen.json', encoding='utf-8') as f:
    data = json.load(f)

q = '„'  # „
e = '“'  # "

def zitat(inhalt, quelle, link):
    return {"text": q + inhalt + e, "quelle": quelle, "link": link}

thema_geschichte = {
    "id": "gemeinde-geschichte",
    "titel": "Gemeinde – Geschichte",
    "icon": "🏛️",
    "farbe": "#7f8c8d",
    "zitate": [
        zitat("Die Steine schreien.", "Lk 19,40", "https://www.die-bibel.de/bibel/BB/LUK.19.40-LUK.19.40"),
        zitat("Gedenke der vorigen Zeiten und betrachte die Jahre, von Geschlecht zu Geschlecht.", "5 Mo 32,7", "https://www.die-bibel.de/bibel/BB/DEU.32.7-DEU.32.7"),
        zitat("Das ist der Tag, den der Herr gemacht hat; lasst uns freuen und fröhlich an ihm sein.", "Ps 118,24", "https://www.die-bibel.de/bibel/BB/PSA.118.24-PSA.118.24"),
        zitat("Ich will euch eine Zukunft und eine Hoffnung geben.", "Jer 29,11", "https://www.die-bibel.de/bibel/BB/JER.29.11-JER.29.11"),
        zitat("Erzählt es euren Kindern, und eure Kinder ihren Kindern.", "Joel 1,3", "https://www.die-bibel.de/bibel/BB/JOL.1.3-JOL.1.3"),
    ],
    "fragen": [
        {
            "id": "gg1",
            "typ": "multiple-choice",
            "schwierigkeit": 1,
            "frage": "Aus welchem Jahrhundert stammt die Dorfkirche Alt-Staaken ursprünglich?",
            "antworten": ["16. Jahrhundert", "14. Jahrhundert", "18. Jahrhundert", "12. Jahrhundert"],
            "richtig": 1,
            "erklaerung": "Die Dorfkirche Alt-Staaken wurde im frühen 14. Jahrhundert als rechteckiger Saalbau errichtet — sie ist damit eines der ältesten Gebäude im heutigen Spandau. Viele Generationen haben in ihr gebetet, geheiratet und Abschied genommen.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "gg2",
            "typ": "multiple-choice",
            "schwierigkeit": 1,
            "frage": "Wann wurde die Zuversichtskirche eingeweiht?",
            "antworten": ["1953", "1961", "1966", "1978"],
            "richtig": 2,
            "erklaerung": "Am 29. Mai 1966 wurde die Zuversichtskirche eingeweiht — entworfen von den Architekten Barbara und Wolfgang Vogt aus Kiel. Bemerkenswert: Der Bau wurde bereits im Juli 1961 beschlossen, unmittelbar vor dem Mauerbau!",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "gg3",
            "typ": "multiple-choice",
            "schwierigkeit": 2,
            "frage": "Was passierte mit der Dorfkirche Alt-Staaken nach dem Mauerbau 1961?",
            "antworten": [
                "Sie wurde geschlossen und versiegelt",
                "Fast das gesamte Inventar wurde entfernt",
                "Sie wurde zur Lagerhalle umgebaut",
                "Sie blieb unverändert erhalten"
            ],
            "richtig": 1,
            "erklaerung": "Die Dorfkirche lag in unmittelbarer Grenznähe zur Berliner Mauer. Unter dem Leitbild 'Neue Sachlichkeit' wurde fast das gesamte historische Inventar entfernt. Jahrzehntelang waren größere Umgestaltungspläne nicht umsetzbar. Erst 2000–2002 wurde die Kirche umfassend renoviert.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "gg4",
            "typ": "multiple-choice",
            "schwierigkeit": 2,
            "frage": "Aus welchem besonderen Material wurde die Kirche Gartenstadt gebaut?",
            "antworten": [
                "Aus importierten Natursteinen",
                "Aus Klinkersteinen eines abgerissenen Gebäudes",
                "Aus Beton und Stahl",
                "Aus Holz und Backstein"
            ],
            "richtig": 1,
            "erklaerung": "Die Kirche Gartenstadt wurde aus Klinkersteinen gebaut, die aus einem abgerissenen Gebäude geborgen wurden — ein frühes Beispiel für nachhaltiges Bauen! Die schlichte, klare Bauweise harmoniert bewusst mit der denkmalgeschützten Gartenstadtsiedlung.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "gg5",
            "typ": "multiple-choice",
            "schwierigkeit": 2,
            "frage": "Wann wurde die Gemeinde Heerstraße Nord gegründet?",
            "antworten": ["1. Januar 1966", "1. Januar 1969", "30. Mai 1971", "1. Januar 1976"],
            "richtig": 1,
            "erklaerung": "Die Gemeinde Heerstraße Nord wurde am 1. Januar 1969 gegründet. Die ersten Versammlungen fanden ab 1970 in einem angemieteten Ladenlokal statt. Das Gemeindehaus (heute Ernst-Lange-Haus) wurde am 30. Mai 1971 eingeweiht — von Bischof Kurt Scharf persönlich.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "gg6",
            "typ": "multiple-choice",
            "schwierigkeit": 3,
            "frage": "Mit welcher Gemeinde in Afrika pflegt Staaken eine offizielle Partnerschaft — seit 1982?",
            "antworten": ["Nairobi, Kenia", "Kana in Tanga, Tansania", "Kapstadt, Südafrika", "Accra, Ghana"],
            "richtig": 1,
            "erklaerung": "Seit 1982 verbindet die Gemeinde Staaken eine offizielle Partnerschaft mit der Gemeinde Kana in Tanga, Tansania. Die ersten Kontakte gab es schon 1966–1970 durch Gerda Nitschke. 1979 besuchte die erste Reisegruppe Tansania, 1990 wurde dort eine Kirche in Kisosora eingeweiht.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "gg7",
            "typ": "multiple-choice",
            "schwierigkeit": 3,
            "frage": "Wann wurde die Dorfkirche Alt-Staaken zuletzt umfassend renoviert und wer leitete das Projekt?",
            "antworten": [
                "1989, Architekt Helmut Jahn",
                "1995, Architekt Norman Foster",
                "2000–2002, Prof. Dr. Karsten Westphal",
                "2010–2012, Architekt Daniel Libeskind"
            ],
            "richtig": 2,
            "erklaerung": "Von 2000 bis 2002 wurde die Dorfkirche Alt-Staaken umfassend renoviert und neu gestaltet — unter Leitung von Prof. Dr. Karsten Westphal. Zur Ausstattung gehören ein Wandbild 'Versöhnte Einheit' des Künstlers Gabriele Mucchi sowie Glasfenster von Helge Warme.",
            "bibelstelle": None,
            "bibellink": None
        }
    ]
}

thema_aktuell = {
    "id": "gemeinde-aktuell",
    "titel": "Gemeinde – Aktuell",
    "icon": "🕊️",
    "farbe": "#27ae60",
    "zitate": [
        zitat("Einer trage des anderen Last.", "Gal 6,2", "https://www.die-bibel.de/bibel/BB/GAL.6.2-GAL.6.2"),
        zitat("Wo zwei oder drei in meinem Namen versammelt sind, bin ich mitten unter ihnen.", "Mt 18,20", "https://www.die-bibel.de/bibel/BB/MAT.18.20-MAT.18.20"),
        zitat("Diene einander, jeder mit der Gabe, die er empfangen hat.", "1 Petr 4,10", "https://www.die-bibel.de/bibel/BB/1PE.4.10-1PE.4.10"),
        zitat("Ihr seid das Licht der Welt.", "Mt 5,14", "https://www.die-bibel.de/bibel/BB/MAT.5.14-MAT.5.14"),
        zitat("Lasst uns Gutes tun an jedermann, allermeist aber an den Glaubensgenossen.", "Gal 6,10", "https://www.die-bibel.de/bibel/BB/GAL.6.10-GAL.6.10"),
    ],
    "fragen": [
        {
            "id": "ga1",
            "typ": "multiple-choice",
            "schwierigkeit": 1,
            "frage": "Wie viele Predigtorte (Kirchengebäude) hat die Evangelische Kirchengemeinde Staaken?",
            "antworten": ["2", "3", "4", "6"],
            "richtig": 3,
            "erklaerung": "Die Gemeinde hat sechs Standorte: Dorfkirche Alt-Staaken, Zuversichtskirche, Kirche Gartenstadt, Kirche Heerstraße Nord, Ernst-Lange-Haus und das Waldhaus am Sonnenhügel. Jeder Ort hat seinen eigenen Charakter und seine eigene Gemeinde.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "ga2",
            "typ": "multiple-choice",
            "schwierigkeit": 1,
            "frage": "Welches soziale Angebot gibt es jeden Donnerstag im Ernst-Lange-Haus?",
            "antworten": ["Suppenküche", "Laib & Seele – Lebensmittelausgabe", "Kleiderkammer", "Hausaufgabenhilfe"],
            "richtig": 1,
            "erklaerung": "'Laib & Seele' gibt es seit dem 21. April 2005 jeden Donnerstag von 12:30 bis 15 Uhr im Pillnitzer Weg 8. Für einen kleinen Beitrag von 2 Euro erhalten Bedürftige Lebensmittel. Das Angebot wird von Ehrenamtlichen getragen — Kirche, die sich kümmert.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "ga3",
            "typ": "multiple-choice",
            "schwierigkeit": 2,
            "frage": "Wer ist der Vorsitzende des Gemeindekirchenrats (GKR) der Evangelischen Kirchengemeinde Staaken?",
            "antworten": ["Viktor Weber", "Heike Everth", "Stefan Pfeiffer", "Carsten Albrecht"],
            "richtig": 2,
            "erklaerung": "Stefan Pfeiffer ist der Vorsitzende des Gemeindekirchenrats (GKR). Er führt zusammen mit 8 gewählten Ehrenamtlichen und den drei Pfarrpersonen die Gemeinde. Der GKR trifft sich monatlich, um alle wichtigen Entscheidungen zu treffen.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "ga4",
            "typ": "multiple-choice",
            "schwierigkeit": 2,
            "frage": "Wie viele Pfarrerinnen und Pfarrer hat die Evangelische Kirchengemeinde Staaken?",
            "antworten": ["1", "2", "3", "4"],
            "richtig": 2,
            "erklaerung": "Die Gemeinde hat drei Pfarrpersonen: Pfr. Viktor Weber, Pfrn. Heike Everth (zugleich stellvertretende GKR-Vorsitzende) und Pfr. Johannes Herzer. Zusammen begleiten sie die Menschen in den verschiedenen Stadtteilen und Standorten.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "ga5",
            "typ": "multiple-choice",
            "schwierigkeit": 2,
            "frage": "Was ist das Café Pi8?",
            "antworten": [
                "Ein Jugendclub im Keller der Dorfkirche",
                "Ein nachhaltiges Gemeindecafé im Ernst-Lange-Haus",
                "Ein Bibelkreis mit Kaffee und Kuchen",
                "Der Spitzname des Kirchenmusikers"
            ],
            "richtig": 1,
            "erklaerung": "Das Café Pi8 im Ernst-Lange-Haus (Pillnitzer Weg 8 — daher 'Pi8') öffnete am 10. Juni 2013. Es wird von Ehrenamtlichen geführt, kocht frisch, nachhaltig, regional und saisonal. Geöffnet: Mo 10–14 Uhr, Di–Fr 10–18 Uhr. Und es ist barrierefrei.",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "ga6",
            "typ": "multiple-choice",
            "schwierigkeit": 3,
            "frage": "Wie viele Chöre und Vokalensembles gibt es in der Gemeinde Staaken?",
            "antworten": ["2", "3", "5", "7"],
            "richtig": 2,
            "erklaerung": "Die Gemeinde hat fünf Ensembles: Kantorei Staaken, Capella Vocale, Chor in der Gartenstadt, Voices of Garden Town und den Kinderchor. Dazu kommt noch der Instrumentalkreis. Kirchenmusik ist in Staaken eine echte Herzensangelegenheit!",
            "bibelstelle": None,
            "bibellink": None
        },
        {
            "id": "ga7",
            "typ": "multiple-choice",
            "schwierigkeit": 3,
            "frage": "Welches besondere monatliche Gottesdienstformat bietet die Gemeinde freitagabends an?",
            "antworten": ["Gospel Night", "Music and Spirit Night", "Open Church", "Nightfever"],
            "richtig": 1,
            "erklaerung": "Die 'Music and Spirit Night' findet monatlich freitags um 19 Uhr im Ernst-Lange-Haus statt — mit Band, Musik und einem Gast-Talk. Ein Format, das Gottesdienst und Konzert verbindet und auch Menschen anspricht, die sonst eher selten in die Kirche kommen.",
            "bibelstelle": None,
            "bibellink": None
        }
    ]
}

data['themen'].append(thema_geschichte)
data['themen'].append(thema_aktuell)

with open('data/fragen.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Fertig! Jetzt {len(data['themen'])} Themen insgesamt.")
for t in data['themen']:
    print(f"  {t['icon']} {t['titel']} ({len(t['fragen'])} Fragen)")
