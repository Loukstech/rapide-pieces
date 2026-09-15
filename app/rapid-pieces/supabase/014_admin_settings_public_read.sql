-- Bug trouvé en testant le réglage seller_verification_required : admin_settings
-- n'était lisible que par les admins (policy "Admins can view all settings"),
-- donc un vendeur/acheteur ne pouvait jamais lire la valeur réelle d'un réglage
-- (isFeatureEnabled() retombait toujours sur false, quelle que soit la valeur
-- en base). Ça touchait aussi silencieusement useEnabledDeliveryOptions() —
-- ça "marchait" par coïncidence puisque son fallback (tout activé) correspond
-- à l'état par défaut des options de livraison.
--
-- Ces réglages ne sont pas sensibles (ce sont des feature flags de la
-- plateforme, pas des secrets) : tout le monde doit pouvoir les lire, seul un
-- admin doit pouvoir les modifier — les policies d'écriture restent inchangées.

drop policy if exists "Anyone can read settings" on public.admin_settings;
create policy "Anyone can read settings" on public.admin_settings
  for select using (true);
