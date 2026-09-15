'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Search, Edit3, Trash2, Package, TrendingUp, Eye, BarChart3, Star, Bell, Store, DollarSign, LogOut } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { POPULAR_BRANDS, POPULAR_CATEGORIES, currencyForCountry, currencyLabel, formatPrice } from '@/lib/types';
import { useToast } from '@/components/Toast';

const myCatalogue = [
  { id: '1', name: 'Plaquettes de frein avant OEM', brand: 'Toyota', category: 'Freinage', stock: 12, price: 62000, views: 234, inquiries: 18 },
  { id: '2', name: 'Filtre à huile', brand: 'Toyota', category: 'Filtration', stock: 45, price: 8000, views: 567, inquiries: 42 },
  { id: '3', name: 'Huile moteur 5W30 4L', brand: 'Multi', category: 'Moteur', stock: 30, price: 15000, views: 890, inquiries: 67 },
  { id: '4', name: 'Batterie 60Ah', brand: 'Toyota', category: 'Électrique', stock: 8, price: 85000, views: 123, inquiries: 9 },
  { id: '5', name: 'Ampoule phare H7', brand: 'Multi', category: 'Éclairage', stock: 0, price: 5000, views: 45, inquiries: 3 },
];

export default function SellerCataloguePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const myCurrency = currencyForCountry(user?.country);
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState<'catalogue' | 'stats'>('catalogue');
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', category: '', stock: '', price: '' });

  const handleLogout = () => {
    logout();
    router.push('/welcome');
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'seller')) router.replace('/login');
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  const filtered = myCatalogue.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-rp-bg">
      {/* Header */}
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/seller" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white flex-1">Mon catalogue</h1>
          <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{myCatalogue.length} produits</span>
          <button onClick={() => setShowAdd(!showAdd)} className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Plus className="w-4 h-4 text-gray-900 dark:text-white" /></button>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          <button onClick={() => setTab('catalogue')} className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${tab === 'catalogue' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 dark:text-slate-500 dark:text-slate-500 border border-gray-200'}`}><Package className="w-3 h-3" /> Catalogue</button>
          <button onClick={() => setTab('stats')} className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${tab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 dark:text-slate-500 dark:text-slate-500 border border-gray-200'}`}><BarChart3 className="w-3 h-3" /> Stats</button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3 pb-24 lg:pb-6">
        {tab === 'catalogue' && (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 dark:text-slate-500" />
              <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Add Form */}
            {showAdd && (
              <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 slide-up">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-3">Ajouter un produit</h3>
                <div className="space-y-2">
                  <input type="text" placeholder="Nom du produit" value={newProduct.name} onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none" />
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    <select value={newProduct.brand} onChange={(e) => setNewProduct(p => ({ ...p, brand: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none">
                      <option value="">Marque</option>
                      {POPULAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select value={newProduct.category} onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none">
                      <option value="">Catégorie</option>
                      {POPULAR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct(p => ({ ...p, stock: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none" />
                    <input type="number" placeholder={`Prix (${currencyLabel(myCurrency)})`} value={newProduct.price} onChange={(e) => setNewProduct(p => ({ ...p, price: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowAdd(false)} className="flex-1 py-2 bg-gray-200 text-gray-900 dark:text-white rounded-lg text-xs font-medium">Annuler</button>
                    <button onClick={() => { showToast("Produit ajouté", "success"); setShowAdd(false); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">Ajouter</button>
                  </div>
                </div>
              </div>
            )}

            {/* Product List */}
            <div className="space-y-2">
              {filtered.map(product => (
                <div key={product.id} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                        {product.stock === 0 && <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full">Rupture</span>}
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{product.brand} • {product.category}</p>
                    </div>
                    <p className="text-sm font-bold text-red-600">{formatPrice(product.price, myCurrency)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">
                      <span className="flex items-center gap-1"><Package className="w-3 h-3" /> Stock: <strong className={product.stock === 0 ? 'text-red-400' : 'text-gray-900 dark:text-white'}>{product.stock}</strong></span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {product.views}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {product.inquiries}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => showToast("Modifier le produit", "info")} className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"><Edit3 className="w-3 h-3 text-gray-500 dark:text-slate-400 dark:text-slate-400" /></button>
                      <button onClick={() => showToast("Supprimer le produit", "warning")} className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100"><Trash2 className="w-3 h-3 text-red-500" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: 'Vues totales', value: '1 859', icon: Eye },
                { label: 'Demandes reçues', value: '139', icon: TrendingUp },
                { label: 'Taux conversion', value: '7.5%', icon: BarChart3 },
                { label: 'CA mensuel', value: '12.4M', icon: DollarSign },
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
                    <Icon className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">{stat.value}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-3">Produits les plus demandés</h3>
              {myCatalogue.sort((a, b) => b.inquiries - a.inquiries).slice(0, 5).map((p, i) => (
                <div key={p.id} className={`flex items-center gap-3 py-2 ${i < 4 ? 'border-b border-gray-200' : ''}`}>
                  <span className="text-xs font-bold text-gray-400 dark:text-slate-500 dark:text-slate-500 w-4">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{p.inquiries} demandes • {p.views} vues</p>
                  </div>
                  <span className="text-xs font-bold text-red-600">{p.price.toLocaleString('fr-FR')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav role="seller" />
    </div>
  );
}
