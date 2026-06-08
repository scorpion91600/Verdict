// js/results.js
import { getPageData, navigateTo } from './ui.js';

function init() {
  const data = getPageData();
  if (!data) { navigateTo('index.html'); return; }

  const { scores, camp, subject } = data;

  document.getElementById('result-subject').textContent = subject;
  const campEl = document.getElementById('result-camp');
  campEl.textContent = camp;
  campEl.className   = `camp-badge camp-badge--${camp.toLowerCase()}`;

  document.getElementById('score-total').textContent = scores.total;
  document.getElementById('verdict-text').textContent = scores.verdict;

  renderBar('conviction',  scores.conviction,  30);
  renderBar('arguments',   scores.arguments,   30);
  renderBar('originality', scores.originality, 20);
  renderBar('style',       scores.style,       20);

  document.getElementById('to-leaderboard').addEventListener('click', () => {
    navigateTo('leaderboard.html');
  });
}

function renderBar(key, value, max) {
  const pct = Math.round((value / max) * 100);
  const fill  = document.getElementById(`bar-${key}`);
  const label = document.getElementById(`score-${key}`);
  if (fill)  fill.style.width = `${pct}%`;
  if (label) label.textContent = `${value} / ${max}`;
}

init();
