-- ============================================================
-- CORRECTIONS CAHIER V2 - PARTIE 2 : LOGIQUE DE VALIDATION & NETTOYAGE
-- ============================================================

-- 1. Règle VIN obligatoire selon le montant (Point 7 du cahier)
-- On crée une fonction de validation qui peut être appelée avant la création d'une commande
-- ou utilisée dans un trigger de sécurité.
create or replace function public.validate_order_vin(p_amount numeric, p_vin text)
returns boolean as $$
begin
  if p_amount > 50000 and (p_vin is null or p_vin = '') then
    return false; -- VIN obligatoire pour > 50k
  end if;
  return true;
end;
$$ language plpgsql;

-- Ajout d'une contrainte check sur la table orders pour forcer la règle au niveau DB
-- Note: Cela suppose que nous avons le VIN disponible dans la table orders ou via une jointure.
-- Pour être strict, on ajoute une colonne vin à la table orders si elle n'existe pas pour archiver l'état au moment du paiement.
alter table public.orders add column if not exists vin text;

-- Trigger pour bloquer l'insertion d'une commande non conforme
create or replace function public.tr_check_vin_requirement()
returns trigger as $$
begin
  if not public.validate_order_vin(new.price, new.vin) then
    raise exception 'Le numéro VIN/Châssis est obligatoire pour tout paiement supérieur à 50 000 FCFA';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists tr_vin_requirement on public.orders;
create trigger tr_vin_requirement
  before insert on public.orders
  for each row execute function public.tr_check_vin_requirement();

-- 2. Nettoyage automatique des offres expirées (Point 2 du cahier)
-- On crée une fonction de maintenance pour supprimer les offres expirées depuis 48h
-- et marquer celles de 24h comme expirées.

create or replace function public.maintenance_cleanup_offers()
returns void as $$
begin
  -- Suppression définitive après 48h
  delete from public.offers
  where expires_at < now() - interval '48 hours';

  -- Note: Le statut 'expired' est géré dynamiquement via la colonne expires_at 
  -- et les vues, mais on peut ajouter des notifications ici.
end;
$$ language plpgsql;

-- 3. Notifications automatiques d'expiration (Point 4 du cahier)
-- Fonction pour notifier les utilisateurs quand une demande expire
create or replace function public.notify_request_expiration()
returns trigger as $$
begin
  if new.status = 'expired' and old.status = 'open' then
    -- Notification à l'acheteur
    insert into public.notifications (user_id, title, message, type)
    values (new.buyer_id, 'Demande expirée', 'Votre demande de pièce est arrivée à expiration.', 'request_expired');

    -- Notification aux vendeurs ayant fait une offre sur cette demande
    insert into public.notifications (user_id, title, message, type)
    select seller_id, 'Demande expirée', 'La demande sur laquelle vous avez postulé a expiré.', 'request_expired'
    from public.offers
    where request_id = new.id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists tr_notify_expiration on public.part_requests;
create trigger tr_notify_expiration
  after update on public.part_requests
  for each row execute function public.notify_request_expiration();
