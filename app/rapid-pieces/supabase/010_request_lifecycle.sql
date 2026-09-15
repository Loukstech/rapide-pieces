-- Cahier des modifications, section 10 : cycle de vie des demandes.
-- 1. Réinitialisation : une demande active (status='open') sans offre acceptée
--    depuis 24h expire automatiquement (status='expired') et n'est plus
--    proposée aux vendeurs — elle reste consultable dans l'historique de
--    l'acheteur.
-- 2. Historique conservé 3 mois max : au-delà, les anciennes demandes ne sont
--    plus remontées dans les listes (mais pas supprimées physiquement — une
--    suppression définitive de données transactionnelles est un choix trop
--    lourd/irréversible pour être fait sans confirmation explicite du client).

alter table public.part_requests drop constraint if exists part_requests_status_check;
alter table public.part_requests add constraint part_requests_status_check
  check (status in ('draft', 'open', 'matched', 'ordered', 'completed', 'expired'));

-- Défense en profondeur : même si le "balayage" applicatif (expireStaleRequests)
-- n'a pas encore tourné, un vendeur ne doit jamais voir une demande ouverte
-- depuis plus de 24h.
drop policy if exists "requests: sellers see open" on public.part_requests;
create policy "requests: sellers see open" on public.part_requests
  for select using (
    status = 'open'
    and created_at > now() - interval '24 hours'
    and public.current_role() = 'seller'
  );
