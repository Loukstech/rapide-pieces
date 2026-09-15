-- Bug trouvé en vérifiant pourquoi un acheteur ne voyait pas une offre reçue :
-- addOffer() (src/lib/store.ts) essaie d'incrémenter part_requests.responses_count
-- après avoir créé l'offre, via un simple update() exécuté avec la session du
-- vendeur. Mais la seule policy RLS d'update sur part_requests est "requests:
-- buyer owns" (buyer_id = auth.uid()) : un vendeur n'a donc jamais le droit
-- d'écrire sur cette ligne, l'update échoue silencieusement (l'erreur n'était
-- pas vérifiée) et responses_count reste bloqué à 0 pour toujours, même quand
-- des offres existent bel et bien sur la demande.
--
-- Impact réel : les offres sont bien créées et visibles par l'acheteur sur la
-- page /offers/[id] (celle-ci lit la table offers directement, pas
-- responses_count) — donc rien n'est perdu. Mais tous les badges/compteurs
-- basés sur responses_count sont faux : "Sans offre" reste affiché côté admin
-- et vendeur même quand une offre a été envoyée, et le filtre "Nouvelles"
-- (vendeur) ne se met jamais à jour.
--
-- Correction : une fonction security definer (même pattern que
-- seller_offered_on_request(), 009_fix_rls_recursion.sql) qui incrémente le
-- compteur avec les droits du propriétaire de la fonction plutôt que ceux du
-- vendeur appelant — évite d'ouvrir une policy d'update générale à tous les
-- vendeurs sur toute la table part_requests.

create or replace function public.increment_request_responses(p_request_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.part_requests
  set responses_count = responses_count + 1
  where id = p_request_id;
end;
$$;

grant execute on function public.increment_request_responses(uuid) to authenticated;
