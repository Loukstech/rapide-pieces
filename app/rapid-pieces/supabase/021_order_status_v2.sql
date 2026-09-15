-- Cahier V2 - Point 51 : cycle de statut complet d'une commande
-- (Paiement en cours → Payé → Livraison en cours → Livré).
--
-- Bug trouvé en vérifiant l'implémentation : le type front OrderStatus a été
-- renommé ('confirmed'/'shipped'/'in_transit' → 'payment_pending'/'paid'/
-- 'shipping'), mais la contrainte CHECK de `orders.status` et l'insertion dans
-- addOrder() utilisaient encore les anciennes valeurs — chaque commande créée
-- avait donc un statut ('confirmed') qui ne correspond à AUCUNE clé des
-- Record<OrderStatus,...> côté front (orders/page.tsx, seller/orders/page.tsx,
-- admin/orders/page.tsx), cassant l'affichage du statut pour toutes les
-- commandes existantes et futures.

-- Ordre correct : retirer d'abord l'ANCIENNE contrainte (sinon les nouvelles
-- valeurs comme 'paid'/'shipping' la violent pendant le backfill), backfiller
-- ensuite sans contrainte active, puis appliquer la NOUVELLE contrainte une
-- fois toutes les lignes déjà conformes.
alter table public.orders drop constraint if exists orders_status_check;

update public.orders set status = 'paid' where status = 'confirmed';
update public.orders set status = 'shipping' where status in ('shipped', 'in_transit');
update public.orders set status = 'payment_pending' where status = 'pending';

alter table public.orders add constraint orders_status_check
  check (status in ('payment_pending', 'paid', 'shipping', 'delivered', 'completed', 'cancelled'));
