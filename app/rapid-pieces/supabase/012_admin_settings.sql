-- ============================================================
-- 012_admin_settings.sql — Table de configuration admin
-- ============================================================
-- Cette table permet de stocker les paramètres de configuration de la plateforme
-- qui peuvent être modifiés via l'interface admin.
-- Idempotent : peut être rejoué sans erreur si déjà exécuté partiellement.
--
-- IMPORTANT: Certains paramètres sont ACTIFS, d'autres sont PLACEHOLDERS
--
-- PARAMÈTRES ACTIFS (implémentés et utilisés dans le code):
-- - commission_rate: Utilisé pour calculer les commissions
-- - sourcing_fee: Utilisé pour calculer les frais de sourcing
-- - escrow_enabled: Active/désactive le système d'escrow dans addOrder()
-- - rapid_now_enabled: Filtre l'option RAPID PIECES dans le formulaire vendeur
-- - rapid_city_enabled: Filtre l'option RAPID CITY dans le formulaire vendeur
-- - rapid_nigeria_enabled: Filtre l'option RAPID NIGERIA dans le formulaire vendeur
-- - rapid_usa_enabled: Filtre l'option RAPID USA dans le formulaire vendeur
--
-- PARAMÈTRES PLACEHOLDERS (non implémentés, documentation future):
-- - rapid_protection_enabled: Garantie et retour (à implémenter)
-- - kyc_required: Vérification identité obligatoire (à implémenter)
-- - fraud_detection_enabled: Détection de fraude (à implémenter)
-- - notification_enabled: Alertes push en temps réel (à implémenter)
-- ============================================================

create table if not exists public.admin_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null,
  description text,
  category text not null default 'general',
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

-- Index pour la recherche par catégorie
create index if not exists idx_admin_settings_category on public.admin_settings(category);

-- Insertion des valeurs par défaut (ne recrée pas les lignes déjà présentes)
insert into public.admin_settings (key, value, description, category) values
  ('commission_rate', '5-7', 'Taux de commission par catégorie', 'commission'),
  ('sourcing_fee', '5-15', 'Frais de sourcing international', 'commission'),
  ('escrow_enabled', 'true', 'Paiement sécurisé via escrow', 'payment'),
  ('rapid_now_enabled', 'true', 'Livraison locale express activée', 'delivery'),
  ('rapid_city_enabled', 'true', 'Livraison intra-ville activée', 'delivery'),
  ('rapid_nigeria_enabled', 'true', 'Sourcing Nigeria activé', 'delivery'),
  ('rapid_usa_enabled', 'true', 'Sourcing USA activé', 'delivery'),
  ('rapid_protection_enabled', 'true', 'Garantie et retour activés', 'trust'),
  ('kyc_required', 'true', 'Vérification identité obligatoire', 'trust'),
  ('fraud_detection_enabled', 'true', 'Détection de fraude activée', 'trust'),
  ('notification_enabled', 'true', 'Alertes push en temps réel', 'system')
on conflict (key) do nothing;

-- RLS Policies
alter table public.admin_settings enable row level security;

-- Les admins peuvent tout lire et modifier
drop policy if exists "Admins can view all settings" on public.admin_settings;
create policy "Admins can view all settings" on public.admin_settings
  for select using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

drop policy if exists "Admins can update settings" on public.admin_settings;
create policy "Admins can update settings" on public.admin_settings
  for update using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

drop policy if exists "Admins can insert settings" on public.admin_settings;
create policy "Admins can insert settings" on public.admin_settings
  for insert with check (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));
