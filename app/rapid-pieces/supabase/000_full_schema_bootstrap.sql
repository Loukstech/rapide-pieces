-- ============================================================
-- Rapid Pièces — schéma complet consolidé (bootstrap d'un projet Supabase VIERGE)
-- ============================================================
-- À exécuter UNE SEULE FOIS, en entier, dans Project → SQL Editor → New query,
-- sur un projet Supabase tout neuf (aucune table déjà créée).
--
-- Ce fichier remplace, pour un nouveau projet, l'exécution successive de
-- schema.sql puis 002/003/004/005/006/007/008/009/010 — il représente directement l'état final
-- de ces cinq fichiers, dans l'ordre, sans étape intermédiaire à rejouer.
-- Les fichiers numérotés restent conservés tels quels dans ce dossier comme
-- historique des évolutions (utile si un jour on doit relire "pourquoi telle
-- colonne existe"), mais ce n'est plus ce script-ci qu'on modifiera au fil de
-- l'eau : les prochaines évolutions repartiront d'un nouveau fichier
-- 006_....sql à appliquer par-dessus, comme avant.
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- 1. Profils (étend auth.users, un profil par compte créé via Supabase Auth)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('buyer', 'seller', 'admin')),
  buyer_type text check (buyer_type is null or buyer_type in ('individual', 'mechanic', 'garage', 'business')),
  name text not null,
  phone text,
  phone_secondary text,
  location text,
  country text,
  address text,
  email text,
  rapid_points integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_profiles_country on public.profiles(country);
create index idx_profiles_role_country on public.profiles(role, country);

-- Infos supplémentaires spécifiques aux vendeurs (1-1 avec profiles quand role = 'seller')
create table public.sellers (
  id uuid primary key references public.profiles(id) on delete cascade,
  rating numeric(2,1) not null default 0,
  total_transactions integer not null default 0,
  fulfillment_rate integer not null default 0,
  response_rate integer not null default 0,
  return_rate integer not null default 0,
  badge text not null default 'New Seller'
    check (badge in ('New Seller', 'Rapid Seller', 'Verified Seller', 'Premium Seller', 'Top Seller')),
  is_verified boolean not null default false,
  brands text[] not null default '{}',
  categories text[] not null default '{}',
  specialties text[] not null default '{}',
  condition_types text[] not null default '{}' check (condition_types <@ array['Nouveau', 'Ancien']::text[]),
  stock_level text check (stock_level is null or stock_level in ('Grand', 'Moyen', 'Petit')),
  payment_methods text[] not null default '{}' check (payment_methods <@ array['Cash', 'Mobile', 'Banque']::text[]),
  delivery_available boolean not null default false,
  opening_hours text,
  note text,
  join_date timestamptz not null default now()
);

-- ============================================================
-- 2. Véhicules enregistrés par un acheteur
-- ============================================================
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  brand text not null,
  model text not null,
  year integer not null,
  engine text,
  vin text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 3. Demandes de pièces (RFQ)
-- ============================================================
create table public.part_requests (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_brand text not null,
  vehicle_model text not null,
  vehicle_year integer not null,
  vehicle_engine text,
  vehicle_vin text,
  vehicle_cylinders integer,
  part_name text not null,
  oem_reference text,
  photo_url text,
  description text,
  quantity integer not null default 1,
  quality text check (quality in ('OEM', 'Genuine', 'Premium Aftermarket', 'Standard Aftermarket', 'Used', 'Reconditioned')),
  fuel text check (fuel is null or fuel in ('Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL')),
  condition text check (condition is null or condition in ('Nouveau', 'Ancien')),
  note text,
  part_position text,
  location text not null,
  budget_indicative numeric,
  status text not null default 'open' check (status in ('draft', 'open', 'matched', 'ordered', 'completed', 'expired')),
  responses_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 4. Offres soumises par les vendeurs sur une demande
-- ============================================================
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.part_requests(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  part_name text not null,
  quality text not null check (quality in ('OEM', 'Genuine', 'Premium Aftermarket', 'Standard Aftermarket', 'Used', 'Reconditioned')),
  price numeric not null,
  currency text not null default 'FCFA',
  availability text not null check (availability in ('immediate', '24h', '48h', '3-5days', '7-10days', 'import')),
  delivery_type text not null check (delivery_type in (
    'RAPID_NOW', 'RAPID_CITY', 'RAPID_NIGERIA', 'RAPID_USA',
    'RAPID_CHINA', 'RAPID_DUBAI', 'RAPID_TURKEY', 'RAPID_FRANCE', 'RAPID_GERMANY', 'RAPID_ENGLAND'
  )),
  delivery_time text,
  warranty text,
  notes text,
  seller_name text not null default '',
  seller_badge text not null default 'New Seller',
  seller_score numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'countered', 'accepted', 'rejected')),
  round integer not null default 1,
  last_actor text not null default 'seller' check (last_actor in ('buyer', 'seller')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. Commandes (une offre acceptée)
-- ============================================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.part_requests(id),
  offer_id uuid not null references public.offers(id),
  buyer_id uuid not null references public.profiles(id),
  seller_id uuid not null references public.profiles(id),
  part_name text not null,
  seller_name text not null default '',
  vehicle_brand text not null,
  vehicle_model text not null,
  vehicle_year integer not null,
  price numeric not null,
  delivery_type text not null check (delivery_type in (
    'RAPID_NOW', 'RAPID_CITY', 'RAPID_NIGERIA', 'RAPID_USA',
    'RAPID_CHINA', 'RAPID_DUBAI', 'RAPID_TURKEY', 'RAPID_FRANCE', 'RAPID_GERMANY', 'RAPID_ENGLAND'
  )),
  status text not null default 'confirmed'
    check (status in ('pending', 'confirmed', 'shipped', 'in_transit', 'delivered', 'completed', 'cancelled')),
  escrow_status text not null default 'held' check (escrow_status in ('held', 'released', 'refunded')),
  created_at timestamptz not null default now(),
  estimated_delivery timestamptz
);

-- ============================================================
-- Index utiles
-- ============================================================
create index idx_offers_request_id on public.offers(request_id);
create index idx_part_requests_status on public.part_requests(status);
create index idx_orders_buyer_id on public.orders(buyer_id);
create index idx_orders_seller_id on public.orders(seller_id);
create index idx_vehicles_buyer_id on public.vehicles(buyer_id);

-- ============================================================
-- Storage : photos jointes aux demandes de pièces
-- ============================================================
insert into storage.buckets (id, name, public)
values ('request-photos', 'request-photos', true)
on conflict (id) do nothing;

create policy "request-photos: lecture publique"
on storage.objects for select
using (bucket_id = 'request-photos');

create policy "request-photos: upload par utilisateur connecté"
on storage.objects for insert
to authenticated
with check (bucket_id = 'request-photos');

-- ============================================================
-- Row Level Security — chacun ne voit/modifie que ce qui le concerne
-- ============================================================
alter table public.profiles enable row level security;
alter table public.sellers enable row level security;
alter table public.vehicles enable row level security;
alter table public.part_requests enable row level security;
alter table public.offers enable row level security;
alter table public.orders enable row level security;

-- Fonction utilitaire : le rôle du profil connecté
create or replace function public.current_role()
returns text language sql stable security definer as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Fonction utilitaire (security definer) : évite une récursion infinie entre les
-- policies de part_requests et d'offers (chacune interrogeant l'autre table).
create or replace function public.seller_offered_on_request(p_request_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.offers where request_id = p_request_id and seller_id = auth.uid())
$$;

-- profiles : chacun voit son propre profil ; les vendeurs sont visibles publiquement (nom/badge affichés)
create policy "profiles: self read/write" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles: sellers publicly readable" on public.profiles
  for select using (role = 'seller');
create policy "profiles: admin full access" on public.profiles
  for all using (public.current_role() = 'admin');

-- sellers : lecture publique (comparaison d'offres), écriture par le vendeur concerné
create policy "sellers: public read" on public.sellers for select using (true);
create policy "sellers: self write" on public.sellers
  for all using (id = auth.uid()) with check (id = auth.uid());
create policy "sellers: admin full access" on public.sellers
  for all using (public.current_role() = 'admin');

-- vehicles : uniquement le propriétaire
create policy "vehicles: owner only" on public.vehicles
  for all using (buyer_id = auth.uid()) with check (buyer_id = auth.uid());

-- part_requests : l'acheteur voit/gère les siennes ; les vendeurs voient les demandes ouvertes ; admin voit tout
create policy "requests: buyer owns" on public.part_requests
  for all using (buyer_id = auth.uid()) with check (buyer_id = auth.uid());
create policy "requests: sellers see open" on public.part_requests
  for select using (
    status = 'open' and created_at > now() - interval '24 hours' and public.current_role() = 'seller'
  );
create policy "requests: seller with existing offer can read" on public.part_requests
  for select using (public.seller_offered_on_request(id));
create policy "requests: admin full access" on public.part_requests
  for all using (public.current_role() = 'admin');

-- offers : le vendeur gère ses offres ; l'acheteur de la demande liée peut les lire et
-- modifier le statut (accepter/contre-offrir/refuser, cahier §9) ; admin voit tout
create policy "offers: seller owns" on public.offers
  for all using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "offers: buyer of related request can read" on public.offers
  for select using (
    exists (select 1 from public.part_requests r where r.id = request_id and r.buyer_id = auth.uid())
  );
create policy "offers: buyer of related request can update" on public.offers
  for update using (
    exists (select 1 from public.part_requests r where r.id = request_id and r.buyer_id = auth.uid())
  );
create policy "offers: admin full access" on public.offers
  for all using (public.current_role() = 'admin');

-- orders : acheteur et vendeur concernés peuvent lire ; seul l'admin modifie l'escrow ; création via l'acheteur
create policy "orders: buyer read own" on public.orders
  for select using (buyer_id = auth.uid());
create policy "orders: seller read own" on public.orders
  for select using (seller_id = auth.uid());
create policy "orders: buyer create" on public.orders
  for insert with check (buyer_id = auth.uid());
create policy "orders: admin full access" on public.orders
  for all using (public.current_role() = 'admin');

-- ============================================================
-- Auto-création du profil à l'inscription (déclenché par Supabase Auth)
-- Le rôle/nom/téléphone/pays/adresse/etc. sont passés via `options.data`
-- lors du signUp() côté app (voir src/lib/auth.tsx).
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, role, name, phone, phone_secondary, location, country, address, email, buyer_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'buyer'),
    coalesce(new.raw_user_meta_data->>'name', 'Utilisateur'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'phoneSecondary',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'address',
    new.email,
    new.raw_user_meta_data->>'buyerType'
  );

  if coalesce(new.raw_user_meta_data->>'role', 'buyer') = 'seller' then
    insert into public.sellers (
      id, brands, categories, condition_types, stock_level,
      payment_methods, delivery_available, opening_hours, note
    ) values (
      new.id,
      coalesce((select array_agg(v) from jsonb_array_elements_text(new.raw_user_meta_data->'brands') v), '{}'),
      coalesce((select array_agg(v) from jsonb_array_elements_text(new.raw_user_meta_data->'categories') v), '{}'),
      coalesce((select array_agg(v) from jsonb_array_elements_text(new.raw_user_meta_data->'conditionTypes') v), '{}'),
      new.raw_user_meta_data->>'stockLevel',
      coalesce((select array_agg(v) from jsonb_array_elements_text(new.raw_user_meta_data->'paymentMethods') v), '{}'),
      coalesce((new.raw_user_meta_data->>'deliveryAvailable')::boolean, false),
      new.raw_user_meta_data->>'openingHours',
      new.raw_user_meta_data->>'note'
    );
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Fonction publique (callable avant connexion) : retrouve l'email technique
-- associé à un numéro de téléphone, pour permettre la connexion par téléphone.
-- SECURITY DEFINER : contourne volontairement la RLS de profiles, mais ne
-- renvoie qu'un email, jamais le reste du profil.
create or replace function public.email_for_phone(p_phone text)
returns text language sql security definer set search_path = public as $$
  select email from public.profiles where phone = p_phone limit 1;
$$;

grant execute on function public.email_for_phone(text) to anon, authenticated;
