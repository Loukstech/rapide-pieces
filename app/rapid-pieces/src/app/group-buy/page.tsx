'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, TrendingDown, Clock, CheckCircle, Package, CheckCircle2, Calendar } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatPrice } from '@/lib/types';

const getGroupBuys = (t: (path: string) => string) => [
  {
    id: 1,
    part: t('parts.brakePadsFront'),
    vehicle: 'Toyota Corolla 2014-2019',
    participants: 35,
    target: 50,
    localPrice: 45000,
    groupPrice: 32000,
    savings: 29,
    deadline: '2025-07-15',
    status: 'active',
    progress: 70,
  },
  {
    id: 2,
    part: t('parts.oilFilter'),
    vehicle: 'Toyota Corolla 2014-2019',
    participants: 42,
    target: 50,
    localPrice: 12500,
    groupPrice: 7800,
    savings: 38,
    deadline: '2025-07-10',
    status: 'active',
    progress: 84,
  },
  {
    id: 3,
    part: t('parts.rearShockAbsorber'),
    vehicle: 'Honda Civic 2016-2021',
    participants: 18,
    target: 30,
    localPrice: 72000,
    groupPrice: 52000,
    savings: 28,
    deadline: '2025-07-20',
    status: 'active',
    progress: 60,
  },
  {
    id: 4,
    part: t('parts.battery60Ah'),
    vehicle: 'Universel',
    participants: 50,
    target: 50,
    localPrice: 65000,
    groupPrice: 42000,
    savings: 35,
    deadline: '2025-06-30',
    status: 'completed',
    progress: 100,
  },
];

export default function GroupBuyPage() {
  const { t } = useLanguage();
  const groupBuys = getGroupBuys(t);
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  const filtered = groupBuys.filter(g => tab === 'active' ? g.status === 'active' : g.status === 'completed');

  return (
    <div className="min-h-screen bg-rp-bg pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{t('groupBuy.title')}</h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('groupBuy.subtitle')}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* How it works */}
        <div className="bg-gradient-to-br from-emerald-900/30 to-slate-900 rounded-2xl p-5 border border-emerald-500/20">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-3">{t('common.howItWorks')}</h2>
          <div className="space-y-3">
            {[
              { icon: <span className="w-6 h-6 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>, text: t('groupBuy.step1') },
              { icon: <span className="w-6 h-6 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>, text: t('groupBuy.step2') },
              { icon: <span className="w-6 h-6 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</span>, text: t('groupBuy.step3') },
              { icon: <span className="w-6 h-6 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">4</span>, text: t('groupBuy.step4') },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                {step.icon}
                <span className="text-xs text-gray-600 dark:text-slate-300 dark:text-slate-300">{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['active', 'completed'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === t ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-400 dark:text-slate-500 dark:text-slate-500'
              }`}
            >
              {t === 'active' ? 'En cours' : 'Terminés'}
            </button>
          ))}
        </div>

        {/* Group buys */}
        <div className="space-y-4">
          {filtered.map((gb) => (
            <div key={gb.id} className={`bg-gray-50 border rounded-2xl p-5 transition-all ${
              gb.status === 'completed' ? 'border-emerald-500/30' : 'border-gray-200'
            }`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{gb.part}</h3>
                  <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">{gb.vehicle}</p>
                </div>
                {gb.status === 'completed' ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Terminé
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> En cours
                  </span>
                )}
              </div>

              {/* Price comparison */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mb-3">
                <div className="bg-gray-100 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Prix local</div>
                  <div className="text-sm font-bold text-gray-400 dark:text-slate-500 dark:text-slate-500 line-through">{formatPrice(gb.localPrice)}</div>
                </div>
                <div className="bg-emerald-500/10 rounded-xl p-3 text-center border border-emerald-500/20">
                  <div className="text-[10px] text-emerald-400">Prix groupe</div>
                  <div className="text-sm font-bold text-emerald-400">{formatPrice(gb.groupPrice)}</div>
                </div>
              </div>

              {/* Savings */}
              <div className="flex items-center justify-center gap-2 mb-3 bg-emerald-500/10 rounded-lg py-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">-{gb.savings}% d&apos;économie</span>
                <span className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">= {formatPrice(gb.localPrice - gb.groupPrice)}</span>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500 flex items-center gap-1">
                    <Users className="w-3 h-3" /> {gb.participants}/{gb.target} participants
                  </span>
                  <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">{gb.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${gb.status === 'completed' ? 'bg-emerald-500' : 'bg-red-600'}`} style={{ width: `${gb.progress}%` }} />
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Deadline: {gb.deadline}</span>
                <span>{gb.target - gb.participants} places restantes</span>
              </div>

              {/* CTA */}
              {gb.status === 'active' ? (
                <button className="w-full bg-red-600 text-white font-bold py-3 sm:py-3.5 rounded-xl text-sm hover:bg-red-600-dark transition-all flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" /> Rejoindre l&apos;achat groupé
                </button>
              ) : (
                <div className="bg-emerald-500/10 text-emerald-400 text-xs font-bold py-3 rounded-xl text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Achat groupé livré avec succès
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
