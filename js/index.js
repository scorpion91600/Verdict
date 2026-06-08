// js/index.js
import { getOrCreatePlayer } from './supabase.js';
import { savePlayer, navigateTo, showToast, setLoading } from './ui.js';

const form     = document.getElementById('login-form');
const input    = document.getElementById('username-input');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = input.value.trim();

  if (username.length < 2) {
    showToast('Pseudo trop court (minimum 2 caractères).', 'error');
    return;
  }
  if (username.length > 20) {
    showToast('Pseudo trop long (maximum 20 caractères).', 'error');
    return;
  }

  setLoading(submitBtn, true);
  try {
    const player = await getOrCreatePlayer(username);
    savePlayer(player);
    navigateTo('game.html');
  } catch (err) {
    showToast('Erreur de connexion. Réessaie.', 'error');
    console.error(err);
  } finally {
    setLoading(submitBtn, false);
  }
});
