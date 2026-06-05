// =====================
// KONFI-CHECK App
// =====================

const SUPABASE_URL = 'https://jhelduwnmjpomzrowgmr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZWxkdXdubWpwb216cm93Z21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNzQ4NDEsImV4cCI6MjA5NTc1MDg0MX0.-Mv6TRBTgJhqjaLARs3hvLm6vvMcnQ2mlfubgLvriyU';

// Zitate zwischen den Fragen
const ZITATE = [
  { text: '„Ihr seid der Leib Christi, und jeder einzelne ist ein Glied davon.”', quelle: '1 Kor 12,27', link: 'https://www.die-bibel.de/bibel/BB/1CO.12.27-1CO.12.27' },
  { text: '„Es gibt verschiedene Gaben, aber nur einen Geist.”', quelle: '1 Kor 12,4', link: 'https://www.die-bibel.de/bibel/BB/1CO.12.4-1CO.12.4' },
  { text: '„Auf einmal gab es vom Himmel her ein Rauschen, wie wenn ein heftiger Sturm aufkommt.”', quelle: 'Apg 2,2', link: 'https://www.die-bibel.de/bibel/BB/ACT.2.2-ACT.2.2' },
  { text: '„Wenn ein Glied leidet, leiden alle anderen Glieder mit.”', quelle: '1 Kor 12,26', link: 'https://www.die-bibel.de/bibel/BB/1CO.12.26-1CO.12.26' },
  { text: '„Die Liebe ist geduldig und gütig.”', quelle: '1 Kor 13,4', link: 'https://www.die-bibel.de/bibel/BB/1CO.13.4-1CO.13.4' },
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
};

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

  // Zitat alle 2 Fragen (außer erste)
  if (idx > 0 && idx % 2 === 0 && !state.showZitat) {
    state.showZitat = true;
    renderZitat(frage);
    return;
  }
  state.showZitat = false;

  const card = document.getElementById('quiz-card');
  card.innerHTML = '';

  // Schwierigkeit
  const sw = document.createElement('div');
  sw.className = `schwierigkeit s${frage.schwierigkeit}`;
  const sterne = '★'.repeat(frage.schwierigkeit) + '☆'.repeat(3 - frage.schwierigkeit);
  sw.innerHTML = `${sterne} ${['', 'Leicht', 'Mittel', 'Schwer'][frage.schwierigkeit]}`;
  card.appendChild(sw);

  // Bild (wenn vorhanden)
  if (frage.typ === 'bild' && frage.bild) {
    const img = document.createElement('img');
    img.src = frage.bild;
    img.alt = frage.bildalt || '';
    img.className = 'frage-bild';
    img.onerror = () => img.style.display = 'none';
    card.appendChild(img);
  }

  // Frage
  const frageEl = document.createElement('div');
  frageEl.className = 'frage-text';

  if (frage.typ === 'luecke') {
    frageEl.innerHTML = frage.frage.replace('___', '<span class="luecke">___</span>');
  } else {
    frageEl.textContent = frage.frage;
  }
  card.appendChild(frageEl);

  // Antworten
  const grid = document.createElement('div');
  grid.className = 'antworten-grid';
  const labels = ['A', 'B', 'C', 'D'];

  frage.antworten.forEach((antwort, i) => {
    const btn = document.createElement('button');
    btn.className = 'antwort-btn';
    btn.innerHTML = `<span class="antwort-label">${labels[i]}</span> ${antwort}`;
    btn.onclick = () => antwortGewählt(i, frage, grid);
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
  const zitat = pool[Math.floor(Math.random() * pool.length)];
  const card = document.getElementById('quiz-card');
  card.innerHTML = `
    <div style="text-align:center; margin-bottom:20px; font-size:2rem">✨</div>
    <div class="zitat-text">${zitat.text}</div>
    <div class="zitat-quelle">
      <a href="${zitat.link}" target="_blank" rel="noopener" class="zitat-link">📖 ${zitat.quelle}</a>
    </div>
    <button class="weiter-btn" style="display:block; margin-top:24px" onclick="state.showZitat=true; renderFrage()">Weiter →</button>
  `;
  // Ersetze card mit Zitat-Card-Styling
  card.style.background = 'linear-gradient(135deg, #8e44ad, #6c3483)';
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
    await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
      method: 'POST',
      headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ name, gruppe, thema, punkte, gesamt })
    });
  } catch (e) {
    console.warn('Score konnte nicht gespeichert werden:', e);
  }
}

async function ladeScores() {
  const list = document.getElementById('score-list');
  list.innerHTML = '<div class="loading"><div class="spinner"></div>Lade Ergebnisse…</div>';

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/scores?select=*&order=erstellt_am.desc&limit=100`,
      { headers: SB_HEADERS }
    );
    alleScores = await res.json();
    renderScores('alle');
    renderDuell();
  } catch (e) {
    list.innerHTML = '<div class="loading">Scores konnten nicht geladen werden.</div>';
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
      <button class="delete-btn" onclick="loescheEintrag('${s.id}')" style="display:none; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; border:none; background:#e74c3c; color:#fff; font-size:1rem; cursor:pointer; margin-left:8px; flex-shrink:0;">×</button>
    `;
    list.appendChild(item);
  });
}

function renderDuell() {
  const gruppen = ['Staaken Dorfkirche', 'Staaken Gartenstadt'];
  const avgs = gruppen.map(g => {
    const scores = alleScores.filter(s => s.gruppe === g);
    if (scores.length === 0) return 0;
    const avg = scores.reduce((sum, s) => sum + (s.punkte / s.gesamt), 0) / scores.length;
    return Math.round(avg * 100);
  });

  document.getElementById('duell-avg-0').textContent = avgs[0] + '%';
  document.getElementById('duell-avg-1').textContent = avgs[1] + '%';
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

  let loeschModus = false;
  document.getElementById('btn-eintraege-entfernen').onclick = () => {
    loeschModus = !loeschModus;
    document.getElementById('score-list').querySelectorAll('.delete-btn').forEach(btn => {
      btn.style.display = loeschModus ? 'flex' : 'none';
    });
  };

  window.loescheEintrag = async (id) => {
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
