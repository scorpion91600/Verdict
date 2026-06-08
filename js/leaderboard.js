// js/leaderboard.js
import { getLeaderboard } from './supabase.js';
import { getPlayer, showToast } from './ui.js';

const CATEGORY_LABELS = {
  absurde:       '🎭 Absurde',
  societal:      '🏛️ Sociétal',
  philosophique: '🧠 Philosophique'
};

async function init() {
  try {
    const rows = await getLeaderboard();
    renderLeaderboard(rows);
  } catch (err) {
    showToast('Impossible de charger le classement.', 'error');
    console.error(err);
  }
}

function renderLeaderboard(rows) {
  const list  = document.getElementById('leaderboard-list');
  const empty = document.getElementById('leaderboard-empty');

  if (!rows || rows.length === 0) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  const currentPlayer = getPlayer();

  rows.forEach((row, index) => {
    const card = document.createElement('article');
    const rank  = index + 1;
    const isMe  = currentPlayer && row.player_id === currentPlayer.id;
    const subjectLabel = row.subjects?.text ?? '–';
    const catLabel     = CATEGORY_LABELS[row.subjects?.category] ?? '';

    card.className = `leaderboard-card${isMe ? ' leaderboard-card--me' : ''}`;
    card.innerHTML = `
      <div class="leaderboard-rank">${rankBadge(rank)}</div>
      <div class="leaderboard-body">
        <div class="leaderboard-header">
          <span class="leaderboard-username">${escHtml(row.players?.username ?? 'Anonyme')}${isMe ? ' <span class="badge badge--you">Moi</span>' : ''}</span>
          <span class="camp-badge camp-badge--${row.camp.toLowerCase()}">${row.camp}</span>
          <span class="leaderboard-score">${row.score_total} pts</span>
        </div>
        <p class="leaderboard-subject">
          <span class="category-chip">${catLabel}</span>
          ${escHtml(subjectLabel)}
        </p>
        <div class="score-bars">
          ${scorebar('Conviction',  row.score_conviction,  30)}
          ${scorebar('Arguments',   row.score_arguments,   30)}
          ${scorebar('Originalité', row.score_originality, 20)}
          ${scorebar('Style',       row.score_style,       20)}
        </div>
        <blockquote class="leaderboard-plea">${escHtml(row.content)}</blockquote>
        ${row.ai_verdict ? `<p class="ai-verdict">⚖️ ${escHtml(row.ai_verdict)}</p>` : ''}
      </div>
    `;
    list.appendChild(card);
  });
}

function rankBadge(rank) {
  if (rank === 1) return '<span class="rank rank--gold">🥇</span>';
  if (rank === 2) return '<span class="rank rank--silver">🥈</span>';
  if (rank === 3) return '<span class="rank rank--bronze">🥉</span>';
  return `<span class="rank">#${rank}</span>`;
}

function scorebar(label, value, max) {
  const pct = Math.round((value / max) * 100);
  return `
    <div class="scorebar">
      <span class="scorebar-label">${label}</span>
      <div class="scorebar-track">
        <div class="scorebar-fill" style="width:${pct}%"></div>
      </div>
      <span class="scorebar-value">${value}/${max}</span>
    </div>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

init();
