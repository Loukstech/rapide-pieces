-- Cahier V2 - Point 38 : numéro de réception des paiements du vendeur —
-- obligatoire, visible uniquement par le vendeur lui-même et l'admin, jamais
-- par un acheteur.
--
-- Bug trouvé : le formulaire d'inscription le collecte déjà, mais
-- handle_new_user() ne l'écrivait nulle part — il restait enfermé dans
-- auth.users.raw_user_meta_data, illisible via une requête normale.
--
-- Important : `sellers` a une policy "public read" (for select using (true))
-- pour que les acheteurs voient les fiches vendeur — la RLS est au niveau
-- ligne, pas colonne, donc ajouter payment_number directement sur `sellers`
-- l'aurait rendu récupérable par n'importe quel acheteur via l'API, quoi que
-- l'interface affiche. D'où une table séparée avec sa propre RLS restrictive.

create table if not exists public.seller_payment_info (
  seller_id uuid primary key references public.sellers(id) on delete cascade,
  payment_number text not null,
  updated_at timestamptz not null default now()
);

alter table public.seller_payment_info enable row level security;

create policy "seller payment info: seller reads own"
  on public.seller_payment_info for select
  using (seller_id = auth.uid());

create policy "seller payment info: seller updates own"
  on public.seller_payment_info for update
  using (seller_id = auth.uid());

create policy "seller payment info: admin full access"
  on public.seller_payment_info for all
  using (public.current_role() = 'admin');

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

    if new.raw_user_meta_data->>'paymentNumber' is not null then
      insert into public.seller_payment_info (seller_id, payment_number)
      values (new.id, new.raw_user_meta_data->>'paymentNumber');
    end if;
  end if;

  return new;
end;
$$;
