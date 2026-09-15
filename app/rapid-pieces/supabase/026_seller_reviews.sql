-- Cahier V2 - Points 11/12/13/41 : système de notation vendeur — plusieurs
-- règles du cahier (rating qui démarre à 5 et diminue selon le comportement,
-- sanctions à 3/2 étoiles) supposent un vrai mécanisme d'évaluation, qui
-- n'existait pas du tout : le bouton "Évaluer" (orders/page.tsx) n'avait
-- aucun onClick, et rien n'écrivait jamais dans sellers.rating.

create table if not exists public.seller_reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  seller_id uuid not null references public.sellers(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists idx_seller_reviews_seller on public.seller_reviews(seller_id);

alter table public.seller_reviews enable row level security;

-- Lecture publique : la note moyenne d'un vendeur est déjà visible partout
-- (sellers.rating, lecture publique) ; les avis individuels le sont aussi.
create policy "seller reviews: public read"
  on public.seller_reviews for select
  using (true);

-- Un acheteur ne peut noter que sa PROPRE commande, et seulement une fois
-- qu'elle est livrée/terminée (pas en attente de paiement ou d'expédition).
create policy "seller reviews: buyer reviews own delivered order"
  on public.seller_reviews for insert
  with check (
    buyer_id = auth.uid()
    and exists (
      select 1 from public.orders o
      where o.id = order_id
        and o.buyer_id = auth.uid()
        and o.seller_id = seller_reviews.seller_id
        and o.status in ('delivered', 'completed')
    )
  );

-- Recalcule sellers.rating (moyenne réelle de tous les avis) à chaque
-- nouvel avis. Security definer : un acheteur n'a normalement pas le droit
-- de modifier la ligne `sellers` d'un vendeur (RLS "sellers: self write").
create or replace function public.fn_recompute_seller_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.sellers
  set rating = (
    select round(avg(rating)::numeric, 1)
    from public.seller_reviews
    where seller_id = new.seller_id
  )
  where id = new.seller_id;
  return new;
end;
$$;

drop trigger if exists tr_recompute_seller_rating on public.seller_reviews;
create trigger tr_recompute_seller_rating
  after insert on public.seller_reviews
  for each row execute function public.fn_recompute_seller_rating();
