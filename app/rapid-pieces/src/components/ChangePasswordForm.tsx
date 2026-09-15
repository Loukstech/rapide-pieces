'use client';

import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { updatePassword } from '@/lib/auth';
import { useToast } from '@/components/Toast';

// Cahier V2 - Point 21 : changement de mot de passe, réutilisable dans
// n'importe quel espace utilisateur (acheteur, vendeur).
export default function ChangePasswordForm() {
  const { showToast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (newPassword.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    if (newPassword !== confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return; }
    setSubmitting(true);
    const result = await updatePassword(newPassword);
    setSubmitting(false);
    if (result.success) {
      showToast('Mot de passe mis à jour avec succès.', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(result.error ?? 'La mise à jour a échoué, réessayez.');
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"><KeyRound className="h-4 w-4" /> Changer le mot de passe</div>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
      />
      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
      />
      {error && <p className="text-[11px] text-red-500">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={submitting || !newPassword || !confirmPassword}
        className="w-full py-2.5 bg-red-600 text-white rounded-lg text-xs font-semibold disabled:opacity-40"
      >
        {submitting ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
      </button>
    </section>
  );
}
