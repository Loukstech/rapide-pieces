-- Cahier V2 - Point 15 : vérification du numéro de téléphone par OTP à
-- l'inscription (SMS envoyé via Infobip). Table purement transitoire —
-- jamais accédée directement par le client, seulement via les routes API
-- serveur (app/api/otp/send, app/api/otp/verify) qui utilisent la clé
-- service_role. RLS activée sans aucune policy : verrouillée à double tour
-- côté client, ce qui est le comportement voulu ici.

create table if not exists public.phone_otps (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_phone_otps_phone on public.phone_otps(phone);

alter table public.phone_otps enable row level security;
-- Aucune policy : ni anon ni authenticated ne peuvent lire/écrire cette
-- table — seule la clé service_role (routes API serveur) y a accès.
