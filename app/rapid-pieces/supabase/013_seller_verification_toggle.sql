-- Rend la vérification vendeur (écran "En attente de validation" dans
-- seller/layout.tsx) optionnelle, pilotée par un réglage admin plutôt que
-- toujours active — désactivée par défaut pour la période de test.

insert into public.admin_settings (key, value, description, category)
values (
  'seller_verification_required',
  'false',
  'Bloquer l''accès au tableau de bord vendeur tant qu''un admin n''a pas validé le compte',
  'trust'
)
on conflict (key) do nothing;
