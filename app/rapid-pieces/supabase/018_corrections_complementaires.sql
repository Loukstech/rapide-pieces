-- ============================================================
-- CORRECTIONS COMPLÉMENTAIRES - PARTIE 3 : QUALITÉ & HISTORIQUE
-- ============================================================

-- 1. Rating vendeur commence à 5 étoiles (Point 1)
-- On modifie la valeur par défaut pour les futurs vendeurs et on met à jour les existants.
alter table public.sellers 
  alter column rating set default 5.0;

update public.sellers 
set rating = 5.0 
where rating = 0;

-- 2. Sanctions automatiques (Point 2)
-- Création d'une table de bannissement ou utilisation d'une colonne dans profiles/sellers.
-- On ajoute une colonne 'is_banned' et 'ban_reason' pour gérer les sanctions.
alter table public.sellers 
  add column if not exists is_banned boolean default false,
  add column if not exists ban_reason text;

-- Fonction de vérification des sanctions basée sur le rating
create or replace function public.fn_apply_seller_sanctions()
returns trigger as $$
begin
  -- Sanction : Suppression/Bannissement si < 2 étoiles
  if new.rating < 2.0 then
    new.is_banned := true;
    new.ban_reason := 'Rating trop bas (< 2 étoiles) : suppression du compte';
  -- Sanction : Suspension si rating <= 3 étoiles
  elsif new.rating <= 3.0 then
    new.is_banned := true;
    new.ban_reason := 'Suspension temporaire : Rating inférieur ou égal à 3 étoiles';
  else
    new.is_banned := false;
    new.ban_reason := null;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists tr_seller_sanctions on public.sellers;
create trigger tr_seller_sanctions
  before update of rating on public.sellers
  for each row execute function public.fn_apply_seller_sanctions();

-- 3. Historique complet des négociations (Point 8)
-- On crée une table pour stocker chaque étape de la négociation (Prix, Date, Acteur)
create table if not exists public.offer_negotiation_history (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  price numeric not null,
  actor text not null check (actor in ('buyer', 'seller')),
  created_at timestamptz not null default now(),
  note text
);

create index if not exists idx_negotiation_offer_id on public.offer_negotiation_history(offer_id);

-- Trigger pour enregistrer automatiquement chaque changement de prix dans l'historique
create or replace function public.fn_log_offer_negotiation()
returns trigger as $$
begin
  if (old.price <> new.price) then
    insert into public.offer_negotiation_history (offer_id, price, actor, note)
    values (new.id, new.price, new.last_actor, 'Changement de prix lors de la négociation');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists tr_log_negotiation on public.offers;
create trigger tr_log_negotiation
  after update of price on public.offers
  for each row execute function public.fn_log_offer_negotiation();

-- Initialisation de l'historique pour les offres existantes
insert into public.offer_negotiation_history (offer_id, price, actor, note)
select id, price, last_actor, 'Prix initial' from public.offers;
