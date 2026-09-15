import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomInt } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

// Cahier V2 - Point 15 : envoie un code OTP par SMS (Infobip) au numéro
// fourni à l'inscription. Route serveur : la clé Infobip et la clé
// service_role Supabase ne quittent jamais le serveur.

const OTP_TTL_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 30;

function normalizePhone(phone: string): string {
  // Format Infobip attendu : chiffres uniquement, sans "+", sans espaces.
  return phone.replace(/[^0-9]/g, '');
}

export async function POST(req: NextRequest) {
  // Bug trouvé : une exception non rattrapée ici (ex. SUPABASE_SERVICE_ROLE_KEY
  // absente au runtime) faisait planter la fonction avant qu'elle ne puisse
  // répondre en JSON — Vercel renvoyait un 500 brut sans corps, et le client
  // affichait alors un message d'erreur générique impossible à diagnostiquer.
  try {
    return await handleSend(req);
  } catch (err) {
    console.error('otp/send crashed', err);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur SMS.' }, { status: 500 });
  }
}

async function handleSend(req: NextRequest) {
  const { phone } = await req.json();
  if (!phone || typeof phone !== 'string') {
    return NextResponse.json({ success: false, error: 'Numéro de téléphone requis.' }, { status: 400 });
  }

  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone.length < 8) {
    return NextResponse.json({ success: false, error: 'Numéro de téléphone invalide.' }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY manquante côté serveur');
    return NextResponse.json({ success: false, error: 'Configuration serveur incomplète (service_role).' }, { status: 500 });
  }

  const supabase = createAdminClient();

  // Anti-spam : pas de renvoi avant la fin du cooldown.
  const { data: recent } = await supabase
    .from('phone_otps')
    .select('created_at')
    .eq('phone', normalizedPhone)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (recent && Date.now() - new Date(recent.created_at).getTime() < RESEND_COOLDOWN_SECONDS * 1000) {
    return NextResponse.json({ success: false, error: 'Veuillez patienter avant de redemander un code.' }, { status: 429 });
  }

  const code = randomInt(100000, 999999).toString();
  const codeHash = createHash('sha256').update(code).digest('hex');
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

  const { error: insertError } = await supabase
    .from('phone_otps')
    .insert({ phone: normalizedPhone, code_hash: codeHash, expires_at: expiresAt });
  if (insertError) {
    console.error('phone_otps insert failed', insertError);
    return NextResponse.json({ success: false, error: "Erreur d'envoi, réessayez." }, { status: 500 });
  }

  const infobipKey = process.env.INFOBIP_API_KEY;
  const infobipBase = process.env.INFOBIP_BASE_URL;
  if (!infobipKey || !infobipBase) {
    console.error('Infobip non configuré (INFOBIP_API_KEY/INFOBIP_BASE_URL manquants)');
    return NextResponse.json({ success: false, error: "Service SMS indisponible pour l'instant." }, { status: 500 });
  }

  try {
    const infobipRes = await fetch(`${infobipBase}/sms/2/text/advanced`, {
      method: 'POST',
      headers: {
        Authorization: `App ${infobipKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            destinations: [{ to: normalizedPhone }],
            text: `Rapid Pièces : votre code de vérification est ${code}. Il expire dans ${OTP_TTL_MINUTES} minutes.`,
          },
        ],
      }),
    });
    if (!infobipRes.ok) {
      const body = await infobipRes.text();
      console.error('Infobip send failed', infobipRes.status, body);
      return NextResponse.json({ success: false, error: "L'envoi du SMS a échoué, réessayez." }, { status: 502 });
    }
  } catch (err) {
    console.error('Infobip request error', err);
    return NextResponse.json({ success: false, error: "L'envoi du SMS a échoué, réessayez." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
