-- ============================================================
-- CORRECTIONS CAHIER V2 - PARTIE 1 : BASE DE DONNÉES
-- ============================================================

-- 1. Gestion de l'expiration des offres (Point 2 du cahier)
-- Ajout d'une date d'expiration pour chaque offre.
alter table public.offers 
  add column if not exists expires_at timestamptz default (now() + interval '24 hours');

-- 2. Distinction Local / International (Point 1 du cahier)
-- On ajoute un champ booléen pour faciliter le filtrage rapide sans analyser le delivery_type.
alter table public.offers 
  add column if not exists is_international boolean default false;

-- 3. Système de Notifications (Point 4 du cahier)
-- Table pour gérer la cloche de notification.
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('request_expired', 'offer_received', 'order_update', 'system')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_read on public.notifications(user_id, is_read);

-- 4. Renouvellement des demandes (Point 3 du cahier)
-- Ajout d'un compteur de renouvellement sur les demandes.
alter table public.part_requests 
  add column if not exists renewal_count integer not null default 0;

-- RLS pour les notifications
alter table public.notifications enable row level security;

create policy "notifications: users can see their own" 
  on public.notifications for select 
  using (user_id = auth.uid());

create policy "notifications: users can update their own" 
  on public.notifications for update 
  using (user_id = auth.uid());

-- ============================================================
-- TRIGGERS & AUTOMATISATION
-- ============================================================

-- Trigger pour définir automatiquement si une offre est internationale 
-- basée sur le delivery_type lors de l'insertion.
create or replace function public.fn_set_offer_origin()
returns trigger as $$
begin
  if new.delivery_type in ('RAPID_NIGERIA', 'RAPID_USA', 'RAPID_CHINA', 'RAPID_DUBAI', 'RAPID_TURKEY', 'RAPID_FRANCE', 'RAPID_GERMANY', 'RAPID_ENGLAND') then
    new.is_international := true;
  else
    new.is_international := false;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists tr_set_offer_origin on public.offers;
create trigger tr_set_offer_origin
  before insert on public.offers
  for each row execute function public.fn_set_offer_origin();
