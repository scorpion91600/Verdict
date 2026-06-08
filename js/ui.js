// js/ui.js

/** Affiche un toast temporaire en bas de l'écran */
export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast--visible'));
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/** Active/désactive le state chargement d'un bouton */
export function setLoading(btn, loading) {
  btn.disabled = loading;
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Chargement…';
  } else {
    btn.textContent = btn.dataset.originalText || btn.textContent;
  }
}

/** Passe à une autre page en stockant des données en sessionStorage */
export function navigateTo(url, data = {}) {
  if (Object.keys(data).length) {
    sessionStorage.setItem('verdict_data', JSON.stringify(data));
  }
  window.location.href = url;
}

/** Récupère les données passées entre pages (et les efface) */
export function getPageData() {
  const raw = sessionStorage.getItem('verdict_data');
  if (!raw) return null;
  sessionStorage.removeItem('verdict_data');
  return JSON.parse(raw);
}

/** Sauvegarde le joueur connecté */
export function savePlayer(player) {
  localStorage.setItem('verdict_player', JSON.stringify(player));
}

/** Récupère le joueur connecté */
export function getPlayer() {
  const raw = localStorage.getItem('verdict_player');
  return raw ? JSON.parse(raw) : null;
}
