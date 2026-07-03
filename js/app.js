// =====================
// KONFI-CHECK App
// =====================

const SUPABASE_URL = 'https://jhelduwnmjpomzrowgmr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZWxkdXdubWpwb216cm93Z21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNzQ4NDEsImV4cCI6MjA5NTc1MDg0MX0.-Mv6TRBTgJhqjaLARs3hvLm6vvMcnQ2mlfubgLvriyU';

// Fallback-Zitate (wenn kein themenspezifischer Pool vorhanden)
const ZITATE = [
  { text: '„Gott ist die Liebe.“', quelle: '1 Joh 4,16', link: 'https://www.die-bibel.de/bibel/BB/1JN.4.16-1JN.4.16' },
  { text: '„Die Liebe ist geduldig und gütig.“', quelle: '1 Kor 13,4', link: 'https://www.die-bibel.de/bibel/BB/1CO.13.4-1CO.13.4' },
  { text: '„Ich bin das Licht der Welt.“', quelle: 'Joh 8,12', link: 'https://www.die-bibel.de/bibel/BB/JHN.8.12-JHN.8.12' },
  { text: '„Liebt einander, wie ich euch geliebt habe.“', quelle: 'Joh 15,12', link: 'https://www.die-bibel.de/bibel/BB/JHN.15.12-JHN.15.12' },
  { text: '„Bei Gott ist kein Ding unmöglich.“', quelle: 'Lk 1,37', link: 'https://www.die-bibel.de/bibel/BB/LUK.1.37-LUK.1.37' },
  { text: '„Bittet, so wird euch gegeben.“', quelle: 'Mt 7,7', link: 'https://www.die-bibel.de/bibel/BB/MAT.7.7-MAT.7.7' },
];

// Motivations-Einschübe (nach jeder 2. Frage, abwechselnd mit Bibelzitaten)
const MOTIVATIONEN = [
  { icon: '📖', text: 'Fun Fact: Die Bibel ist das meistgedruckte Buch der Welt — und enthält noch viel mehr als diese 7 Fragen.' },
  { icon: '⛪', text: 'Im Gottesdienst bist du immer herzlich willkommen. Einfach vorbeikommen — du kennst den Weg. 🙂' },
  { icon: '📚', text: 'In der Bibel steckt mehr Spannung als in so mancher Serie. Einfach mal reinlesen — sie ist kostenlos auf die-bibel.de.' },
  { icon: '🎶', text: 'Quiz beendet, aber noch Fragen? Genau dafür ist Kirche da. Sonntags, mit Musik.' },
  { icon: '✨', text: 'Ein Vers, der heute noch nichts sagt, kann morgen genau das Richtige sein.' },
  { icon: '🔗', text: 'Die Bibelstellen im Quiz lassen sich alle direkt nachschlagen — einfach auf den Link klicken.' },
  { icon: '🤝', text: 'Kirche ist kein Gebäude. Kirche ist, wenn Menschen füreinander da sind — lasst uns dazu zusammenkommen, z. B. in einem Gottesdienst.' },
  { icon: '🙏', text: 'Viele Menschen schwören darauf: Ein Gottesdienstbesuch tut ihrer Seele gut.' },
  { icon: '👨‍👩‍👧', text: 'Idee: Komm doch mal wieder mit deiner Familie zu einem Familiengottesdienst.' },
  { icon: '☀️', text: 'Du sollst den Feiertag heiligen — das bedeutet: Nimm dir eine Pause. Geh in einen Gottesdienst. Tu dir etwas Gutes.' },
  { icon: '💚', text: 'Brauchst du jemanden zum Zuhören? Dein Pfarrer oder deine Pfarrerin hat ein offenes Ohr. Sprich sie an.' },
  { icon: '🌐', text: 'Mehr über unsere Gemeinde, Veranstaltungen und Gottesdienste findest du auf <a href="https://www.staaken-evangelisch.de" target="_blank" rel="noopener noreferrer" onclick="window.open(this.href,\'_blank\');return false;" style="color:#a8e6cf;font-weight:700;">staaken-evangelisch.de</a> 👋', isHtml: true },
  { icon: '📸', text: 'Folg uns auf Instagram — wir zeigen, was in der Gemeinde los ist: <a href="https://www.instagram.com/staakenevangelisch" target="_blank" rel="noopener noreferrer" onclick="window.open(this.href,\'_blank\');return false;" style="color:#a8e6cf;font-weight:700;">@staakenevangelisch</a>', isHtml: true },
  { icon: '📬', text: 'Bleib auf dem Laufenden: Melde dich für unseren <a href="https://forms.churchdesk.com/f/HyEu5z7zB" target="_blank" rel="noopener noreferrer" onclick="window.open(this.href,\'_blank\');return false;" style="color:#a8e6cf;font-weight:700;">Newsletter</a> an — damit du nichts verpasst.', isHtml: true },
  { icon: '🔔', text: 'Wusstest du? Die Kirchenglocken läuten jeden Sonntag auch für dich — einfach mal hinhören.' },
  { icon: '🤲', text: 'Glaube ist kein Wissen, sondern ein Vertrauen. Das kann man üben — z. B. im Gespräch mit anderen.' },
  { icon: '📱', text: 'YouTube, Instagram, TikTok — und die Bibel. Vielleicht mal einen Vers ausprobieren?' },
];

let state = {
  name: '',
  gruppe: '',
  thema: null,
  fragen: [],
  aktuelleIndex: 0,
  punkte: 0,
  antworten: [],
  showZitat: false,
  letzterZitatIdx: -1,
  pauseCount: 0,       // zählt Pausen (Zitat oder Motivation)
  letzterMotivIdx: -1, // verhindert Wiederholung bei Motivationen
  streak: 0,           // aktuelle Serie richtiger Antworten
  bestStreak: 0,
};

// ---- SOUND ----
let audioCtx = null;
function spieleTon(typ) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    if (typ === 'richtig') {
      // Tonhöhe steigt mit der Serie — das Ohr merkt den Lauf
      const shift = Math.pow(2, Math.min(Math.max(state.streak - 1, 0), 9) / 12);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25 * shift, audioCtx.currentTime);
      osc.frequency.setValueAtTime(783.99 * shift, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.setValueAtTime(160, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    }
  } catch (e) { /* Audio nicht verfügbar */ }
}

// Fanfare bei voller Punktzahl (C-Dur-Arpeggio)
function spieleFanfare() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const noten = [523.25, 659.25, 783.99, 1046.5];
    noten.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      const t = audioCtx.currentTime + i * 0.16;
      const laenge = i === noten.length - 1 ? 0.7 : 0.22;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + laenge);
      osc.start(t);
      osc.stop(t + laenge);
    });
  } catch (e) { /* Audio nicht verfügbar */ }
}

// Konfetti-Puff direkt am Element (bei richtiger Antwort)
function puffEffekt(el) {
  const rect = el.getBoundingClientRect();
  const colors = ['#f39c12', '#27ae60', '#3498db', '#e74c3c', '#f1c40f'];
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    p.className = 'puff-piece';
    const winkel = Math.random() * 2 * Math.PI;
    const dist = 30 + Math.random() * 50;
    p.style.cssText = `left:${rect.left + rect.width / 2}px; top:${rect.top + rect.height / 2}px; background:${colors[i % colors.length]}; --dx:${Math.cos(winkel) * dist}px; --dy:${Math.sin(winkel) * dist}px;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

// Kurze Vollbild-Einblendung bei Serien-Meilensteinen
function zeigeStreakOverlay(text) {
  const div = document.createElement('div');
  div.className = 'streak-overlay';
  div.textContent = text;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1100);
}

// Thema des Tages — deterministisch aus dem Datum
function themaDesTagesId() {
  const d = new Date().toISOString().slice(0, 10);
  let h = 0;
  for (const c of d) h = (h * 31 + c.charCodeAt(0)) % 997;
  const themen = window.fragenData.themen;
  return themen[h % themen.length].id;
}

// Konfi-Level aus allen gesammelten Sternen
const LEVELS = [
  { min: 0, name: 'Neuling' },
  { min: 3, name: 'Entdecker' },
  { min: 6, name: 'Auf dem Weg' },
  { min: 10, name: 'Bibelkenner' },
  { min: 15, name: 'Konfi-Ass' },
  { min: 21, name: 'Gemeinde-Guru' },
  { min: 28, name: 'Bibel-Profi' },
  { min: 35, name: 'Legende von Staaken' },
];
function gesamtSterne() {
  const best = ladeLokal().bestScores || {};
  return Object.values(best).reduce((s, p) => s + sterneFuerProzent(p), 0);
}
function levelFuerSterne(sterne) {
  let idx = LEVELS.length - 1;
  while (idx > 0 && sterne < LEVELS[idx].min) idx--;
  return idx;
}
function renderLevelBox() {
  const el = document.getElementById('level-box');
  if (!el) return;
  const sterne = gesamtSterne();
  const lvlIdx = levelFuerSterne(sterne);
  const lvl = LEVELS[lvlIdx];
  const next = LEVELS[lvlIdx + 1];
  let pct = 100;
  let hinweis = 'Höchstes Level erreicht! 🎉';
  if (next) {
    pct = Math.round(((sterne - lvl.min) / (next.min - lvl.min)) * 100);
    hinweis = `Noch ${next.min - sterne} ⭐ bis „${next.name}"`;
  }
  el.innerHTML = `
    <div class="level-zeile"><span>Level ${lvlIdx + 1} · <strong>${lvl.name}</strong></span><span>${sterne} ⭐</span></div>
    <div class="level-bar"><div class="level-fill" style="width:${Math.max(pct, 4)}%"></div></div>
    <div class="level-hinweis">${hinweis}</div>`;
}

// Antworten zufällig mischen, richtig-Index mitführen
function mischeAntworten(frage) {
  const indices = [0, 1, 2, 3].slice(0, frage.antworten.length);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    ...frage,
    antworten: indices.map(i => frage.antworten[i]),
    richtig: indices.indexOf(frage.richtig),
  };
}

let alleScores = [];

// ---- LOKALER SPEICHER (Sterne & Tages-Streak) ----
const LS_KEY = 'konfiCheck';
function ladeLokal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; }
}
function speichereLokal(daten) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(daten)); } catch (e) { /* privat-Modus */ }
}
function sterneFuerProzent(prozent) {
  if (prozent >= 100) return 3;
  if (prozent >= 75) return 2;
  if (prozent >= 50) return 1;
  return 0;
}

// ---- SCREENS ----
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  window.scrollTo(0, 0);
}

// ---- START ----
function initStart() {
  document.getElementById('btn-start').onclick = () => {
    const name = document.getElementById('input-name').value.trim();
    const gruppe = document.querySelector('.gruppe-btn.selected')?.dataset.gruppe;
    const thema = document.querySelector('.thema-card.selected, .pw-station.selected')?.dataset.thema;

    if (!name) { shakeRed('input-name'); return; }
    if (!gruppe) { shakeRed('gruppe-grid'); return; }
    if (!thema) { shakeRed('thema-auswahl'); return; }

    state.name = name;
    state.gruppe = gruppe;
    state.thema = window.fragenData.themen.find(t => t.id === thema);
    state.fragen = [...state.thema.fragen];
    state.aktuelleIndex = 0;
    state.punkte = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.antworten = [];
    state.pauseCount = 0;
    state.letzterZitatIdx = -1;
    state.letzterMotivIdx = -1;

    startQuiz();
  };

  document.getElementById('btn-scores').onclick = () => {
    ladeScores();
    showScreen('scores');
  };

  // Gruppe-Buttons
  document.querySelectorAll('.gruppe-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.gruppe-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    };
  });

  // Thema-Cards
  document.querySelectorAll('.thema-card').forEach(card => {
    card.onclick = () => {
      document.querySelectorAll('.thema-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    };
  });

  // Ansicht-Umschalter (Pilgerweg / Liste)
  document.getElementById('btn-ansicht-karte').onclick = () => setAnsicht('karte');
  document.getElementById('btn-ansicht-liste').onclick = () => setAnsicht('liste');

  // Themen aus JSON laden — gruppiert
  renderThemenGrid();
  renderStreakBanner();
  renderLevelBox();
  setAnsicht(ladeLokal().ansicht || 'karte');
}

function renderThemenGrid() {
  const container = document.getElementById('themen-grid');
  container.innerHTML = '';
  // Sichtbarkeit richtet sich nach gewählter Ansicht (Karte oder Liste)
  container.style.display = (ladeLokal().ansicht || 'karte') === 'liste' ? 'block' : 'none';

  const gruppen = [
    { label: 'Glaubenswissen', ids: ['pfingsten','bibel','jesus-historisch','jesus-christus','jesu-worte','jesu-taten','gleichnisse','gebote-bergpredigt','evangelische-kirche','gemeinde'] },
    { label: 'Gemeindekunde Ev. Kirchengemeinde Staaken', ids: ['gemeinde-geschichte','gemeinde-aktuell'] },
    { label: 'Sonstiges', ids: ['nur-fuer-profis'] },
  ];

  const alleThemen = window.fragenData.themen;
  const bestScores = ladeLokal().bestScores || {};

  const tagesId = themaDesTagesId();

  function themaCard(t) {
    const div = document.createElement('div');
    div.className = 'thema-card';
    div.dataset.thema = t.id;
    const best = bestScores[t.id];
    const n = best !== undefined ? sterneFuerProzent(best) : 0;
    const sterne = '<span class="stern-voll">' + '★'.repeat(n) + '</span>' + '☆'.repeat(3 - n);
    let ribbon = '';
    if (t.id === tagesId) {
      div.classList.add('thema-des-tages');
      ribbon = '<div class="tages-ribbon">⭐ Heute</div>';
    }
    if (n === 2) div.classList.add('fast-fertig'); // Zeigarnik: ★★☆ ruft nach dem dritten Stern
    div.innerHTML = `${ribbon}<div class="thema-icon">${t.icon}</div><div class="thema-name">${t.titel}</div><div class="thema-sterne">${sterne}</div>`;
    if (t.farbe) {
      div.style.background = `linear-gradient(160deg, #ffffff 50%, ${t.farbe}26)`;
    }
    div.onclick = () => {
      document.querySelectorAll('.thema-card, .pw-station').forEach(c => c.classList.remove('selected'));
      div.classList.add('selected');
      const station = document.querySelector(`.pw-station[data-thema="${t.id}"]`);
      if (station) station.classList.add('selected');
    };
    return div;
  }

  gruppen.forEach(gruppe => {
    const themen = gruppe.ids.map(id => alleThemen.find(t => t.id === id)).filter(Boolean);
    if (!themen.length) return;

    const gruppeDiv = document.createElement('div');
    gruppeDiv.className = 'thema-gruppe';

    const titel = document.createElement('div');
    titel.className = 'thema-gruppe-titel';
    titel.textContent = gruppe.label;
    gruppeDiv.appendChild(titel);

    const grid = document.createElement('div');
    grid.className = 'themen-grid';
    themen.forEach(t => grid.appendChild(themaCard(t)));
    gruppeDiv.appendChild(grid);

    container.appendChild(gruppeDiv);
  });

  const legende = document.createElement('div');
  legende.className = 'sterne-legende';
  legende.innerHTML = 'Sammle Sterne pro Thema: <span class="stern-voll">★</span> ab 50&nbsp;% · <span class="stern-voll">★★</span> ab 75&nbsp;% · <span class="stern-voll">★★★</span> bei voller Punktzahl<br>⭐ Heute = Thema des Tages';
  container.appendChild(legende);

  renderPilgerweg();
}

// ---- PILGERWEG-KARTE ----
// Reale Stationen: von der eigenen Kirchentür bis nach Jerusalem
const PILGERWEG = [
  { thema: 'gemeinde',            ort: 'Kirche Gartenstadt', zone: 0 },
  { thema: 'gemeinde-geschichte', ort: 'Dorfkirche Alt-Staaken', zone: 0 },
  { thema: 'gleichnisse',         ort: 'Waldhaus am Sonnenhügel', zone: 0 },
  { thema: 'gemeinde-aktuell',    ort: 'Ernst-Lange-Haus', zone: 0 },
  { thema: 'jesu-worte',          ort: 'Kirche Heerstraße Nord', zone: 0 },
  { thema: 'evangelische-kirche', ort: 'St. Nikolai Spandau', zone: 1 },
  { thema: 'gebote-bergpredigt',  ort: 'Gedächtniskirche', zone: 1 },
  { thema: 'jesus-christus',      ort: 'Berliner Dom', zone: 1 },
  { thema: 'nur-fuer-profis',     ort: 'Konsistorium (EKBO)', zone: 1 },
  { thema: 'bibel',               ort: 'Lutherstadt Wittenberg', zone: 2 },
  { thema: 'jesus-historisch',    ort: 'Nazareth', zone: 3 },
  { thema: 'jesu-taten',          ort: 'See Genezareth', zone: 3 },
  { thema: 'pfingsten',           ort: 'Jerusalem', zone: 3 },
];
const PW_ZONEN = [
  { name: 'Staaken — dein Zuhause', farbe: '#6a9c5f', deko: ['🌳', '🏡', '🌾', '🌻', '🌲'] },
  { name: 'Spandau & Berlin', farbe: '#6f8ba8', deko: ['🐻', '🏙️', '🚇', '🕊️'] },
  { name: 'Wittenberg', farbe: '#a8906f', deko: ['📜'] },
  { name: 'Heiliges Land', farbe: '#c9a03c', deko: ['🌴', '⛵', '☀️'] },
];

function renderPilgerweg() {
  const wrap = document.getElementById('pilgerweg-wrap');
  if (!wrap) return;
  const bestScores = ladeLokal().bestScores || {};
  const tagesId = themaDesTagesId();
  const themen = window.fragenData.themen;

  // Layout berechnen
  let y = 16;
  const stationen = [];
  const zonen = [];
  let letzteZone = -1;
  PILGERWEG.forEach((s, i) => {
    if (s.zone !== letzteZone) {
      if (letzteZone >= 0) zonen[letzteZone].ende = y + 4;
      zonen[s.zone] = { start: y };
      y += 46;
      letzteZone = s.zone;
    }
    stationen.push({ ...s, x: i % 2 === 0 ? 85 : 290, y: y + 36, idx: i });
    y += 102;
  });
  zonen[letzteZone].ende = y + 8;
  const H = y + 20;

  // Zonen-Hintergründe + Banner
  let zonenSvg = '';
  zonen.forEach((z, i) => {
    zonenSvg += `<rect x="6" y="${z.start}" width="363" height="${z.ende - z.start}" rx="14" fill="${PW_ZONEN[i].farbe}" fill-opacity="0.12"/>`;
    zonenSvg += `<rect x="67" y="${z.start + 10}" width="240" height="26" rx="13" fill="${PW_ZONEN[i].farbe}"/>`;
    zonenSvg += `<text x="187" y="${z.start + 27}" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" letter-spacing="1">${PW_ZONEN[i].name.toUpperCase()}</text>`;
  });

  // Weg (gestrichelte Pfadsegmente zwischen den Stationen)
  let wegSvg = '';
  for (let i = 0; i < stationen.length - 1; i++) {
    const a = stationen[i], b = stationen[i + 1];
    const beideBesucht = (bestScores[a.thema] || 0) >= 50 && (bestScores[b.thema] || 0) >= 50;
    wegSvg += `<path d="M ${a.x} ${a.y} C ${a.x} ${a.y + 55}, ${b.x} ${b.y - 55}, ${b.x} ${b.y}" fill="none" stroke="${beideBesucht ? '#f39c12' : '#b39c74'}" stroke-width="4" stroke-dasharray="9 7" stroke-linecap="round" ${beideBesucht ? 'opacity="0.9"' : 'opacity="0.55"'}/>`;
  }

  // Deko-Emoji je Zone, gegenüber der Station verteilt
  let dekoSvg = '';
  stationen.forEach((s) => {
    const deko = PW_ZONEN[s.zone].deko;
    const emoji = deko[s.idx % deko.length];
    const dx = s.x === 85 ? 335 : 40;
    dekoSvg += `<text x="${dx}" y="${s.y + 6}" text-anchor="middle" font-size="26" opacity="0.18">${emoji}</text>`;
  });

  // Stationen
  let statSvg = '';
  stationen.forEach((s) => {
    const t = themen.find(th => th.id === s.thema);
    if (!t) return;
    const best = bestScores[s.thema];
    const n = best !== undefined ? sterneFuerProzent(best) : 0;
    const istTages = s.thema === tagesId;
    const istFinale = s.idx === stationen.length - 1;
    const r = istFinale ? 28 : 24;
    const ringFarbe = n === 3 ? '#f1c40f' : (t.farbe || '#b39c74');
    const labelRechts = s.x === 85;
    const lx = labelRechts ? s.x + 40 : s.x - 40;
    const anchor = labelRechts ? 'start' : 'end';
    const sterneText = `<tspan fill="#f39c12">${'★'.repeat(n)}</tspan><tspan fill="#c9baa0">${'☆'.repeat(3 - n)}</tspan>`;

    statSvg += `<g class="pw-station${n === 2 ? ' pw-fastfertig' : ''}${n === 3 ? ' pw-fertig' : ''}" data-thema="${s.thema}">`;
    if (istTages) {
      statSvg += `<circle class="pw-tages" cx="${s.x}" cy="${s.y}" r="${r + 8}" fill="none" stroke="#f1c40f" stroke-width="2.5"/>`;
      statSvg += `<rect x="${s.x - 32}" y="${s.y - r - 26}" width="64" height="17" rx="8.5" fill="#f1c40f"/>`;
      statSvg += `<text x="${s.x}" y="${s.y - r - 13}" text-anchor="middle" font-size="9.5" font-weight="800" fill="#fff">⭐ HEUTE</text>`;
    }
    statSvg += `<circle class="pw-ring" cx="${s.x}" cy="${s.y}" r="${r + 3}" fill="none" stroke="${ringFarbe}" stroke-width="3"/>`;
    statSvg += `<circle class="pw-node" cx="${s.x}" cy="${s.y}" r="${r}" fill="#fffdf5" stroke="#d9c9a8" stroke-width="1.5"/>`;
    statSvg += `<text class="pw-emoji" x="${s.x}" y="${s.y + 8}" text-anchor="middle" font-size="${istFinale ? 26 : 22}">${t.icon}</text>`;
    statSvg += `<text x="${s.x}" y="${s.y + r + 18}" text-anchor="middle" font-size="11" font-weight="700">${sterneText}</text>`;
    statSvg += `<text x="${lx}" y="${s.y - 1}" text-anchor="${anchor}" font-size="10.5" font-weight="800" fill="#4a3b28">${s.ort}</text>`;
    statSvg += `<text x="${lx}" y="${s.y + 13}" text-anchor="${anchor}" font-size="9" fill="#8a7a5f">${t.titel}${istFinale ? ' · 🏁 Ziel' : ''}</text>`;
    statSvg += `</g>`;
  });

  wrap.innerHTML = `
    <div class="pilgerweg-panel">
      <svg viewBox="0 0 375 ${H}" xmlns="http://www.w3.org/2000/svg" role="list" aria-label="Pilgerweg: Themenauswahl als Landkarte">
        ${zonenSvg}${wegSvg}${dekoSvg}${statSvg}
      </svg>
    </div>
    <div class="pilgerweg-hinweis">Folge dem Weg von Staaken bis nach Jerusalem ↓ — tippe eine Station an</div>`;

  wrap.querySelectorAll('.pw-station').forEach(g => {
    g.addEventListener('click', () => {
      document.querySelectorAll('.thema-card, .pw-station').forEach(el => el.classList.remove('selected'));
      g.classList.add('selected');
      const kachel = document.querySelector(`.thema-card[data-thema="${g.dataset.thema}"]`);
      if (kachel) kachel.classList.add('selected');
    });
  });
}

function setAnsicht(a) {
  const lokal = ladeLokal();
  lokal.ansicht = a;
  speichereLokal(lokal);
  document.getElementById('pilgerweg-wrap').style.display = a === 'karte' ? 'block' : 'none';
  document.getElementById('themen-grid').style.display = a === 'karte' ? 'none' : 'block';
  document.getElementById('btn-ansicht-karte').classList.toggle('active', a === 'karte');
  document.getElementById('btn-ansicht-liste').classList.toggle('active', a === 'liste');
}

function renderStreakBanner() {
  const el = document.getElementById('streak-banner');
  if (!el) return;
  const lokal = ladeLokal();
  const heute = new Date().toISOString().slice(0, 10);
  const gestern = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  // Streak nur anzeigen, wenn sie noch "lebt" (heute oder gestern gespielt)
  const aktiv = lokal.lastPlayed === heute || lokal.lastPlayed === gestern;
  if (aktiv && (lokal.dayStreak || 0) >= 2) {
    el.innerHTML = `🔥 <strong>${lokal.dayStreak} Tage in Folge dabei</strong> — stark! Bleib dran.`;
    el.style.display = 'block';
  } else if (aktiv && lokal.dayStreak === 1 && lokal.lastPlayed === gestern) {
    el.innerHTML = `🔥 Gestern gespielt? Spiel heute wieder und starte eine <strong>Serie</strong>!`;
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

function shake(id) {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => el.style.animation = '', 400);
}

function shakeRed(id) {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  el.classList.add('validation-fehler');
  setTimeout(() => el.style.animation = '', 400);
  // Rot-Umrandung beim nächsten Klick/Eingabe entfernen
  el.addEventListener('click', () => el.classList.remove('validation-fehler'), { once: true });
  el.addEventListener('input', () => el.classList.remove('validation-fehler'), { once: true });
}

// Sanfter Einblend-Effekt beim Kartenwechsel
function kartenAnimation(card) {
  card.classList.remove('card-enter');
  void card.offsetWidth; // Reflow erzwingen, damit die Animation neu startet
  card.classList.add('card-enter');
}

// ---- QUIZ ----
function startQuiz() {
  showScreen('quiz');
  renderFrage();
}

function renderFrage() {
  const frage = state.fragen[state.aktuelleIndex];
  const total = state.fragen.length;
  const idx = state.aktuelleIndex;

  // Progress (Farbe wandert von Rot zu Gold, je näher am Ziel)
  const fill = document.getElementById('progress-fill');
  const pct = (idx / total) * 100;
  fill.style.width = `${pct}%`;
  const hue = Math.round(pct * 0.45); // 0 = rot → 45 = gold
  fill.style.background = `linear-gradient(90deg, hsl(${hue}, 85%, 52%), hsl(${hue + 10}, 88%, 48%))`;
  document.getElementById('quiz-meta').textContent = `${state.name} · ${state.thema.titel} · Frage ${idx + 1} von ${total}`;
  const streakEl = document.getElementById('streak-anzeige');
  if (streakEl) {
    if (state.streak >= 2) {
      streakEl.innerHTML = `<span class="streak-badge">🔥 ${state.streak}</span>`;
    } else {
      streakEl.innerHTML = '';
    }
  }

  // Nach jeder 2. Frage: abwechselnd Bibelzitat und Motivationsspruch
  if (idx > 0 && idx % 2 === 0 && !state.showZitat) {
    state.showZitat = true;
    state.pauseCount++;
    if (state.pauseCount % 2 === 1) {
      renderZitat(frage);
    } else {
      renderMotivation();
    }
    return;
  }
  state.showZitat = false;

  // Antworten zufällig mischen (außer Lückentext — dort ist Reihenfolge egal)
  const frageAnzeige = (frage.typ !== 'luecke') ? mischeAntworten(frage) : frage;

  const card = document.getElementById('quiz-card');
  kartenAnimation(card);
  card.innerHTML = '';

  // Finale: letzte Frage golden markieren
  card.classList.toggle('letzte-frage', idx === total - 1);
  if (idx === total - 1) {
    const lf = document.createElement('div');
    lf.className = 'letzte-frage-banner';
    lf.textContent = '🏁 Letzte Frage!';
    card.appendChild(lf);
  }

  // Selbst-Wettbewerb: Rekord beim Einstieg zeigen
  if (idx === 0) {
    const rekord = (ladeLokal().bestScores || {})[state.thema.id];
    if (rekord !== undefined) {
      const r = document.createElement('div');
      r.className = 'rekord-hinweis';
      const rPunkte = Math.round(rekord / 100 * total);
      r.innerHTML = `🏅 Dein Rekord: <strong>${rPunkte}/${total}</strong> — schlägst du dich selbst?`;
      card.appendChild(r);
    }
  }

  // Schwierigkeit
  const sw = document.createElement('div');
  sw.className = `schwierigkeit s${frageAnzeige.schwierigkeit}`;
  const sterne = '★'.repeat(frageAnzeige.schwierigkeit) + '☆'.repeat(3 - frageAnzeige.schwierigkeit);
  sw.innerHTML = `${sterne} ${['', 'Leicht', 'Mittel', 'Schwer'][frageAnzeige.schwierigkeit]}`;
  card.appendChild(sw);

  // Bild (wenn vorhanden)
  if (frageAnzeige.typ === 'bild' && frageAnzeige.bild) {
    const img = document.createElement('img');
    img.src = frageAnzeige.bild;
    img.alt = frageAnzeige.bildalt || '';
    img.className = 'frage-bild';
    img.onerror = () => img.style.display = 'none';
    card.appendChild(img);
  }

  // Frage
  const frageEl = document.createElement('div');
  frageEl.className = 'frage-text';

  if (frageAnzeige.typ === 'luecke') {
    frageEl.innerHTML = frageAnzeige.frage.replace('___', '<span class="luecke">___</span>');
  } else {
    frageEl.textContent = frageAnzeige.frage;
  }
  card.appendChild(frageEl);

  // Antworten
  const grid = document.createElement('div');
  grid.className = 'antworten-grid';
  const labels = ['A', 'B', 'C', 'D'];

  frageAnzeige.antworten.forEach((antwort, i) => {
    const btn = document.createElement('button');
    btn.className = 'antwort-btn';
    btn.innerHTML = `<span class="antwort-label">${labels[i]}</span> ${antwort}`;
    btn.onclick = () => antwortGewählt(i, frageAnzeige, grid);
    grid.appendChild(btn);
  });
  card.appendChild(grid);

  // Erklärung (noch versteckt)
  const erkBox = document.createElement('div');
  erkBox.className = 'erklaerung-box';
  erkBox.id = 'erklaerung';
  card.appendChild(erkBox);

  // Weiter-Button
  const weiterBtn = document.createElement('button');
  weiterBtn.className = 'weiter-btn';
  weiterBtn.id = 'btn-weiter';
  weiterBtn.textContent = idx + 1 < total ? 'Nächste Frage →' : 'Ergebnis sehen 🎉';
  weiterBtn.onclick = () => {
    state.aktuelleIndex++;
    if (state.aktuelleIndex < state.fragen.length) {
      renderFrage();
    } else {
      showErgebnis();
    }
  };
  card.appendChild(weiterBtn);
}

function antwortGewählt(index, frage, grid) {
  const btns = grid.querySelectorAll('.antwort-btn');
  btns.forEach(b => b.disabled = true);

  const richtig = index === frage.richtig;
  if (richtig) {
    state.punkte++;
    state.streak++;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    btns[index].classList.add('richtig');
    spieleTon('richtig');
    puffEffekt(btns[index]);
    if (navigator.vibrate) navigator.vibrate(35);
    if (state.streak === 3) zeigeStreakOverlay('✨ 3er-Serie!');
    else if (state.streak === 5) zeigeStreakOverlay('🔥 Lauf!');
    else if (state.streak === 8) zeigeStreakOverlay('⚡ Nicht zu stoppen!');
  } else {
    state.streak = 0;
    btns[index].classList.add('falsch');
    btns[frage.richtig].classList.add('richtig');
    spieleTon('falsch');
    if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
    const qc = document.getElementById('quiz-card');
    qc.classList.remove('shake-falsch');
    void qc.offsetWidth;
    qc.classList.add('shake-falsch');
  }

  // Erklärung einblenden
  const erkBox = document.getElementById('erklaerung');
  erkBox.style.display = 'block';
  erkBox.className = 'erklaerung-box' + (richtig ? '' : ' wrong');
  let html = `<p>${frage.erklaerung}</p>`;
  if (frage.bibelstelle && frage.bibellink) {
    html += `<a href="${frage.bibellink}" target="_blank" rel="noopener noreferrer" onclick="window.open(this.href,'_blank');return false;">📖 ${frage.bibelstelle} in der Basisbibel →</a>`;
  }
  erkBox.innerHTML = html;

  document.getElementById('btn-weiter').style.display = 'block';
}

function renderZitat(naechsteFrage) {
  const pool = (state.thema.zitate && state.thema.zitate.length > 0) ? state.thema.zitate : ZITATE;
  let idx;
  let versuche = 0;
  do {
    idx = Math.floor(Math.random() * pool.length);
    versuche++;
  } while (idx === state.letzterZitatIdx && pool.length > 1 && versuche < 10);
  state.letzterZitatIdx = idx;
  const zitat = pool[idx];
  const card = document.getElementById('quiz-card');
  kartenAnimation(card);
  card.innerHTML = `
    <div style="text-align:center; margin-bottom:20px; font-size:2rem">✨</div>
    <div class="zitat-text">${zitat.text}</div>
    <div class="zitat-quelle">
      <a href="${zitat.link}" target="_blank" rel="noopener noreferrer" class="zitat-link" onclick="window.open(this.href,'_blank');return false;">📖 ${zitat.quelle}</a>
    </div>
    <button class="weiter-btn" style="display:block; margin-top:24px" onclick="state.showZitat=true; renderFrage()">Weiter →</button>
  `;
  card.style.background = 'linear-gradient(135deg, #8e44ad, #6c3483)';
  card.style.color = '#fff';
  setTimeout(() => { card.style.background = ''; card.style.color = ''; }, 0);
}

function renderMotivation() {
  let idx;
  let versuche = 0;
  do {
    idx = Math.floor(Math.random() * MOTIVATIONEN.length);
    versuche++;
  } while (idx === state.letzterMotivIdx && MOTIVATIONEN.length > 1 && versuche < 10);
  state.letzterMotivIdx = idx;
  const motiv = MOTIVATIONEN[idx];
  const card = document.getElementById('quiz-card');
  kartenAnimation(card);
  card.innerHTML = `
    <div style="text-align:center; margin-bottom:16px; font-size:2.5rem">${motiv.icon}</div>
    <div class="motiv-text">${motiv.text}</div>
    <button class="weiter-btn" style="display:block; margin-top:24px" onclick="state.showZitat=true; renderFrage()">Weiter →</button>
  `;
  card.style.background = 'linear-gradient(135deg, #1a6b4a, #0d4a33)';
  card.style.color = '#fff';
  setTimeout(() => { card.style.background = ''; card.style.color = ''; }, 0);
}

// ---- ERGEBNIS ----
function showErgebnis() {
  showScreen('ergebnis');
  const total = state.fragen.length;
  const punkte = state.punkte;
  const prozent = Math.round((punkte / total) * 100);

  let emoji = '😅';
  let text = 'Nicht schlecht — aber da geht noch was!';
  let badge = '🌱 Newcomer';
  if (prozent >= 85) { emoji = '🏆'; text = 'Hammer! Du kennst dich richtig gut aus!'; badge = '🏆 Bibel-Profi'; }
  else if (prozent >= 60) { emoji = '🎉'; text = 'Gut gemacht! Weiter so!'; badge = '🎉 Konfi-Kenner'; }
  else if (prozent >= 40) { emoji = '💪'; text = 'Du hast eine Menge gelernt heute!'; badge = '💪 Auf dem Weg'; }

  document.getElementById('ergebnis-emoji').textContent = emoji;
  document.getElementById('ergebnis-text').textContent = text;
  const badgeEl = document.getElementById('ergebnis-badge');
  if (badgeEl) {
    badgeEl.textContent = badge;
    if (state.bestStreak >= 4) {
      badgeEl.textContent += ` · 🔥 Beste Serie: ${state.bestStreak}`;
    }
  }

  // Punkte hochzählen (Count-up-Animation)
  const scoreEl = document.getElementById('ergebnis-score');
  const dauer = 800;
  const startZeit = performance.now();
  function tick(now) {
    const f = Math.min((now - startZeit) / dauer, 1);
    scoreEl.textContent = `${Math.round(f * punkte)} / ${total}`;
    if (f < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Lokalen Fortschritt speichern: Sterne + Tages-Streak
  const lokal = ladeLokal();
  lokal.bestScores = lokal.bestScores || {};
  const altProzent = lokal.bestScores[state.thema.id] || 0;
  const alteSterne = sterneFuerProzent(altProzent);
  const neueSterne = sterneFuerProzent(prozent);
  const sterneVorher = Object.values(lokal.bestScores).reduce((s, p) => s + sterneFuerProzent(p), 0);
  if (prozent > altProzent) lokal.bestScores[state.thema.id] = prozent;
  const sterneNachher = Object.values(lokal.bestScores).reduce((s, p) => s + sterneFuerProzent(p), 0);

  const heute = new Date().toISOString().slice(0, 10);
  const gestern = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (lokal.lastPlayed !== heute) {
    lokal.dayStreak = (lokal.lastPlayed === gestern) ? (lokal.dayStreak || 0) + 1 : 1;
    lokal.lastPlayed = heute;
  }
  lokal.name = state.name;
  speichereLokal(lokal);
  renderThemenGrid();
  renderStreakBanner();
  renderLevelBox();

  if (prozent === 100) spieleFanfare();

  // Goal-Gradient: "fast geschafft" + neue Sterne feiern
  const nextEl = document.getElementById('ergebnis-next');
  if (nextEl) {
    const stufen = [
      { prozent: 40, ziel: 'zum Titel „Auf dem Weg" 💪' },
      { prozent: 60, ziel: 'zum Titel „Konfi-Kenner" 🎉' },
      { prozent: 85, ziel: 'zum Titel „Bibel-Profi" 🏆' },
      { prozent: 100, ziel: 'zu 3 Sternen ⭐⭐⭐' },
    ];
    const naechste = stufen.find(s => prozent < s.prozent);
    let html = '';
    const lvlVorher = levelFuerSterne(sterneVorher);
    const lvlNachher = levelFuerSterne(sterneNachher);
    if (lvlNachher > lvlVorher) {
      html += `<div class="level-up">🚀 Level-Aufstieg! Du bist jetzt <strong>Level ${lvlNachher + 1} · ${LEVELS[lvlNachher].name}</strong></div>`;
    }
    if (neueSterne > alteSterne) {
      html += `<div class="neue-sterne">✨ Neuer Rekord in diesem Thema: ${'★'.repeat(neueSterne)}${'☆'.repeat(3 - neueSterne)}</div>`;
    }
    if (state.thema.id === themaDesTagesId()) {
      html += `<div class="tages-bonus">⭐ Thema des Tages gespielt — schau morgen wieder rein, dann wartet ein neues!</div>`;
    }
    if (naechste) {
      const fehlend = Math.ceil(naechste.prozent / 100 * total) - punkte;
      if (fehlend <= 2) {
        html += `<div class="fast-geschafft">Nur noch <strong>${fehlend} Punkt${fehlend > 1 ? 'e' : ''}</strong> bis ${naechste.ziel} — gleich nochmal? 😏</div>`;
      }
    }
    nextEl.innerHTML = html;
    nextEl.style.display = html ? 'block' : 'none';
  }

  if (prozent >= 70) starteKonfetti(prozent >= 90 ? 'gold' : 'normal');

  // Score speichern
  speichereScore(state.name, state.gruppe, state.thema.id, punkte, total);

  document.getElementById('btn-nochmal').onclick = () => {
    state.aktuelleIndex = 0;
    state.punkte = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.fragen = [...state.thema.fragen];
    startQuiz();
  };
  document.getElementById('btn-zum-start').onclick = () => showScreen('start');
  document.getElementById('btn-scores-from-result').onclick = () => {
    ladeScores();
    showScreen('scores');
  };

  // Share-Button
  document.getElementById('btn-share').onclick = async () => {
    const prozent = Math.round((state.punkte / state.fragen.length) * 100);
    const shareData = {
      title: 'Konfi-Check ✓',
      text: `🏆 Herausforderung! Ich hab beim Konfi-Check ${state.punkte}/${state.fragen.length} Punkte (${prozent}%) im Thema „${state.thema.titel}" geholt. Knackst du meinen Score?`,
      url: 'https://webervik.github.io/konfi-check/'
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) { /* abgebrochen */ }
    } else {
      await navigator.clipboard.writeText(shareData.text + '\n' + shareData.url);
      const btn = document.getElementById('btn-share');
      btn.textContent = '✅ Link kopiert!';
      setTimeout(() => btn.innerHTML = '📤 Quiz teilen', 2000);
    }
  };
}

// ---- SCORES ----
const SB_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
};

async function speichereScore(name, gruppe, thema, punkte, gesamt) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
      method: 'POST',
      headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ name, gruppe, thema, punkte, gesamt }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (e) {
    console.warn('Score konnte nicht gespeichert werden:', e.message);
  }
}

async function ladeScores() {
  window.loeschenErlaubt = false; // Löschen erst nach geheimem Button-Klick erlaubt
  const list = document.getElementById('score-list');
  list.innerHTML = '<div class="loading"><div class="spinner"></div>Lade Ergebnisse…</div>';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/scores?select=*&order=erstellt_am.desc&limit=1000`,
      { headers: SB_HEADERS, signal: controller.signal }
    );
    clearTimeout(timeout);
    alleScores = await res.json();
    renderScores('alle');
    renderTeamRangliste();
  } catch (e) {
    list.innerHTML = '<div class="loading">⚠️ Verbindung fehlgeschlagen. Bitte Seite neu laden.</div>';
  }
}

function renderScores(filterGruppe) {
  const list = document.getElementById('score-list');
  list.innerHTML = '';

  let scores = filterGruppe === 'alle'
    ? [...alleScores]
    : alleScores.filter(s => s.gruppe === filterGruppe);

  scores.sort((a, b) => (b.punkte / b.gesamt) - (a.punkte / a.gesamt));

  if (scores.length === 0) {
    list.innerHTML = '<div class="loading">Noch keine Einträge.</div>';
    return;
  }

  // Eigene Platzierung anzeigen (Selbstverortung)
  const meinName = (state.name || ladeLokal().name || '').toLowerCase();
  if (meinName) {
    const meinIdx = scores.findIndex(s => s.name.toLowerCase() === meinName);
    if (meinIdx >= 0) {
      const banner = document.createElement('div');
      banner.className = 'dein-platz';
      banner.innerHTML = `📍 Du bist auf <strong>Platz ${meinIdx + 1} von ${scores.length}</strong>${meinIdx > 0 ? ' — da geht noch was! 😉' : ' — Spitzenplatz! 🏆'}`;
      list.appendChild(banner);
    }
  }

  scores.slice(0, 20).forEach((s, i) => {
    const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const rankIcon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
    const datum = new Date(s.erstellt_am).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    const themaIcon = window.fragenData?.themen.find(t => t.id === s.thema)?.icon || '📝';

    const item = document.createElement('div');
    item.className = 'score-item';
    item.innerHTML = `
      <div class="rank ${rankClass}">${rankIcon}</div>
      <div class="score-info">
        <div class="score-name">${escapeHtml(s.name)}</div>
        <div class="score-detail">${escapeHtml(s.gruppe)} · ${datum} <span class="score-thema-badge">${themaIcon} ${s.thema}</span></div>
      </div>
      <div class="score-punkte">${s.punkte}/${s.gesamt}</div>
      <button onclick="loescheEintrag('${s.id}')" title="Eintrag entfernen" style="width:28px; height:28px; border-radius:50%; border:none; background:#1a1a2e; color:#1a1a2e; font-size:1.1rem; cursor:pointer; margin-left:8px; flex-shrink:0; transition:background 0.2s, color 0.2s;" onmouseenter="this.style.background='#e74c3c';this.style.color='#fff'" onmouseleave="this.style.background='#1a1a2e';this.style.color='#1a1a2e'">×</button>
    `;
    list.appendChild(item);
  });
}

function renderTeamRangliste() {
  const gruppen = [
    { name: 'Konfis Dorfkirche', icon: '⛪' },
    { name: 'Konfis Gartenstadt', icon: '🌳' },
    { name: 'Eltern', icon: '👨‍👩‍👧' },
    { name: 'Gemeinde', icon: '🕊️' },
    { name: 'Sonstige', icon: '🌍' },
  ];

  const alleGruppen = gruppen.map(g => {
    const scores = alleScores.filter(s => s.gruppe === g.name);
    const avg = scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + (s.punkte / s.gesamt), 0) / scores.length * 100)
      : null;
    return { ...g, avg, count: scores.length };
  }).sort((a, b) => {
    if (a.avg === null && b.avg === null) return 0;
    if (a.avg === null) return 1;
    if (b.avg === null) return -1;
    return b.avg - a.avg;
  });

  const container = document.getElementById('team-rangliste');
  const rankIcons = ['🥇','🥈','🥉','4.','5.'];
  container.innerHTML = `<div class="team-rangliste-grid">
    ${alleGruppen.map((g, i) => `
      <div class="team-card${g.avg === null ? ' team-card-leer' : ''}">
        <div class="team-rank">${g.avg !== null ? (rankIcons[alleGruppen.filter(x=>x.avg!==null).indexOf(g)] || '') : '–'}
        </div>
        <div class="team-info">
          <div class="team-name">${g.icon} ${g.name}</div>
          <div class="team-avg">${g.avg !== null ? g.avg + '%' : '–'}</div>
          <div class="team-count">${g.count > 0 ? g.count + ' Spiel' + (g.count !== 1 ? 'e' : '') : 'noch kein Spiel'}</div>
        </div>
      </div>`).join('')}
  </div>`;
}

// ---- SCORES TABS ----
function initScoresTabs() {
  document.querySelectorAll('.gruppe-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.gruppe-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderScores(tab.dataset.filter);
    };
  });
  document.getElementById('btn-back-scores').onclick = () => showScreen('start');

  document.getElementById('btn-eintraege-entfernen').onclick = () => {
    window.loeschenErlaubt = true;
    renderScores(document.querySelector('.gruppe-tab.active')?.dataset.filter || 'alle');
  };

  window.loescheEintrag = async (id) => {
    if (!window.loeschenErlaubt) return;
    if (!confirm('Diesen Eintrag löschen?')) return;
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/scores?id=eq.${id}`,
      { method: 'DELETE', headers: SB_HEADERS }
    );
    if (res.ok) ladeScores();
    else alert('Fehler beim Löschen.');
  };
}

// ---- KONFETTI ----
function starteKonfetti(modus = 'normal') {
  const container = document.getElementById('konfetti');
  container.innerHTML = '';
  const colors = modus === 'gold'
    ? ['#f1c40f', '#f39c12', '#ffd700', '#fff3cd']
    : ['#f39c12', '#e74c3c', '#8e44ad', '#27ae60', '#3498db', '#f1c40f'];
  const anzahl = modus === 'gold' ? 140 : 80;
  for (let i = 0; i < anzahl; i++) {
    const piece = document.createElement('div');
    piece.className = 'konfetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${6 + Math.random() * 10}px;
      height: ${6 + Math.random() * 10}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.8}s;
    `;
    container.appendChild(piece);
  }
  setTimeout(() => container.innerHTML = '', 4000);
}

// ---- HELPER ----
function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---- INIT ----
function init() {
  // fragenData wird als globale Variable direkt im HTML eingebettet (window.FRAGEN_DATA)
  window.fragenData = window.FRAGEN_DATA;
  if (!window.fragenData) {
    console.error('Fragen-Daten fehlen — FRAGEN_DATA nicht gesetzt');
    return;
  }
  initStart();
  initScoresTabs();
  showScreen('start');
}

document.addEventListener('DOMContentLoaded', init);
