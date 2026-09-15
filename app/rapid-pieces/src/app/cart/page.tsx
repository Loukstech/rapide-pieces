'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Send, Trash2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useRequestDrafts, publishRequestDraft, deleteRequest } from '@/lib/store';
import { requestTitleLine, requestSubtitleLine } from '@/lib/types';

// Cahier section 8 : panier acheteur — demandes préparées mais pas encore envoyées.
export default function CartPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { data: drafts, refetch } = useRequestDrafts(isLoading ? undefined : user?.id);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'buyer')) router.replace('/login');
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" /></div>;

  const handleSend = async (id: string) => {
    setBusyId(id);
    await publishRequestDraft(id);
    await refetch();
    setBusyId(null);
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    await deleteRequest(id);
    await refetch();
    setBusyId(null);
  };

  return (
    <div className="min-h-screen bg-rp-bg pb-24">
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white flex-1">Panier</h1>
          <span className="w-6 h-6 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{drafts.length}</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {drafts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-gray-400 dark:text-slate-500 mb-4">Votre panier est vide.</p>
            <Link href="/requests/new" className="inline-block px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold">Préparer une demande</Link>
          </div>
        )}
        {drafts.map((req) => (
          <div key={req.id} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              {req.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={req.photo} alt={req.partName} className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-slate-600" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{requestTitleLine(req)}</h3>
                {requestSubtitleLine(req) && <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{requestSubtitleLine(req)}</p>}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleSend(req.id)} disabled={busyId === req.id}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50">
                <Send className="w-3.5 h-3.5" /> Envoyer la demande
              </button>
              <button onClick={() => handleDelete(req.id)} disabled={busyId === req.id}
                className="px-3 py-2 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-lg text-xs font-semibold disabled:opacity-50">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
