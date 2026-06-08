// js/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Retourne un sujet aléatoire parmi tous les sujets disponibles */
export async function getRandomSubject(excludeId = null) {
  const { data, error } = await db
    .from('subjects')
    .select('*');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Aucun sujet disponible');

  const pool = excludeId ? data.filter(s => s.id !== excludeId) : data;
  const list  = pool.length > 0 ? pool : data;
  return list[Math.floor(Math.random() * list.length)];
}

/** Crée ou retrouve un joueur par pseudo */
export async function getOrCreatePlayer(username) {
  const { data: existing } = await db
    .from('players')
    .select('*')
    .eq('username', username)
    .single();
  if (existing) return existing;

  const { data, error } = await db
    .from('players')
    .insert({ username })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Sauvegarde une plaidoirie avec son score */
export async function saveResponse({ playerId, subjectId, camp, content, scores }) {
  const { data, error } = await db
    .from('responses')
    .insert({
      player_id:         playerId,
      subject_id:        subjectId,
      camp,
      content,
      score_total:       scores.total,
      score_conviction:  scores.conviction,
      score_arguments:   scores.arguments,
      score_originality: scores.originality,
      score_style:       scores.style,
      ai_verdict:        scores.verdict
    })
    .select()
    .single();
  if (error) throw error;

  await db.rpc('increment_player_score', { p_id: playerId, points: scores.total });
  return data;
}

/** Classement global toutes parties (top 50) */
export async function getLeaderboard() {
  const { data, error } = await db
    .from('responses')
    .select('*, players(username), subjects(text, category)')
    .order('score_total', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

/** Vérifie si le joueur a déjà joué aujourd'hui */
export async function hasPlayedToday(playerId, subjectId) {
  const { data } = await db
    .from('responses')
    .select('id')
    .eq('player_id', playerId)
    .eq('subject_id', subjectId)
    .single();
  return !!data;
}

/** Récupère l'historique d'un joueur */
export async function getPlayerHistory(playerId) {
  const { data, error } = await db
    .from('responses')
    .select('*, subjects(text, category)')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
