-- ============================================================
-- VERDICT — 10 nouveaux sujets absurdes
-- Coller dans : Supabase → SQL Editor → New query → Run
-- ============================================================

insert into subjects (text, category, active_date) values
  ('Les licornes seraient de meilleurs présidents que les humains',     'absurde', current_date + 10),
  ('Il est plus courageux de manger de la pizza froide au petit-déj',  'absurde', current_date + 11),
  ('Les gens qui dorment à plat ventre sont plus créatifs',            'absurde', current_date + 12),
  ('Les pingouins sont objectivement les animaux les mieux habillés',  'absurde', current_date + 13),
  ('Le Wi-Fi devrait être considéré comme un droit humain fondamental','absurde', current_date + 14),
  ('Parler à ses plantes les rend plus intelligentes qu''elles',        'absurde', current_date + 15),
  ('Les gens qui mettent du ketchup sur leurs pâtes ont raison',       'absurde', current_date + 16),
  ('Les chaussettes dépareillées sont un signe d''intelligence supérieure', 'absurde', current_date + 17),
  ('Il est plus efficace de travailler en pyjama qu''en costume',      'absurde', current_date + 18),
  ('Les extraterrestres évitent la Terre à cause de notre musique',    'absurde', current_date + 19)
on conflict (active_date) do nothing;

-- Vérification
select text, category, active_date
from subjects
where category = 'absurde'
order by active_date;
