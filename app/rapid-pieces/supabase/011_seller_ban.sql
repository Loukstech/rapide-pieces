-- ============================================================
-- Ban vendeur (admin) : bloque ses futures offres, pas retroactif
-- ============================================================

alter table public.sellers add column if not exists is_banned boolean not null default false;
