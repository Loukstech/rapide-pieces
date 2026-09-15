-- Cahier des modifications, section 8 : espace acheteur.
-- 1. Type de compte acheteur (particulier / mécanicien / garage / entreprise) —
--    seuls les particuliers peuvent enregistrer des véhicules.
-- 2. Panier : demandes préparées mais pas encore envoyées. Réutilise
--    part_requests avec un statut 'draft' (invisible des vendeurs, qui ne
--    voient que status='open' — cf. policy "requests: sellers see open").

alter table public.profiles add column if not exists buyer_type text
  check (buyer_type is null or buyer_type in ('individual', 'mechanic', 'garage', 'business'));

alter table public.part_requests drop constraint if exists part_requests_status_check;
alter table public.part_requests add constraint part_requests_status_check
  check (status in ('draft', 'open', 'matched', 'ordered', 'completed'));

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
