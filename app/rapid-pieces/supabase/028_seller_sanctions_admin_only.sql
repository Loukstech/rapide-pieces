-- Suite à la discussion : la détection peut rester automatique, mais la
-- DÉCISION de suspendre/bannir un vendeur doit toujours passer par un humain
-- (même standard qu'Amazon/Uber/Airbnb) — un faux avis ou une note groupée
-- malveillante ne doit jamais suffire à bannir quelqu'un sans intervention.
--
-- Avant : sous 2 étoiles (avec assez d'avis), le vendeur était banni
-- automatiquement (is_banned = true), sans validation admin.
-- Après : sous 2 étoiles, c'est une ALERTE CRITIQUE (warning_severity =
-- 'critical'), affichée en évidence côté admin — mais is_banned reste sous le
-- contrôle exclusif de l'admin (bouton Bannir déjà existant).

alter table public.sellers
  add column if not exists warning_severity text check (warning_severity is null or warning_severity in ('warning', 'critical'));

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

  -- On ne bannit plus jamais automatiquement — seule l'alerte est automatique,
  -- la décision de suspendre reste manuelle (bouton Bannir de l'admin). On ne
  -- touche donc plus jamais is_banned/ban_reason ici.

  if review_count < min_reviews then
    new.has_warning := false;
    new.warning_reason := null;
    new.warning_severity := null;
    return new;
  end if;

  if new.rating < 2.0 then
    new.has_warning := true;
    new.warning_severity := 'critical';
    new.warning_reason := 'Rating très bas (< 2 étoiles sur ' || review_count || ' avis) — décision de suspension à valider par un admin';
  elsif new.rating <= 3.0 then
    new.has_warning := true;
    new.warning_severity := 'warning';
    new.warning_reason := 'Rating faible (≤ 3 étoiles sur ' || review_count || ' avis) — à surveiller';
  else
    new.has_warning := false;
    new.warning_reason := null;
    new.warning_severity := null;
  end if;

  return new;
end;
$$;

drop trigger if exists tr_seller_sanctions on public.sellers;
create trigger tr_seller_sanctions
  before update of rating on public.sellers
  for each row execute function public.fn_apply_seller_sanctions();

-- Lève tout bannissement que l'ancienne version automatique aurait posé
-- (préfixe 'Auto:') — désormais un bannissement ne peut venir que d'un admin.
update public.sellers
set is_banned = false, ban_reason = null
where is_banned and ban_reason like 'Auto:%';
