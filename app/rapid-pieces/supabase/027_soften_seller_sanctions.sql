-- Assouplit la sanction automatique liée au rating (migration 018), comme
-- demandé après la mise en place du vrai système de notation (026) : sans
-- garde-fou, un seul mauvais avis sur un vendeur tout neuf pouvait suffire à
-- le faire passer sous 3 étoiles et le suspendre immédiatement.
--
-- Nouvelles règles :
-- 1. Rien ne se déclenche avant un minimum d'avis (protège les nouveaux
--    vendeurs d'un unique avis négatif).
-- 2. À 3 étoiles ou moins (avec assez d'avis) : simple AVERTISSEMENT, pas de
--    suspension — le cahier lui-même laissait ce point à verrouiller.
-- 3. En dessous de 2 étoiles (avec assez d'avis) : suspension automatique,
--    conforme au cahier.
-- 4. Le trigger ne touche plus jamais un bannissement posé manuellement par
--    un admin (ex. fraude) — il ne gère que ses propres bannissements/
--    avertissements automatiques, reconnaissables au préfixe 'Auto:'.

alter table public.sellers
  add column if not exists has_warning boolean not null default false,
  add column if not exists warning_reason text;

create or replace function public.fn_apply_seller_sanctions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  review_count integer;
  min_reviews constant integer := 5;
begin
  select count(*) into review_count from public.seller_reviews where seller_id = new.id;

  if review_count < min_reviews then
    -- Pas assez d'historique pour juger le vendeur : aucune sanction/avertissement.
    new.has_warning := false;
    new.warning_reason := null;
    -- Ne jamais lever un bannissement manuel (admin) posé pour une autre raison.
    if new.is_banned and new.ban_reason like 'Auto:%' then
      new.is_banned := false;
      new.ban_reason := null;
    end if;
    return new;
  end if;

  if new.rating < 2.0 then
    new.is_banned := true;
    new.ban_reason := 'Auto: rating trop bas (< 2 étoiles sur ' || review_count || ' avis)';
    new.has_warning := false;
    new.warning_reason := null;
  elsif new.rating <= 3.0 then
    -- Assoupli : avertissement seul, plus de suspension automatique à ce palier.
    new.has_warning := true;
    new.warning_reason := 'Rating faible (≤ 3 étoiles sur ' || review_count || ' avis) — à surveiller';
    if new.is_banned and new.ban_reason like 'Auto:%' then
      new.is_banned := false;
      new.ban_reason := null;
    end if;
  else
    new.has_warning := false;
    new.warning_reason := null;
    if new.is_banned and new.ban_reason like 'Auto:%' then
      new.is_banned := false;
      new.ban_reason := null;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists tr_seller_sanctions on public.sellers;
create trigger tr_seller_sanctions
  before update of rating on public.sellers
  for each row execute function public.fn_apply_seller_sanctions();

-- Note : aucun vendeur n'a encore été affecté par l'ancienne version stricte
-- (vérifié — personne n'est banni ni n'a d'avis pour l'instant), donc pas de
-- rattrapage nécessaire pour des lignes déjà mal sanctionnées.
