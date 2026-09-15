'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Search, Star, Shield, Check, Ban, Eye, MapPin, Award, Users, ShoppingBag, Package, BarChart3, ShieldCheck, CheckCircle2, Timer, Flag } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { updateSellerBan, updateSellerVerification, useSellers } from '@/lib/store';

export default function AdminSellersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'flagged'>('all');
  const [country, setCountry] = useState<string>('all');

  const { data: sellers, refetch: refetchSellers } = useSellers();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/login?role=admin');
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  // Cahier section 1 : permettre à l'admin de filtrer/classer les vendeurs par pays.
  const countries = Array.from(new Set(sellers.map(s => s.country).filter((c): c is string => !!c))).sort();

  const filtered = sellers.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'verified' && s.isVerified) || (filter === 'pending' && !s.isVerified) || (filter === 'flagged' && s.returnRate > 4);
    const matchCountry = country === 'all' || s.country === country;
    return matchSearch && matchFilter && matchCountry;
  });

  return (
    <div className="min-h-screen bg-rp-bg">
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white flex-1">Gestion des vendeurs</h1>
          <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{filtered.length} vendeurs</span>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 dark:text-slate-500" />
              <input type="text" placeholder="Rechercher un vendeur..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <select value={country} onChange={(e) => setCountry(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="all">Tous pays</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all' as const, label: 'Tous' },
              { key: 'verified' as const, label: 'Vérifiés', icon: <CheckCircle2 className="w-3 h-3" /> },
              { key: 'pending' as const, label: 'En attente', icon: <Timer className="w-3 h-3" /> },
              { key: 'flagged' as const, label: 'Signalés', icon: <Flag className="w-3 h-3" /> },
            ].map((f: { key: 'all' | 'verified' | 'pending' | 'flagged'; label: string; icon?: ReactNode }) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                  filter === f.key ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400 dark:text-slate-500 dark:text-slate-500 border border-gray-200'
                }`}>{f.icon}{f.label}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3 pb-24 lg:pb-6">
        {filtered.map(seller => (
          <div key={seller.id} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-gray-900 dark:text-white font-bold flex-shrink-0">
                {seller.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{seller.name}</h3>
                  {seller.isVerified && <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                  {seller.isBanned && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-red-500/10 text-red-500 border border-red-500/30 flex-shrink-0">Banni</span>
                  )}
                  {!seller.isBanned && seller.hasWarning && seller.warningSeverity === 'critical' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-red-500/10 text-red-600 border border-red-500/30 flex-shrink-0 animate-pulse">🚨 Suspension à valider</span>
                  )}
                  {!seller.isBanned && seller.hasWarning && seller.warningSeverity !== 'critical' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-600 border border-amber-500/30 flex-shrink-0">⚠ Avertissement</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {seller.location}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-[10px]"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {seller.rating}</span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{seller.totalTransactions} ventes</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                    seller.badge === 'Top Seller' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                    seller.badge === 'Premium Seller' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                    'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  }`}>{seller.badge}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {[
                { label: 'Satisfaction client', value: `${seller.fulfillmentRate}%`, color: 'text-emerald-400' },
                { label: 'Réponse', value: `${seller.responseRate}%`, color: 'text-blue-400' },
                { label: 'Retour de pièce', value: `${seller.returnRate}%`, color: seller.returnRate > 4 ? 'text-red-400' : 'text-emerald-400' },
                { label: 'Inscription', value: new Date(seller.joinDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }), color: 'text-gray-400' },
              ].map(m => (
                <div key={m.label} className="bg-gray-100 rounded-lg py-2 text-center">
                  <p className={`text-xs font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Link href={`/admin/sellers/${seller.id}`} className="flex-1 py-2 bg-gray-100 text-gray-600 dark:text-slate-300 dark:text-slate-300 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-slate-600/50 transition-colors">
                <Eye className="w-3 h-3" /> Détails
              </Link>
              <button
                onClick={async () => { await updateSellerVerification(seller.id, !seller.isVerified); refetchSellers(); }}
                className={`flex-1 py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors ${
                  seller.isVerified ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <Check className="w-3 h-3" /> {seller.isVerified ? 'Retirer' : 'Verifier'}
              </button>
              <button
                onClick={async () => { await updateSellerBan(seller.id, !seller.isBanned); refetchSellers(); }}
                title={seller.isBanned ? 'Débannir' : 'Bannir'}
                className={`w-8 py-2 rounded-lg flex items-center justify-center transition-colors ${
                  seller.isBanned ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                }`}
              >
                <Ban className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav role="admin" />
    </div>
  );
}
