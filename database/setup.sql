-- ============================================================
-- VERDICT — Script de création de la base de données
-- Coller dans : Supabase → SQL Editor → New query → Run
-- ============================================================

-- ── 1. Tables ──────────────────────────────────────────────

create table if not exists subjects (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  category    text check (category in ('absurde', 'societal', 'philosophique')),
  active_date date unique,
  created_at  timestamptz default now()
);

create table if not exists players (
  id           uuid primary key default gen_random_uuid(),
  username     text unique not null,
  total_score  integer default 0,
  games_played integer default 0,
  created_at   timestamptz default now()
);

create table if not exists responses (
  id                uuid primary key default gen_random_uuid(),
  player_id         uuid references players(id),
  subject_id        uuid references subjects(id),
  camp              text not null check (camp in ('POUR', 'CONTRE')),
  content           text not null,
  score_total       integer,
  score_conviction  integer,
  score_arguments   integer,
  score_originality integer,
  score_style       integer,
  ai_verdict        text,
  created_at        timestamptz default now(),
  unique(player_id, subject_id)
);

-- ── 2. Fonction mise à jour du score joueur ────────────────

create or replace function increment_player_score(p_id uuid, points integer)
returns void language sql as $$
  update players
  set total_score  = total_score + points,
      games_played = games_played + 1
  where id = p_id;
$$;

-- ── 3. Sécurité RLS (Row Level Security) ──────────────────

alter table subjects   enable row level security;
alter table players    enable row level security;
alter table responses  enable row level security;

-- Lecture publique pour tout le monde
create policy "Lecture publique subjects"
  on subjects for select using (true);

create policy "Lecture publique players"
  on players for select using (true);

create policy "Lecture publique responses"
  on responses for select using (true);

-- Insertion libre (le jeu crée joueurs et réponses)
create policy "Insertion joueurs"
  on players for insert with check (true);

create policy "Insertion réponses"
  on responses for insert with check (true);

-- ── 4. Sujets de départ ────────────────────────────────────

insert into subjects (text, category, active_date) values
  ('Les chats sont supérieurs aux chiens',              'absurde',       current_date),
  ('L''ananas a sa place sur la pizza',                 'absurde',       current_date + 1),
  ('Les réseaux sociaux font plus de mal que de bien',  'societal',      current_date + 2),
  ('La semaine de 4 jours est l''avenir du travail',    'societal',      current_date + 3),
  ('L''argent fait le bonheur',                         'philosophique', current_date + 4),
  ('La liberté vaut mieux que la sécurité',             'philosophique', current_date + 5),
  ('Les devoirs à la maison sont inutiles',             'societal',      current_date + 6),
  ('Dormir est une perte de temps',                     'absurde',       current_date + 7),
  ('Les jeux vidéo sont un art à part entière',         'philosophique', current_date + 8),
  ('La voiture devrait être interdite en ville',        'societal',      current_date + 9)
on conflict (active_date) do nothing;

-- ── Vérification ───────────────────────────────────────────
select 'Tables créées avec succès !' as status;
select 'Sujets insérés : ' || count(*) as sujets from subjects;
