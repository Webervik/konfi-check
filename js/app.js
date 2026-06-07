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
  { icon: '🎶', text: 'Übrigens: Alles, worüber ihr hier gequizzt habt, gibt’s am Sonntag im Gottesdienst noch einmal mit Musik.' },
  { icon: '✨', text: 'Ein Vers, der heute noch nichts sagt, kann morgen genau das Richtige sein.' },
  { icon: '🔗', text: 'Die Bibelstellen im Quiz lassen sich alle direkt nachschlagen — einfach auf den Link klicken.' },
  { icon: '🤝', text: 'Kirche ist kein Gebäude. Kirche ist, wenn Menschen füreinander da sind — lasst uns dazu zusammenkommen, z. B. in einem Gottesdienst.' },
  { icon: '🙏', text: 'Viele Menschen schwören darauf: Ein Gottesdienstbesuch tut ihrer Seele gut.' },
  { icon: '👨‍👩‍👧', text: 'Idee: Komm doch mal wieder mit deiner Familie zu einem Familiengottesdienst.' },
  { icon: '☀️', text: 'Du sollst den Feiertag heiligen — das bedeutet: Nimm dir eine Pause. Geh in einen Gottesdienst. Tu dir etwas Gutes.' },
  { icon: '💚', text: 'Brauchst du jemanden zum Zuhören? Dein Pfarrer oder deine Pfarrerin hat ein offenes Ohr. Sprich sie an.' },
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
};

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
    const thema = document.querySelector('.thema-card.selected')?.dataset.thema;

    if (!name) { shake('input-name'); return; }
    if (!gruppe) { shake('gruppe-grid'); return; }
    if (!thema) { shake('themen-grid'); return; }

    state.name = name;
    state.gruppe = gruppe;
    state.thema = window.fragenData.themen.find(t => t.id === thema);
    state.fragen = [...state.thema.fragen];
    state.aktuelleIndex = 0;
    state.punkte = 0;
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

  // Themen aus JSON laden
  const grid = document.getElementById('themen-grid');
  grid.innerHTML = '';
  window.fragenData.themen.forEach(t => {
    const div = document.createElement('div');
    div.className = 'thema-card';
    div.dataset.thema = t.id;
    div.innerHTML = `<div class="thema-icon">${t.icon}</div><div class="thema-name">${t.titel}</div>`;
    div.onclick = () => {
      document.querySelectorAll('.thema-card').forEach(c => c.classList.remove('selected'));
      div.classList.add('selected');
    };
    grid.appendChild(div);
  });
}

function shake(id) {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => el.style.animation = '', 400);
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

  // Progress
  document.getElementById('progress-fill').style.width = `${(idx / total) * 100}%`;
  document.getElementById('quiz-meta').textContent = `${state.name} · ${state.thema.titel} · Frage ${idx + 1} von ${total}`;

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
  card.innerHTML = '';

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
    btns[index].classList.add('richtig');
  } else {
    btns[index].classList.add('falsch');
    btns[frage.richtig].classList.add('richtig');
  }

  // Erklärung einblenden
  const erkBox = document.getElementById('erklaerung');
  erkBox.style.display = 'block';
  erkBox.className = 'erklaerung-box' + (richtig ? '' : ' wrong');
  let html = `<p>${frage.erklaerung}</p>`;
  if (frage.bibelstelle && frage.bibellink) {
    html += `<a href="${frage.bibellink}" target="_blank" rel="noopener">📖 ${frage.bibelstelle} in der Basisbibel →</a>`;
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
  card.innerHTML = `
    <div style="text-align:center; margin-bottom:20px; font-size:2rem">✨</div>
    <div class="zitat-text">${zitat.text}</div>
    <div class="zitat-quelle">
      <a href="${zitat.link}" target="_blank" rel="noopener" class="zitat-link">📖 ${zitat.quelle}</a>
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
  if (prozent >= 85) { emoji = '🏆'; text = 'Hammer! Du kennst dich richtig gut aus!'; }
  else if (prozent >= 60) { emoji = '🎉'; text = 'Gut gemacht! Weiter so!'; }
  else if (prozent >= 40) { emoji = '💪'; text = 'Du hast eine Menge gelernt heute!'; }

  document.getElementById('ergebnis-emoji').textContent = emoji;
  document.getElementById('ergebnis-score').textContent = `${punkte} / ${total}`;
  document.getElementById('ergebnis-text').textContent = text;

  if (prozent >= 70) starteKonfetti();

  // Score speichern
  speichereScore(state.name, state.gruppe, state.thema.id, punkte, total);

  document.getElementById('btn-nochmal').onclick = () => {
    state.aktuelleIndex = 0;
    state.punkte = 0;
    state.fragen = [...state.thema.fragen];
    startQuiz();
  };
  document.getElementById('btn-zum-start').onclick = () => showScreen('start');
  document.getElementById('btn-scores-from-result').onclick = () => {
    ladeScores();
    showScreen('scores');
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
      `${SUPABASE_URL}/rest/v1/scores?select=*&order=erstellt_am.desc&limit=100`,
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

  const mitWerten = gruppen.map(g => {
    const scores = alleScores.filter(s => s.gruppe === g.name);
    const avg = scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + (s.punkte / s.gesamt), 0) / scores.length * 100)
      : null;
    return { ...g, avg, count: scores.length };
  }).filter(g => g.avg !== null)
    .sort((a, b) => b.avg - a.avg);

  const container = document.getElementById('team-rangliste');
  if (mitWerten.length === 0) { container.innerHTML = ''; return; }

  const rankIcons = ['🥇','🥈','🥉','4.','5.'];
  container.innerHTML = `<div class="team-rangliste-grid">
    ${mitWerten.map((g, i) => `
      <div class="team-card">
        <div class="team-rank">${rankIcons[i] || (i+1)+'.'}
        </div>
        <div class="team-info">
          <div class="team-name">${g.icon} ${g.name}</div>
          <div class="team-avg">${g.avg}%</div>
          <div class="team-count">${g.count} Spiel${g.count !== 1 ? 'e' : ''}</div>
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
function starteKonfetti() {
  const container = document.getElementById('konfetti');
  container.innerHTML = '';
  const colors = ['#f39c12', '#e74c3c', '#8e44ad', '#27ae60', '#3498db', '#f1c40f'];
  for (let i = 0; i < 80; i++) {
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
