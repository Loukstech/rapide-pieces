-- CRITIQUE : la contrainte CHECK d'origine sur offers.status n'a jamais
-- inclus 'completed' (ajouté en toutes lettres par le code, migration/commit
-- "Cahier V2 - Point 47", jamais accompagné d'une migration DB). Résultat :
-- accepter une offre alors que d'autres offres existent sur la même demande
-- échoue systématiquement (confirmé en reproduisant directement l'update).
-- Avant le correctif du acceptOffer() qui vérifie enfin les erreurs, ça
-- passait inaperçu ; depuis, ça bloque carrément l'acceptation. À corriger
-- en priorité.
--
-- Cahier V2 - Point 2 : on ajoute aussi 'expired' pour le cycle de vie complet
-- d'une offre (24h sans réponse → expirée, invisible des listes actives,
-- conservée temporairement ; 48h de plus → suppression définitive).

alter table public.offers drop constraint if exists offers_status_check;
alter table public.offers add constraint offers_status_check
  check (status in ('pending', 'countered', 'accepted', 'rejected', 'completed', 'expired'));

-- Fonction appelée au mieux (best-effort) côté client à chaque navigation,
-- même pattern que expireStaleRequests() côté part_requests. Security
-- definer : un acheteur ne peut pas mettre à jour l'offre d'un vendeur (RLS
-- "offers: seller owns"), donc l'expiration doit s'exécuter avec des droits
-- élevés plutôt que ceux de l'utilisateur courant.
create or replace function public.expire_stale_offers()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.offers
  set status = 'expired'
  where status in ('pending', 'countered')
    and expires_at < now();
end;
$$;

grant execute on function public.expire_stale_offers() to authenticated, anon;

-- Nettoyage définitif après 48h supplémentaires (Cahier V2 §2) — sécurisé en
-- security definer pour la même raison.
create or replace function public.maintenance_cleanup_offers()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.offers
  where expires_at < now() - interval '48 hours';
end;
$$;

grant execute on function public.maintenance_cleanup_offers() to authenticated, anon;

-- Notifications d'expiration (Cahier V2 §4) — informe l'acheteur de la
-- demande concernée et le vendeur de l'offre.
create or replace function public.notify_offer_expiration()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'expired' and old.status in ('pending', 'countered') then
    insert into public.notifications (user_id, title, message, type)
    select r.buyer_id, 'Offre expirée', 'Une offre reçue pour "' || new.part_name || '" est arrivée à expiration.', 'offer_received'
    from public.part_requests r where r.id = new.request_id;

    insert into public.notifications (user_id, title, message, type)
    values (new.seller_id, 'Offre expirée', 'Votre offre pour "' || new.part_name || '" a expiré sans réponse de l''acheteur.', 'offer_received');
  end if;
  return new;
end;
$$;

drop trigger if exists tr_notify_offer_expiration on public.offers;
create trigger tr_notify_offer_expiration
  after update on public.offers
  for each row execute function public.notify_offer_expiration();
