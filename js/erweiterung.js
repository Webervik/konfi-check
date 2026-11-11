// =====================================================
// KONFI-CHECK · Erweiterung (November 2026)
// Profil merken, Startleiste, Tagesrunde, Wochenduell,
// Meisterrunde, gezeichnete Orte, Installierbarkeit
// =====================================================

const DUELL_GRUPPEN = [
  { name: 'Konfis Dorfkirche', kurz: 'Dorfkirche', bild: 'dorfkirche', farbe: '#b5532a' },
  { name: 'Konfis Gartenstadt', kurz: 'Gartenstadt', bild: 'gartenstadt', farbe: '#4f8a4b' },
];
const MEISTER_SEKUNDEN = 15;

// ---------- kleine Helfer ----------
function heuteKey() {
  return new Date().toISOString().slice(0, 10);
}

// Fester Zufall aus einem Text (Datum) — alle bekommen am selben Tag dieselben Fragen
function saatZufall(text) {
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function mische(liste, zufall = Math.random) {
  for (let i = liste.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [liste[i], liste[j]] = [liste[j], liste[i]];
  }
  return liste;
}

// ---------- Profil: Name und Gruppe nur einmal fragen ----------
function speichereProfil(name, gruppe) {
  const lokal = ladeLokal();
  lokal.name = name;
  lokal.gruppe = gruppe;
  speichereLokal(lokal);
  renderProfil();
}

function renderProfil(formularZeigen = false) {
  const lokal = ladeLokal();
  const form = document.getElementById('profil-form');
  const zeile = document.getElementById('profil-zeile');
  const bekannt = !!(lokal.name && lokal.gruppe);

  if (bekannt) {
    const input = document.getElementById('input-name');
    if (!input.value) input.value = lokal.name;
    if (!document.querySelector('.gruppe-btn.selected')) {
      document.querySelectorAll('.gruppe-btn').forEach(b => {
        b.classList.toggle('selected', b.dataset.gruppe === lokal.gruppe);
      });
    }
  }

  if (bekannt && !formularZeigen) {
    form.style.display = 'none';
    zeile.style.display = 'flex';
    zeile.innerHTML = `<span>Hallo <strong>${escapeHtml(lokal.name)}</strong> · ${escapeHtml(lokal.gruppe)}</span>
      <button type="button" class="profil-aendern" id="btn-profil-aendern">ändern</button>`;
    document.getElementById('btn-profil-aendern').onclick = () => renderProfil(true);
  } else {
    form.style.display = 'block';
    zeile.style.display = 'none';
  }
}

// Liest das Profil aus dem Formular; fehlt etwas, wird das Formular gezeigt und markiert
function profilAusFormular() {
  const name = document.getElementById('input-name').value.trim();
  const gruppe = document.querySelector('.gruppe-btn.selected')?.dataset.gruppe;
  if (!name || !gruppe) {
    renderProfil(true);
    document.getElementById('profil-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
    shakeRed(!name ? 'input-name' : 'gruppe-grid');
    return null;
  }
  return { name, gruppe };
}

// ---------- Startleiste: zeigt, was der nächste Tipp auslöst ----------
function aktualisiereStartLeiste() {
  const btn = document.getElementById('btn-start');
  const meister = document.getElementById('btn-meister');
  if (!btn) return;
  const themaId = document.querySelector('.thema-card.selected, .pw-station.selected')?.dataset.thema;
  const thema = themaId && window.fragenData.themen.find(t => t.id === themaId);
  if (!thema) {
    btn.textContent = 'Tippe auf eine Station';
    btn.classList.add('btn-wartet');
    meister.style.display = 'none';
    return;
  }
  btn.classList.remove('btn-wartet');
  const lokal = ladeLokal();
  const best = (lokal.bestScores || {})[themaId];
  btn.textContent = best === undefined ? `▶ ${thema.titel} starten` : `▶ ${thema.titel} nochmal spielen`;
  if (best === 100) {
    meister.style.display = 'block';
    meister.textContent = (lokal.meister || {})[themaId]
      ? '👑 Meisterrunde geschafft · nochmal'
      : `👑 Meisterrunde · ${MEISTER_SEKUNDEN} Sekunden pro Frage`;
  } else {
    meister.style.display = 'none';
  }
}

function quizStartZustand(profil) {
  state.name = profil.name;
  state.gruppe = profil.gruppe;
  state.aktuelleIndex = 0;
  state.punkte = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.antworten = [];
  state.pauseCount = 0;
  state.showZitat = false;
}

// ---------- Tagesrunde: 3 Fragen, für alle dieselben ----------
function tagesrundeFragen() {
  const zufall = saatZufall('tagesrunde-' + heuteKey());
  const alle = [];
  window.fragenData.themen.forEach(t => {
    t.fragen.forEach(f => { if (f.typ !== 'bild') alle.push({ ...f, _thema: t.titel }); });
  });
  return mische(alle, zufall).slice(0, 3);
}

function starteTagesrunde() {
  const profil = profilAusFormular();
  if (!profil) return;
  speichereProfil(profil.name, profil.gruppe);
  state.modus = 'tagesrunde';
  state.thema = { id: 'tagesrunde', titel: 'Tagesrunde', icon: '☀️', zitate: [], fragen: tagesrundeFragen() };
  state.fragen = [...state.thema.fragen];
  quizStartZustand(profil);
  startQuiz();
}

function renderTagesrunde() {
  const el = document.getElementById('tagesrunde-box');
  if (!el) return;
  const stand = ladeLokal().tagesrunde;
  if (stand && stand.datum === heuteKey()) {
    el.innerHTML = `<div class="tagesrunde-fertig">☀️ Tagesrunde geschafft: <strong>${stand.punkte} von 3</strong>. Morgen gibt es drei neue Fragen.</div>`;
  } else {
    el.innerHTML = `<button type="button" class="btn tagesrunde-btn" id="btn-tagesrunde">
        <span class="tagesrunde-titel">☀️ Tagesrunde</span>
        <span class="tagesrunde-unter">3 Fragen · 1 Minute · heute für alle dieselben</span>
      </button>`;
    document.getElementById('btn-tagesrunde').onclick = starteTagesrunde;
  }
}

// ---------- Meisterrunde: gleiche Fragen, aber gegen die Uhr ----------
let meisterTimer = null;

function starteMeister() {
  const profil = profilAusFormular();
  if (!profil) return;
  const themaId = document.querySelector('.thema-card.selected, .pw-station.selected')?.dataset.thema;
  const thema = themaId && window.fragenData.themen.find(t => t.id === themaId);
  if (!thema) return;
  speichereProfil(profil.name, profil.gruppe);
  state.modus = 'meister';
  state.thema = thema;
  state.fragen = mische([...thema.fragen]);
  quizStartZustand(profil);
  startQuiz();
}

function stoppeMeisterTimer() {
  if (meisterTimer) {
    clearInterval(meisterTimer);
    meisterTimer = null;
  }
}

function starteMeisterTimer(frage, grid) {
  stoppeMeisterTimer();
  const card = document.getElementById('quiz-card');
  const leiste = document.createElement('div');
  leiste.className = 'meister-uhr';
  leiste.innerHTML = '<div class="meister-uhr-fuellung" id="meister-uhr-fuellung"></div>';
  card.insertBefore(leiste, card.firstChild);
  const ende = Date.now() + MEISTER_SEKUNDEN * 1000;
  meisterTimer = setInterval(() => {
    const rest = ende - Date.now();
    const fuellung = document.getElementById('meister-uhr-fuellung');
    if (!fuellung) { stoppeMeisterTimer(); return; }
    fuellung.style.width = Math.max(0, rest / (MEISTER_SEKUNDEN * 10)) + '%';
    fuellung.classList.toggle('knapp', rest < 5000);
    if (rest <= 0) antwortGewählt(-1, frage, grid); // Zeit abgelaufen zählt als falsch
  }, 100);
}

// ---------- Ergebnis: Zusatzmeldungen für Tages- und Meisterrunde ----------
function ergebnisZusatz(_lokal, punkte, total) {
  const lokal = ladeLokal();
  let html = '';
  if (state.modus === 'tagesrunde') {
    if (!lokal.tagesrunde || lokal.tagesrunde.datum !== heuteKey()) {
      lokal.tagesrunde = { datum: heuteKey(), punkte };
      speichereLokal(lokal);
    }
    html += `<div class="tages-bonus">☀️ Tagesrunde erledigt. Morgen warten drei neue Fragen.</div>`;
  }
  if (state.modus === 'meister') {
    if (punkte >= total - 1) {
      lokal.meister = lokal.meister || {};
      const neu = !lokal.meister[state.thema.id];
      lokal.meister[state.thema.id] = true;
      speichereLokal(lokal);
      renderThemenGrid();
      html += `<div class="level-up">👑 ${neu ? 'Meisterrunde geschafft!' : 'Wieder geschafft!'} „${state.thema.titel}" trägt jetzt eine Krone.</div>`;
    } else {
      html += `<div class="fast-geschafft">👑 Für die Krone brauchst du mindestens ${total - 1} von ${total} — gegen die Uhr. Versuch es nochmal.</div>`;
    }
  }
  return html;
}

// ---------- Wochenduell Dorfkirche gegen Gartenstadt ----------
let duellScores = null;
let duellLaedt = null;

function wochenStart(datum) {
  const d = new Date(datum);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Montag
  return d;
}

// Pro Person und Thema zählt in einer Woche nur das beste Ergebnis.
// So gewinnt, wer viele Leute und viele Themen zusammenbringt — nicht, wer ein Thema zehnmal spielt.
function duellPunkte(scores, von, bis) {
  const beste = {};
  scores.forEach(s => {
    const zeit = new Date(s.erstellt_am);
    if (zeit < von || zeit >= bis) return;
    const gruppe = DUELL_GRUPPEN.find(g => g.name === s.gruppe);
    if (!gruppe) return;
    const tag = s.thema === 'tagesrunde' ? '|' + s.erstellt_am.slice(0, 10) : '';
    const key = gruppe.name + '|' + s.name.trim().toLowerCase() + '|' + s.thema + tag;
    beste[key] = Math.max(beste[key] || 0, s.punkte);
  });
  const ergebnis = {};
  DUELL_GRUPPEN.forEach(g => { ergebnis[g.name] = { punkte: 0, leute: new Set() }; });
  Object.entries(beste).forEach(([key, punkte]) => {
    const [gruppe, name] = key.split('|');
    ergebnis[gruppe].punkte += punkte;
    ergebnis[gruppe].leute.add(name);
  });
  return ergebnis;
}

async function renderWochenduell(neuLaden = false) {
  const el = document.getElementById('duell-box');
  if (!el) return;
  if (!duellScores || neuLaden) {
    // Laufende Abfrage wiederverwenden, statt bei jedem Aufruf neu zu laden
    if (!duellLaedt) {
      duellLaedt = (async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        try {
          const res = await fetch(`${SCORE_API}/scores`, { signal: controller.signal });
          return await res.json();
        } finally {
          clearTimeout(timeout);
        }
      })();
    }
    try {
      duellScores = await duellLaedt;
    } catch (e) {
      if (!duellScores) { el.style.display = 'none'; duellLaedt = null; return; }
    }
    duellLaedt = null;
  }
  const start = wochenStart(new Date());
  const ende = new Date(start); ende.setDate(ende.getDate() + 7);
  const vorwoche = new Date(start); vorwoche.setDate(vorwoche.getDate() - 7);

  const jetzt = duellPunkte(duellScores, start, ende);
  const davor = duellPunkte(duellScores, vorwoche, start);
  const [a, b] = DUELL_GRUPPEN;
  const pa = jetzt[a.name].punkte, pb = jetzt[b.name].punkte;
  const summe = pa + pb;
  const tageRest = Math.max(1, Math.ceil((ende - new Date()) / 86400000));

  let stand;
  if (summe === 0) stand = 'Noch kein Punkt in dieser Woche. Wer holt den ersten?';
  else if (pa === pb) stand = 'Gleichstand!';
  else stand = `${pa > pb ? a.kurz : b.kurz} führt mit ${Math.abs(pa - pb)} Punkt${Math.abs(pa - pb) === 1 ? '' : 'en'}.`;

  const va = davor[a.name].punkte, vb = davor[b.name].punkte;
  let letzte = '';
  if (va + vb > 0) {
    letzte = va === vb
      ? `Letzte Woche: unentschieden (${va} : ${vb})`
      : `Letzte Woche gewann ${va > vb ? a.kurz : b.kurz} (${va} : ${vb})`;
  }

  const meine = ladeLokal().gruppe;
  const zeile = (g, punkte, leute) => `
    <div class="duell-zeile${meine === g.name ? ' duell-meine' : ''}">
      <svg class="duell-bild" viewBox="-22 -22 44 44" aria-hidden="true">${ortGlyph(g.bild, 0, 0, 1)}</svg>
      <div class="duell-mitte">
        <div class="duell-name">${g.kurz}${meine === g.name ? ' <span class="duell-du">dein Team</span>' : ''}</div>
        <div class="duell-balken"><div class="duell-fuellung" style="width:${summe ? Math.max(4, Math.round(punkte / summe * 100)) : 4}%; background:${g.farbe}"></div></div>
        <div class="duell-leute">${leute} ${leute === 1 ? 'Person' : 'Personen'} dabei</div>
      </div>
      <div class="duell-punkte">${punkte}</div>
    </div>`;

  el.style.display = 'block';
  el.innerHTML = `
    <div class="duell-kopf"><span>Wochenduell</span><span>noch ${tageRest} ${tageRest === 1 ? 'Tag' : 'Tage'}</span></div>
    ${zeile(a, pa, jetzt[a.name].leute.size)}
    ${zeile(b, pb, jetzt[b.name].leute.size)}
    <div class="duell-stand">${stand}</div>
    ${letzte ? `<div class="duell-letzte">${letzte}</div>` : ''}
    <div class="duell-regel">Pro Person und Thema zählt das beste Ergebnis der Woche.</div>`;
}

// ---------- Gezeichnete Orte (stilisiert) ----------
// Jede Zeichnung liegt in einem Feld von etwa -17 … 17 um den Mittelpunkt.
const ORT_STRICH = 'stroke="#4a3b28" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"';
const ORT_BILDER = {
  // Saalkirche aus Klinker mit Dachreiter, daneben ein Baum
  gartenstadt: `<circle cx="11" cy="2" r="6" fill="#7fae6b" ${ORT_STRICH}/><path d="M11 8v6" ${ORT_STRICH} fill="none"/>
    <path d="M-15 14v-11l9-8 9 8v11z" fill="#c8794f" ${ORT_STRICH}/><path d="M-9 -8v-5h6v5" fill="#c8794f" ${ORT_STRICH}/>
    <path d="M-6 -13v-4M-8 -15.5h4" ${ORT_STRICH} fill="none"/><path d="M-8.5 14v-6h5v6" fill="#fffaf0" ${ORT_STRICH}/>`,
  // Weiße Dorfkirche mit rotem Dach und Westturm
  dorfkirche: `<path d="M-4 14v-12h18v12z" fill="#fffaf0" ${ORT_STRICH}/><path d="M-5 2l9.5-7 10.5 7z" fill="#b5532a" ${ORT_STRICH}/>
    <path d="M-15 14v-19h10v19z" fill="#fffaf0" ${ORT_STRICH}/><path d="M-16 -5l6-9 6 9z" fill="#b5532a" ${ORT_STRICH}/>
    <path d="M-10 -14v-4M-12 -16.5h4" ${ORT_STRICH} fill="none"/><path d="M2 14v-6a2.5 2.5 0 015 0v6" fill="#d9c9a8" ${ORT_STRICH}/>
    <circle cx="-10" cy="0" r="1.6" fill="#d9c9a8" ${ORT_STRICH}/>`,
  // Hütte zwischen zwei Tannen
  waldhaus: `<path d="M-12 14l-5 0 5-9-3 0 4-8 4 8-3 0 5 9z" fill="#5f9659" ${ORT_STRICH}/><path d="M14 14l-4 0 4-8-2.5 0 3.5-7 3.5 7-2.5 0 4 8z" fill="#5f9659" ${ORT_STRICH}/>
    <path d="M-6 14v-8l7-6 7 6v8z" fill="#c9a26b" ${ORT_STRICH}/><path d="M-1 14v-5h4v5" fill="#fffaf0" ${ORT_STRICH}/>`,
  // Flaches Gemeindehaus mit Café-Tasse
  elh: `<path d="M-16 14v-13h32v13z" fill="#e9dcc0" ${ORT_STRICH}/><path d="M-17 1h34" ${ORT_STRICH} fill="none"/>
    <path d="M-12 5h5v4h-5zM-4 5h5v4h-5z" fill="#fffaf0" ${ORT_STRICH}/><path d="M6 14v-8h6v8" fill="#b5532a" ${ORT_STRICH}/>
    <path d="M-5 -6h9v3a4 4 0 01-9 0zM4 -5.5h2a1.5 1.5 0 010 3h-2" fill="#fffaf0" ${ORT_STRICH}/><path d="M-3 -9c0-2 2-2 2-4M1 -9c0-2 2-2 2-4" ${ORT_STRICH} fill="none"/>`,
  // Freistehender Glockenturm (die Kirche selbst steht nicht mehr)
  zuversicht: `<path d="M-5 15v-28h10v28z" fill="#c8794f" ${ORT_STRICH} stroke-dasharray="3 2.5"/><path d="M-3 -9h6M-3 -5h6M-3 -1h6" ${ORT_STRICH} fill="none"/>
    <path d="M0 -13v-4M-2 -15.5h4" ${ORT_STRICH} fill="none"/>`,
  // Vieleckiger Bau mit Fensterband
  heerstrasse: `<path d="M-15 14v-11l5-4h20l5 4v11z" fill="#c8794f" ${ORT_STRICH}/><path d="M-16 -1l5-6h22l5 6" fill="#d7dfe6" ${ORT_STRICH}/>
    <path d="M-8 -6v5M-3 -7v6M2 -7v6M7 -6v5" ${ORT_STRICH} fill="none"/><path d="M-2.5 14v-6h5v6" fill="#fffaf0" ${ORT_STRICH}/>
    <path d="M-10 4v6M-12.5 6.5h5" ${ORT_STRICH} fill="none"/>`,
  // Gotische Backsteinkirche mit hohem Turm und Haube
  nikolai: `<path d="M-2 14v-10h16v10z" fill="#c8794f" ${ORT_STRICH}/><path d="M-3 4l9-7 9 7z" fill="#8a5a3c" ${ORT_STRICH}/>
    <path d="M-14 14v-18h10v18z" fill="#c8794f" ${ORT_STRICH}/><path d="M-15 -4h12l-2-4h-8z" fill="#6f8f7a" ${ORT_STRICH}/>
    <path d="M-11.5 -8v-3h5v3M-9 -11v-6" fill="#6f8f7a" ${ORT_STRICH}/><path d="M3 14v-5a2 2 0 014 0v5M9 14v-5a2 2 0 014 0v5" fill="#fffaf0" ${ORT_STRICH}/>`,
  // Turmruine mit abgebrochener Spitze, daneben der neue Turm
  gedaechtnis: `<path d="M-14 14v-20l2-3 2 2 2-5 2 4 2-2 2 4v20z" fill="#b9ad98" ${ORT_STRICH}/><path d="M-10 14v-6a2 2 0 014 0v6" fill="#4a3b28" ${ORT_STRICH}/>
    <circle cx="-8" cy="-1" r="2.2" fill="#fffaf0" ${ORT_STRICH}/>
    <path d="M5 14v-22h9v22z" fill="#6f8fb0" ${ORT_STRICH}/><path d="M5 -3h9M5 2h9M5 7h9M9.5 -8v22" ${ORT_STRICH} fill="none"/><path d="M9.5 -8v-5M7.5 -11h4" ${ORT_STRICH} fill="none"/>`,
  // Große Kuppel mit Laterne und zwei Eckkuppeln
  dom: `<path d="M-16 14v-9h32v9z" fill="#e9dcc0" ${ORT_STRICH}/><path d="M-9 5a9 10 0 0118 0z" fill="#7fa594" ${ORT_STRICH}/>
    <path d="M-2 -5v-3h4v3M0 -8v-6M-2 -11.5h4" fill="#7fa594" ${ORT_STRICH}/>
    <path d="M-16 5a3.5 4 0 017 0zM9 5a3.5 4 0 017 0z" fill="#7fa594" ${ORT_STRICH}/><path d="M-3 14v-5a3 3 0 016 0v5" fill="#fffaf0" ${ORT_STRICH}/>`,
  // Verwaltungsbau mit Fensterraster
  konsistorium: `<path d="M-13 14v-24h26v24z" fill="#e9dcc0" ${ORT_STRICH}/>
    <path d="M-9 -6h4v4h-4zM-2 -6h4v4h-4zM5 -6h4v4h-4zM-9 2h4v4h-4zM5 2h4v4h-4z" fill="#fffaf0" ${ORT_STRICH}/>
    <path d="M-2.5 14v-9h5v9" fill="#b5532a" ${ORT_STRICH}/><path d="M0 -10v-6M-2.5 -13.5h5" ${ORT_STRICH} fill="none"/>`,
  // Schlosskirche: runder Turm mit Kronenhaube, daneben die Thesentür
  wittenberg: `<path d="M-13 14v-20h10v20z" fill="#e9dcc0" ${ORT_STRICH}/><path d="M-14 -6h12l-1.5-4h-9z" fill="#6f8f7a" ${ORT_STRICH}/>
    <path d="M-11 -10l3-7 3 7z" fill="#6f8f7a" ${ORT_STRICH}/><path d="M-13 0h10" ${ORT_STRICH} fill="none"/>
    <path d="M-1 14v-11h15v11z" fill="#e9dcc0" ${ORT_STRICH}/><path d="M3 14v-7a3.5 3.5 0 017 0v7z" fill="#8a5a3c" ${ORT_STRICH}/><path d="M6.5 5v9" ${ORT_STRICH} fill="none"/>`,
  // Würfelhäuser mit Flachdach
  nazareth: `<path d="M-16 14v-9h11v9z" fill="#f1e4c3" ${ORT_STRICH}/><path d="M-6 14v-15h12v15z" fill="#fffaf0" ${ORT_STRICH}/><path d="M5 14v-8h11v8z" fill="#f1e4c3" ${ORT_STRICH}/>
    <path d="M-2 14v-5h4v5M-13 8h3v3h-3zM9 9h3v3h-3zM-3 -1v-3h6v3" fill="#c9a26b" ${ORT_STRICH}/>
    <circle cx="11" cy="-9" r="3.5" fill="#f1c40f" ${ORT_STRICH}/>`,
  // Fluss mit Schilf
  jordan: `<path d="M-16 -3c5-4 9 4 16 0s11-4 16 0v16c-5-4-9 4-16 0s-11 4-16 0z" fill="#8fb8d6" ${ORT_STRICH}/>
    <path d="M-12 4c4-3 7 3 11 0M2 8c4-3 7 3 11 0" ${ORT_STRICH} fill="none"/>
    <path d="M-10 -5v-10M-13 -6l1-7M-7 -6l-1-7M10 -4v-9M13 -5l-1-6" ${ORT_STRICH} fill="none"/>`,
  // Fischerboot mit Segel auf Wellen
  genezareth: `<path d="M-16 9c4-3 6 3 10 0s6 3 10 0 6 3 12 0v6h-32z" fill="#8fb8d6" ${ORT_STRICH}/>
    <path d="M-12 4h22l-4 6h-14z" fill="#b5532a" ${ORT_STRICH}/><path d="M-1 4v-19" ${ORT_STRICH} fill="none"/><path d="M-1 -14l10 14h-10z" fill="#fffaf0" ${ORT_STRICH}/>`,
  // Stadtmauer mit Zinnen und goldener Kuppel
  jerusalem: `<path d="M-6 2a6 7 0 0112 0z" fill="#e0b23e" ${ORT_STRICH}/><path d="M0 -5v-5" ${ORT_STRICH} fill="none"/><path d="M-8 2h16v5h-16z" fill="#f1e4c3" ${ORT_STRICH}/>
    <path d="M-17 14v-9h3v2h3v-2h3v2h3v-2h4v2h3v-2h3v2h3v-2h3v9z" fill="#e9dcc0" ${ORT_STRICH}/><path d="M-3 14v-4a3 3 0 016 0v4" fill="#4a3b28" ${ORT_STRICH}/>`,
};

function ortGlyph(bild, x, y, groesse = 1) {
  const inhalt = ORT_BILDER[bild];
  if (!inhalt) return '';
  return `<g class="pw-bild" transform="translate(${x} ${y}) scale(${groesse})">${inhalt}</g>`;
}

// ---------- Installierbar: als App auf den Startbildschirm ----------
let installAngebot = null;

function initInstallieren() {
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* ohne Service Worker läuft alles normal weiter */ });
  }
  const box = document.getElementById('install-box');
  if (!box) return;
  const laeuftAlsApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (laeuftAlsApp) return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installAngebot = e;
    box.style.display = 'block';
    box.innerHTML = '<button type="button" class="btn install-btn" id="btn-install">📲 Als App auf den Startbildschirm</button>';
    document.getElementById('btn-install').onclick = async () => {
      installAngebot.prompt();
      await installAngebot.userChoice;
      box.style.display = 'none';
    };
  });

  const istIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (istIos) {
    box.style.display = 'block';
    box.innerHTML = '<div class="install-hinweis">📲 <strong>Als App speichern:</strong> unten auf „Teilen" tippen, dann „Zum Home-Bildschirm".</div>';
  }
}

// ---------- Zusammenbau ----------
function renderStartExtras() {
  renderProfil();
  renderTagesrunde();
  renderWochenduell();
  aktualisiereStartLeiste();
}

function initErweiterung() {
  document.getElementById('btn-meister').onclick = starteMeister;
  initInstallieren();
  renderStartExtras();
}
