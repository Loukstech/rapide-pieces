'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, MapPin, Clock, AlertTriangle, Eye, Users, ShoppingBag, BarChart3, ShieldCheck, Circle, CheckCircle2, Zap } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useRequests } from '@/lib/store';
import { requestTitleLine, requestSubtitleLine } from '@/lib/types';

export default function AdminRequestsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [filter, setFilter] = useState<'all' | 'open' | 'matched'>('all');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/login?role=admin');
  }, [user, isLoading, router]);

  const { data: all } = useRequests();

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  // Les brouillons (panier acheteur, cahier §8) ne sont pas encore de vraies demandes.
  const filtered = all.filter(r => r.status !== 'draft').filter(r => filter === 'all' || r.status === filter);

  return (
    <div className="min-h-screen bg-rp-bg">
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white flex-1">Demandes</h1>
          <span className="w-6 h-6 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{all.filter(r => r.status === 'open').length}</span>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          {[
            { key: 'all' as const, label: 'Toutes' },
            { key: 'open' as const, label: 'Ouvertes', icon: <Circle className="w-3 h-3" /> },
            { key: 'matched' as const, label: 'Correspondance', icon: <CheckCircle2 className="w-3 h-3" /> },
          ].map((f: { key: 'all' | 'open' | 'matched'; label: string; icon?: ReactNode }) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                filter === f.key ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400 dark:text-slate-500 dark:text-slate-500 border border-gray-200'
              }`}>{f.icon}{f.label}</button>
          ))}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3 pb-24 lg:pb-6">
        {filtered.map(req => (
          <div key={req.id} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  req.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : req.status === 'expired' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                }`}>{req.status === 'open' ? 'Ouverte' : req.status === 'expired' ? 'Expirée' : 'Correspondance'}</span>
                {req.responsesCount === 0 && <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full">Sans offre</span>}
              </div>
              <span className="text-lg font-bold text-red-600">{req.responsesCount}</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{requestTitleLine(req)}</h3>
            {requestSubtitleLine(req) && <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{requestSubtitleLine(req)}</p>}
            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <Link href={`/admin/requests/${req.id}`} className="flex-1 py-2 bg-gray-100 text-gray-600 dark:text-slate-300 dark:text-slate-300 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-slate-600/50 transition-colors">
                <Eye className="w-3 h-3" /> Détails
              </Link>
              {req.status === 'open' && req.responsesCount === 0 && (
                <Link href="/admin/sellers" className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-emerald-700 transition-colors"><Zap className="w-3 h-3" /> Trouver des vendeurs</Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <BottomNav role="admin" />
    </div>
  );
}
