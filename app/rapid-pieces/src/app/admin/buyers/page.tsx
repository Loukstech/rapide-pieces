'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, MapPin, Eye, User } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useOrders } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  country?: string;
  buyer_type?: 'individual' | 'mechanic' | 'garage' | 'business';
  rapid_points: number;
  created_at: string;
}

export default function AdminBuyersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'individual' | 'mechanic' | 'garage' | 'business'>('all');
  const [country, setCountry] = useState<string>('all');
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/login?role=admin');
  }, [user, isLoading, router]);

  const loadBuyers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'buyer')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setBuyers(data as Buyer[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const fetchData = async () => {
      await loadBuyers();
    };
    fetchData();
  }, [loadBuyers]);

  const { data: allOrders } = useOrders();
  const ordersCountByBuyer = allOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.buyerId] = (acc[o.buyerId] ?? 0) + 1;
    return acc;
  }, {});

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  const countries = Array.from(new Set(buyers.map(b => b.country).filter((c): c is string => !!c))).sort();

  const filtered = buyers.filter(b => {
    const matchSearch = !search || 
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);
    const matchFilter = filter === 'all' || b.buyer_type === filter;
    const matchCountry = country === 'all' || b.country === country;
    return matchSearch && matchFilter && matchCountry;
  });

  const getBuyerTypeLabel = (type?: string) => {
    switch (type) {
      case 'individual': return 'Particulier';
      case 'mechanic': return 'Mécanicien';
      case 'garage': return 'Garage';
      case 'business': return 'Entreprise';
      default: return 'Non défini';
    }
  };

  const getBuyerTypeColor = (type?: string) => {
    switch (type) {
      case 'individual': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'mechanic': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'garage': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'business': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-rp-bg">
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white flex-1">Gestion des acheteurs</h1>
          <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{filtered.length} acheteurs</span>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 dark:text-slate-500" />
              <input type="text" placeholder="Rechercher un acheteur..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <select value={country} onChange={(e) => setCountry(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="all">Tous pays</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all' as const, label: 'Tous' },
              { key: 'individual' as const, label: 'Particuliers' },
              { key: 'mechanic' as const, label: 'Mécaniciens' },
              { key: 'garage' as const, label: 'Garages' },
              { key: 'business' as const, label: 'Entreprises' },
            ].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                  filter === f.key ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400 dark:text-slate-500 dark:text-slate-500 border border-gray-200'
                }`}>{f.label}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3 pb-24 lg:pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-slate-500">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun acheteur trouvé</p>
          </div>
        ) : (
          filtered.map(buyer => (
            <div key={buyer.id} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  {buyer.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{buyer.name}</h3>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium border ${getBuyerTypeColor(buyer.buyer_type)}`}>
                      {getBuyerTypeLabel(buyer.buyer_type)}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3" /> {buyer.location}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{buyer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-100 rounded-lg py-2 text-center">
                  <p className="text-xs font-bold text-emerald-400">{buyer.rapid_points}</p>
                  <p className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Points</p>
                </div>
                <div className="bg-gray-100 rounded-lg py-2 text-center">
                  <p className="text-xs font-bold text-blue-400">{ordersCountByBuyer[buyer.id] ?? 0}</p>
                  <p className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Commandes</p>
                </div>
                <div className="bg-gray-100 rounded-lg py-2 text-center">
                  <p className="text-xs font-bold text-purple-400">{new Date(buyer.created_at).toLocaleDateString('fr-FR')}</p>
                  <p className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Inscription</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/buyers/${buyer.id}`} className="flex-1 py-2 bg-gray-100 text-gray-600 dark:text-slate-300 dark:text-slate-300 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-slate-600/50 transition-colors">
                  <Eye className="w-3 h-3" /> Détails
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav role="admin" />
    </div>
  );
}