// js/game.js
import { TIMER_SECONDS, MIN_CHARS, MAX_CHARS } from './config.js';

/**
 * Assigne POUR ou CONTRE de manière déterministe.
 * Même joueur + même date = toujours le même camp.
 */
export function assignCamp(playerId, dateStr) {
  const hash = [...(playerId + dateStr)]
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return hash % 2 === 0 ? 'POUR' : 'CONTRE';
}

/**
 * Lance le timer.
 * onTick(secondesRestantes) appelé chaque seconde
 * onExpire() appelé quand le timer atteint 0
 * Retourne une fonction stop() pour annuler le timer.
 */
export function startTimer(onTick, onExpire) {
  let remaining = TIMER_SECONDS;
  onTick(remaining);

  const interval = setInterval(() => {
    remaining--;
    onTick(remaining);
    if (remaining <= 0) {
      clearInterval(interval);
      onExpire();
    }
  }, 1000);

  return () => clearInterval(interval);
}

/** Formate des secondes en "MM:SS" */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/** Valide le contenu. Retourne un message d'erreur ou null si valide. */
export function validateContent(content) {
  const len = content.trim().length;
  if (len < MIN_CHARS) return `Minimum ${MIN_CHARS} caractères requis.`;
  if (len > MAX_CHARS) return `Maximum ${MAX_CHARS} caractères autorisés.`;
  return null;
}
