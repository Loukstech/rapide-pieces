'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Globe } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { formatPrice } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const sources = [
  {
    country: 'Nigeria',
    name: 'RAPID NIGERIA',
    desc: 'Sourcing direct depuis Lagos — plus grande place de pièces en Afrique de l\'Ouest',
    delivery: '48h',
    fee: '5-10%',
    categories: ['Moteur', 'Transmission', 'Électronique', 'Carrosserie'],
    color: 'from-green-900/40 to-slate-900',
    border: 'border-green-500/20',
  },
  {
    country: 'USA',
    name: 'RAPID USA',
    desc: 'Pièces OEM et Genuine depuis Houston — stock massif de pièces neuves et reconditionnées',
    delivery: '7 jours',
    fee: '8-15%',
    categories: ['OEM', 'Genuine', 'Premium', 'Reconditionné'],
    color: 'from-blue-900/40 to-slate-900',
    border: 'border-blue-500/20',
  },
];

const recentSourcing = [
  { part: 'Kit d\'embrayage Toyota Corolla', source: 'Nigeria', status: 'En transit', eta: '2 jours', cost: 185000 },
  { part: 'Boîtier de direction Honda', source: 'USA', status: 'Expédié', eta: '5 jours', cost: 420000 },
  { part: 'Turbo BMW Serie 3', source: 'USA', status: 'En vérification', eta: '7 jours', cost: 890000 },
];

export default function SourcingPage() {
  const { t } = useLanguage();
  const [showRequest, setShowRequest] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Logo size="sm" />
            <span className="text-sm font-black text-gray-900 dark:text-white hidden sm:inline">{t('nav.brandName')}</span>
          </Link>
          <h1 className="text-sm font-bold text-gray-400 dark:text-slate-500 dark:text-slate-500 ml-auto">{t('sourcing.title')}</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-gray-200 text-center">
          <Globe className="w-10 h-10 mx-auto mb-3 text-slate-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('sourcing.title')}</h2>
          <p className="text-sm text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('sourcing.heroSubtitle')}</p>
        </div>

        {/* Source cards */}
        <div className="space-y-4">
          {sources.map((src, i) => (
            <div key={i} className={`bg-gradient-to-br ${src.color} rounded-2xl p-5 border ${src.border}`}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">{src.name}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 dark:text-slate-300 mb-4">{src.desc}</p>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('common.delivery')}</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{src.delivery}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('common.fee')}</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{src.fee}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {src.categories.map((c) => (
                  <span key={c} className="text-[10px] bg-gray-50 text-gray-600 dark:text-slate-300 dark:text-slate-300 px-2 py-1 rounded-full">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Request sourcing */}
        <button
          onClick={() => setShowRequest(!showRequest)}
          className="w-full bg-red-600 hover:bg-red-500 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
        >
          <Globe className="w-4 h-4" /> {t('sourcing.requestButton')}
        </button>

        {showRequest && (
          <div className="bg-white backdrop-blur-sm rounded-2xl p-5 border border-gray-200 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('sourcing.formTitle')}</h3>
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Pièce recherchée</label>
              <input type="text" placeholder="Ex: Kit d'embrayage complet" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Marque</label>
                <input type="text" placeholder="Toyota" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Modèle</label>
                <input type="text" placeholder="Corolla" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Référence OEM (si connue)</label>
              <input type="text" placeholder="04465-02200" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Source préférée</label>
              <div className="flex gap-2">
                <button className="flex-1 bg-green-500/20 border border-green-500/30 text-green-300 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"><Globe className="w-3 h-3" /> Nigeria</button>
                <button className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"><Globe className="w-3 h-3" /> USA</button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Budget max</label>
              <input type="number" placeholder="500000 FCFA" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm" />
            </div>
            <button className="w-full bg-red-600 hover:bg-red-500 text-gray-900 dark:text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" /> Envoyer la demande
            </button>
          </div>
        )}

        {/* Recent sourcing requests */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase tracking-wide">Sourcing en cours</h3>
          {recentSourcing.map((r, i) => (
            <div key={i} className="bg-white backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">{r.source}</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">ETA: {r.eta}</span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{r.part}</h4>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  r.status === 'En transit' ? 'bg-blue-500/20 text-blue-300' :
                  r.status === 'Expédié' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-gray-100 text-gray-400 dark:text-slate-500 dark:text-slate-500'
                }`}>{r.status}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{formatPrice(r.cost)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
