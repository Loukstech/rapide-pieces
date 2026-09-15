import { createClient } from '@supabase/supabase-js';

// Client service_role — SERVEUR UNIQUEMENT (routes API app/api/**/route.ts).
// Ne jamais importer ce fichier depuis un composant 'use client'.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
