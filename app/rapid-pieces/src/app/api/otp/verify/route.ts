import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

const MAX_ATTEMPTS = 5;

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export async function POST(req: NextRequest) {
  try {
    return await handleVerify(req);
  } catch (err) {
    console.error('otp/verify crashed', err);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur SMS.' }, { status: 500 });
  }
}

async function handleVerify(req: NextRequest) {
  const { phone, code } = await req.json();
  if (!phone || !code) {
    return NextResponse.json({ success: false, error: 'Numéro et code requis.' }, { status: 400 });
  }

  const normalizedPhone = normalizePhone(phone);
  const supabase = createAdminClient();

  const { data: otp, error } = await supabase
    .from('phone_otps')
    .select('*')
    .eq('phone', normalizedPhone)
    .eq('verified', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !otp) {
    return NextResponse.json({ success: false, error: "Aucun code en attente pour ce numéro, redemandez-en un." }, { status: 400 });
  }

  if (new Date(otp.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ success: false, error: 'Ce code a expiré, redemandez-en un.' }, { status: 400 });
  }

  if (otp.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json({ success: false, error: 'Trop de tentatives, redemandez un nouveau code.' }, { status: 429 });
  }

  const codeHash = createHash('sha256').update(String(code)).digest('hex');
  if (codeHash !== otp.code_hash) {
    await supabase.from('phone_otps').update({ attempts: otp.attempts + 1 }).eq('id', otp.id);
    return NextResponse.json({ success: false, error: 'Code incorrect.' }, { status: 400 });
  }

  await supabase.from('phone_otps').update({ verified: true }).eq('id', otp.id);
  return NextResponse.json({ success: true });
}
