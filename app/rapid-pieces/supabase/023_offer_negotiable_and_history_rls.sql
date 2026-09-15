-- Cahier V2 - Point 32 : le vendeur choisit, offre par offre, si elle est
-- ouverte à la négociation ou à prix ferme.
alter table public.offers
  add column if not exists negotiable boolean not null default true;

-- Bug trouvé en testant une contre-offre : "new row violates row-level
-- security policy for table offer_negotiation_history". La table (migration
-- 018) n'a aucune policy insert, et son trigger d'écriture
-- (fn_log_offer_negotiation) n'est pas security definer — il s'exécute donc
-- avec les droits de l'utilisateur (acheteur ou vendeur) qui vient de changer
-- le prix de l'offre, et cette écriture est bloquée par RLS. Résultat : toute
-- contre-offre échouait.
alter table public.offer_negotiation_history enable row level security;

create policy "negotiation history: buyer of related request can read"
  on public.offer_negotiation_history for select
  using (
    exists (
      select 1 from public.offers o
      join public.part_requests r on r.id = o.request_id
      where o.id = offer_id and (r.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

create or replace function public.fn_log_offer_negotiation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (old.price <> new.price) then
    insert into public.offer_negotiation_history (offer_id, price, actor, note)
    values (new.id, new.price, new.last_actor, 'Changement de prix lors de la négociation');
  end if;
  return new;
end;
$$;
