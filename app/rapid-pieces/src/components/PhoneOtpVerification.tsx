'use client';

import { useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

// Cahier V2 - Point 15 : vérification du numéro de téléphone par OTP (SMS via
// Infobip, envoyé depuis une route API serveur — jamais de clé côté client).
export default function PhoneOtpVerification({
  phone,
  verified,
  onVerified,
}: {
  phone: string;
  verified: boolean;
  onVerified: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setError(null);
    setSending(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.error ?? "L'envoi a échoué, réessayez.");
      }
    } catch {
      setError("L'envoi a échoué, réessayez.");
    }
    setSending(false);
  };

  const handleVerify = async () => {
    setError(null);
    setVerifying(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (data.success) {
        onVerified();
      } else {
        setError(data.error ?? 'Code incorrect.');
      }
    } catch {
      setError('La vérification a échoué, réessayez.');
    }
    setVerifying(false);
  };

  if (verified) {
    return (
      <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
        <CheckCircle2 className="w-4 h-4" /> Numéro vérifié
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300">
        <ShieldCheck className="w-3.5 h-3.5" /> Vérification du numéro
      </div>
      {!sent ? (
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !phone || phone.replace(/[^0-9]/g, '').length < 8}
          className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold disabled:opacity-40"
        >
          {sending ? 'Envoi...' : 'Envoyer le code par SMS'}
        </button>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Code à 6 chiffres"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying || code.length < 4}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold disabled:opacity-40"
            >
              {verifying ? '...' : 'Vérifier'}
            </button>
          </div>
          <button type="button" onClick={handleSend} disabled={sending} className="text-[11px] text-blue-600 underline">
            Renvoyer le code
          </button>
        </>
      )}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
