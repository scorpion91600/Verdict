// js/profile.js
import { getPlayer, navigateTo, showToast } from './ui.js';
import { getPlayerHistory }                 from './supabase.js';

const CATEGORY_LABELS = {
  absurde:       '🎭 Absurde',
  societal:      '🏛️ Sociétal',
  philosophique: '🧠 Philosophique'
};

async function init() {
  const player = getPlayer();
  if (!player) { navigateTo('index.html'); return; }

  document.getElementById('profile-username').textContent  = player.username;
  document.getElementById('profile-score').textContent     = player.total_score ?? 0;
  document.getElementById('profile-games').textContent     = player.games_played ?? 0;

  try {
    const history = await getPlayerHistory(player.id);
    renderHistory(history);
  } catch (err) {
    showToast('Impossible de charger l\'historique.', 'error');
    console.error(err);
  }

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('verdict_player');
    navigateTo('index.html');
  });
}

function renderHistory(rows) {
  const list  = document.getElementById('history-list');
  const empty = document.getElementById('history-empty');

  if (!rows || rows.length === 0) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  rows.forEach(row => {
    const card = document.createElement('article');
    card.className = 'history-card';
    const date = new Date(row.created_at).toLocaleDateString('fr-FR');
    card.innerHTML = `
      <div class="history-header">
        <span class="history-date">${date}</span>
        <span class="camp-badge camp-badge--${row.camp.toLowerCase()}">${row.camp}</span>
        <span class="history-score">${row.score_total} pts</span>
      </div>
      <p class="history-subject">${escHtml(row.subjects?.text ?? '–')}</p>
      <span class="category-chip">${CATEGORY_LABELS[row.subjects?.category] ?? ''}</span>
      ${row.ai_verdict ? `<p class="ai-verdict">⚖️ ${escHtml(row.ai_verdict)}</p>` : ''}
    `;
    list.appendChild(card);
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

init();
