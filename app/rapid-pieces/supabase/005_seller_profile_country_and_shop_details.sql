-- ============================================================
-- 1. Pays partagé acheteurs + vendeurs + coordonnées étendues (cahier section 1)
-- ============================================================

alter table public.profiles add column if not exists country text;
alter table public.profiles add column if not exists phone_secondary text;
alter table public.profiles add column if not exists address text;

create index if not exists idx_profiles_country on public.profiles(country);
create index if not exists idx_profiles_role_country on public.profiles(role, country);

-- Backfill best-effort pour les comptes existants dont `location` suit le format
-- "Ville, Pays" produit par le formulaire actuel (login/page.tsx: `${ville}, ${pays}`).
update public.profiles
set country = trim(split_part(location, ',', 2))
where country is null and location is not null and position(',' in location) > 0;

-- ============================================================
-- 2. Détails boutique vendeur (cahier section 4)
-- ============================================================

alter table public.sellers
  add column if not exists condition_types text[] not null default '{}',
  add column if not exists stock_level text,
  add column if not exists payment_methods text[] not null default '{}',
  add column if not exists delivery_available boolean not null default false,
  add column if not exists opening_hours text,
  add column if not exists note text;

alter table public.sellers drop constraint if exists sellers_condition_types_check;
alter table public.sellers add constraint sellers_condition_types_check
  check (condition_types <@ array['Nouveau', 'Ancien']::text[]);

alter table public.sellers drop constraint if exists sellers_stock_level_check;
alter table public.sellers add constraint sellers_stock_level_check
  check (stock_level is null or stock_level in ('Grand', 'Moyen', 'Petit'));

alter table public.sellers drop constraint if exists sellers_payment_methods_check;
alter table public.sellers add constraint sellers_payment_methods_check
  check (payment_methods <@ array['Cash', 'Mobile', 'Banque']::text[]);

-- ============================================================
-- 3. handle_new_user() : propage tous les nouveaux champs + corrige le bug
--    où brands/categories n'étaient jamais consommés par le trigger.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, role, name, phone, phone_secondary, location, country, address, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'buyer'),
    coalesce(new.raw_user_meta_data->>'name', 'Utilisateur'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'phoneSecondary',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'address',
    new.email
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
