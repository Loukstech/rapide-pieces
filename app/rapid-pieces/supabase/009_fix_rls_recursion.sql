-- Corrige une récursion infinie introduite par la migration 008 : la policy
-- "requests: seller with existing offer can read" (sur part_requests) interroge
-- offers, dont les policies interrogent part_requests en retour — Postgres boucle
-- indéfiniment. Solution standard : une fonction security definer qui contourne
-- la RLS d'offers pour cette vérification précise, cassant le cycle.

create or replace function public.seller_offered_on_request(p_request_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.offers where request_id = p_request_id and seller_id = auth.uid())
$$;

drop policy if exists "requests: seller with existing offer can read" on public.part_requests;
create policy "requests: seller with existing offer can read" on public.part_requests
  for select using (public.seller_offered_on_request(id));
