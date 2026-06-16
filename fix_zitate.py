import json

with open('data/fragen.json', encoding='utf-8') as f:
    data = json.load(f)

def z(text, quelle, link):
    return {"text": text, "quelle": quelle, "link": link}

q = '„'  # „
e = '“'  # "

def zitat(inhalt, quelle, link):
    return {"text": q + inhalt + e, "quelle": quelle, "link": link}

replacements = {
    'gemeinde': [
        zitat("Einer trage des anderen Last.", "Gal 6,2", "https://www.die-bibel.de/bibel/BB/GAL.6.2-GAL.6.2"),
        zitat("Die Liebe ist geduldig und gütig.", "1 Kor 13,4", "https://www.die-bibel.de/bibel/BB/1CO.13.4-1CO.13.4"),
        zitat("Seid freundlich zueinander und vergebt einander.", "Eph 4,32", "https://www.die-bibel.de/bibel/BB/EPH.4.32-EPH.4.32"),
        zitat("Ihr seid Gottes Tempel.", "1 Kor 3,16", "https://www.die-bibel.de/bibel/BB/1CO.3.16-1CO.3.16"),
        zitat("Wo zwei oder drei in meinem Namen versammelt sind, bin ich mitten unter ihnen.", "Mt 18,20", "https://www.die-bibel.de/bibel/BB/MAT.18.20-MAT.18.20"),
    ],
    'jesus-historisch': [
        zitat("Das Wort wurde Fleisch und wohnte unter uns.", "Joh 1,14", "https://www.die-bibel.de/bibel/BB/JHN.1.14-JHN.1.14"),
        zitat("Jesus zog umher und tat Gutes.", "Apg 10,38", "https://www.die-bibel.de/bibel/BB/ACT.10.38-ACT.10.38"),
        zitat("Ich bin nicht gekommen, Gerechte zu rufen, sondern Sünder.", "Mk 2,17", "https://www.die-bibel.de/bibel/BB/MRK.2.17-MRK.2.17"),
        zitat("Kann aus Nazareth etwas Gutes kommen?", "Joh 1,46", "https://www.die-bibel.de/bibel/BB/JHN.1.46-JHN.1.46"),
        zitat("Ich muss in dem sein, was meines Vaters ist.", "Lk 2,49", "https://www.die-bibel.de/bibel/BB/LUK.2.49-LUK.2.49"),
    ],
    'jesu-taten': [
        zitat("Bei Gott ist kein Ding unmöglich.", "Lk 1,37", "https://www.die-bibel.de/bibel/BB/LUK.1.37-LUK.1.37"),
        zitat("Wenn ihr Glauben habt wie ein Senfkorn, werdet ihr zu diesem Berg sagen: Heb dich dorthin! — und er wird sich heben.", "Mt 17,20", "https://www.die-bibel.de/bibel/BB/MAT.17.20-MAT.17.20"),
        zitat("Was ist das für ein Mensch, dass ihm sogar Wind und See gehorchen?", "Mt 8,27", "https://www.die-bibel.de/bibel/BB/MAT.8.27-MAT.8.27"),
        zitat("Steh auf und geh — dein Glaube hat dich gerettet.", "Lk 17,19", "https://www.die-bibel.de/bibel/BB/LUK.17.19-LUK.17.19"),
        zitat("Ich will es tun — sei rein!", "Mk 1,41", "https://www.die-bibel.de/bibel/BB/MRK.1.41-MRK.1.41"),
    ],
    'jesu-worte': [
        zitat("Kommt her zu mir, alle die ihr mühselig und beladen seid.", "Mt 11,28", "https://www.die-bibel.de/bibel/BB/MAT.11.28-MAT.11.28"),
        zitat("Liebt einander, wie ich euch geliebt habe.", "Joh 15,12", "https://www.die-bibel.de/bibel/BB/JHN.15.12-JHN.15.12"),
        zitat("Ich bin der Weg, die Wahrheit und das Leben.", "Joh 14,6", "https://www.die-bibel.de/bibel/BB/JHN.14.6-JHN.14.6"),
        zitat("Euer Herz erschrecke nicht.", "Joh 14,1", "https://www.die-bibel.de/bibel/BB/JHN.14.1-JHN.14.1"),
        zitat("Der Friede sei mit euch.", "Joh 20,19", "https://www.die-bibel.de/bibel/BB/JHN.20.19-JHN.20.19"),
    ],
    'gleichnisse': [
        zitat("Das Himmelreich gleicht einem Senfkorn.", "Mt 13,31", "https://www.die-bibel.de/bibel/BB/MAT.13.31-MAT.13.31"),
        zitat("Wer Ohren hat, der höre.", "Mk 4,9", "https://www.die-bibel.de/bibel/BB/MRK.4.9-MRK.4.9"),
        zitat("Der Menschensohn ist gekommen zu suchen und zu retten, was verloren war.", "Lk 19,10", "https://www.die-bibel.de/bibel/BB/LUK.19.10-LUK.19.10"),
        zitat("Das Himmelreich ist wie ein Netz, das ins Meer geworfen wird.", "Mt 13,47", "https://www.die-bibel.de/bibel/BB/MAT.13.47-MAT.13.47"),
        zitat("Welche Frau, die zehn Silbermünzen hat, zündet nicht ein Licht an?", "Lk 15,8", "https://www.die-bibel.de/bibel/BB/LUK.15.8-LUK.15.8"),
    ],
    'gebote-bergpredigt': [
        zitat("Was ihr getan habt einem meiner geringsten Geschwister, das habt ihr mir getan.", "Mt 25,40", "https://www.die-bibel.de/bibel/BB/MAT.25.40-MAT.25.40"),
        zitat("Liebe Gott, deinen Herrn — und deinen Nächsten wie dich selbst.", "Mk 12,30-31", "https://www.die-bibel.de/bibel/BB/MRK.12.30-MRK.12.31"),
        zitat("Bittet, so wird euch gegeben; suchet, so werdet ihr finden.", "Mt 7,7", "https://www.die-bibel.de/bibel/BB/MAT.7.7-MAT.7.7"),
        zitat("Selig sind die Friedensstifter.", "Mt 5,9", "https://www.die-bibel.de/bibel/BB/MAT.5.9-MAT.5.9"),
        zitat("Euer Ja sei ein Ja, euer Nein ein Nein.", "Mt 5,37", "https://www.die-bibel.de/bibel/BB/MAT.5.37-MAT.5.37"),
    ],
    'evangelische-kirche': [
        zitat("Hier stehe ich, ich kann nicht anders. Gott helfe mir.", "Martin Luther, Worms 1521", "https://www.die-bibel.de/bibel/BB/ROM.1.17-ROM.1.17"),
        zitat("Der Gerechte wird aus Glauben leben.", "Röm 1,17", "https://www.die-bibel.de/bibel/BB/ROM.1.17-ROM.1.17"),
        zitat("Zur Freiheit hat uns Christus befreit.", "Gal 5,1", "https://www.die-bibel.de/bibel/BB/GAL.5.1-GAL.5.1"),
        zitat("Ihr seid ein auserwähltes Geschlecht, eine königliche Priesterschaft.", "1 Petr 2,9", "https://www.die-bibel.de/bibel/BB/1PE.2.9-1PE.2.9"),
        zitat("Alles vermag ich durch den, der mich stärkt.", "Phil 4,13", "https://www.die-bibel.de/bibel/BB/PHP.4.13-PHP.4.13"),
    ],
}

for thema in data['themen']:
    if thema['id'] in replacements:
        thema['zitate'] = replacements[thema['id']]
        print(f"OK: {thema['titel']} ({len(thema['zitate'])} Zitate)")

with open('data/fragen.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Fertig!")
