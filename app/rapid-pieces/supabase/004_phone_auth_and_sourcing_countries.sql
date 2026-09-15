-- ============================================================
-- 1. Téléphone obligatoire / email optionnel à l'inscription
-- ============================================================

-- On garde une copie de l'email (réel ou technique) dans profiles pour pouvoir
-- retrouver un compte à partir du seul numéro de téléphone (avant connexion,
-- donc sans pouvoir s'appuyer sur la RLS habituelle).
alter table public.profiles add column if not exists email text;

-- Backfill des comptes déjà créés (dont les comptes de démo) avant l'ajout de la colonne.
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, role, name, phone, location, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'buyer'),
    coalesce(new.raw_user_meta_data->>'name', 'Utilisateur'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'location',
    new.email
  );

  if coalesce(new.raw_user_meta_data->>'role', 'buyer') = 'seller' then
    insert into public.sellers (id) values (new.id);
  end if;

  return new;
end;
$$;

-- Fonction publique (callable avant connexion) : retrouve l'email technique
-- associé à un numéro de téléphone, pour permettre la connexion par téléphone.
-- SECURITY DEFINER : contourne volontairement la RLS de profiles, mais ne
-- renvoie qu'un email, jamais le reste du profil.
create or replace function public.email_for_phone(p_phone text)
returns text language sql security definer set search_path = public as $$
  select email from public.profiles where phone = p_phone limit 1;
$$;

grant execute on function public.email_for_phone(text) to anon, authenticated;

-- ============================================================
-- 2. Nouveaux pays de sourcing (hors Afrique) — document + brochure Rapid Pièces
-- ============================================================

alter table public.offers drop constraint if exists offers_delivery_type_check;
alter table public.offers add constraint offers_delivery_type_check
  check (delivery_type in (
    'RAPID_NOW', 'RAPID_CITY', 'RAPID_NIGERIA', 'RAPID_USA',
    'RAPID_CHINA', 'RAPID_DUBAI', 'RAPID_TURKEY', 'RAPID_FRANCE', 'RAPID_GERMANY', 'RAPID_ENGLAND'
  ));

alter table public.orders drop constraint if exists orders_delivery_type_check;
alter table public.orders add constraint orders_delivery_type_check
  check (delivery_type in (
    'RAPID_NOW', 'RAPID_CITY', 'RAPID_NIGERIA', 'RAPID_USA',
    'RAPID_CHINA', 'RAPID_DUBAI', 'RAPID_TURKEY', 'RAPID_FRANCE', 'RAPID_GERMANY', 'RAPID_ENGLAND'
  ));
