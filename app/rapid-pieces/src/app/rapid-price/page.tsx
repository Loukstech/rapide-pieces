'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Search, Info, Lightbulb, ArrowRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { formatPrice } from '@/lib/types';

const popularParts = [
  { name: 'Plaquettes de frein avant', brand: 'Toyota Corolla', avgPrice: 42000, min: 28000, max: 65000, trend: 'stable', samples: 23, quality: 'OEM' },
  { name: 'Filtre à huile', brand: 'Toyota Corolla', avgPrice: 12500, min: 8000, max: 18000, trend: 'down', samples: 31, quality: 'Genuine' },
  { name: 'Alternateur', brand: 'Toyota Corolla', avgPrice: 85000, min: 55000, max: 145000, trend: 'up', samples: 12, quality: 'OEM' },
  { name: 'Amortisseur arrière', brand: 'Honda Civic', avgPrice: 72000, min: 45000, max: 110000, trend: 'stable', samples: 18, quality: 'Premium' },
  { name: 'Kit d\'embrayage', brand: 'Toyota Hilux', avgPrice: 185000, min: 120000, max: 280000, trend: 'down', samples: 8, quality: 'OEM' },
  { name: 'Batterie 60Ah', brand: 'Universel', avgPrice: 65000, min: 45000, max: 95000, trend: 'stable', samples: 45, quality: 'Standard' },
  { name: 'Pneu 205/55R16', brand: 'Universel', avgPrice: 55000, min: 38000, max: 85000, trend: 'down', samples: 67, quality: 'Premium' },
  { name: 'Bobine d\'allumage', brand: 'Honda Civic', avgPrice: 35000, min: 22000, max: 55000, trend: 'up', samples: 14, quality: 'Aftermarket' },
];

const priceHistory = [
  { month: 'Jan', price: 44000 },
  { month: 'Fév', price: 43500 },
  { month: 'Mar', price: 42800 },
  { month: 'Avr', price: 42000 },
  { month: 'Mai', price: 41500 },
  { month: 'Juin', price: 42000 },
];

const trendIcons: Record<string, React.ReactNode> = {
  up: <TrendingUp className="w-4 h-4 text-red-400" />,
  down: <TrendingDown className="w-4 h-4 text-emerald-400" />,
  stable: <Minus className="w-4 h-4 text-gray-400 dark:text-slate-500 dark:text-slate-500" />,
};

const trendLabels: Record<string, string> = {
  up: 'En hausse',
  down: 'En baisse',
  stable: 'Stable',
};

const trendColors: Record<string, string> = {
  up: 'text-red-400',
  down: 'text-emerald-400',
  stable: 'text-gray-400 dark:text-slate-500 dark:text-slate-500',
};

export default function RapidPricePage() {
  const [search, setSearch] = useState('');
  const [selectedPart, setSelectedPart] = useState<typeof popularParts[0] | null>(null);

  const filtered = popularParts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-rp-bg pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">Rapid Price</h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Prix moyen du marché</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-900/30 to-slate-900 rounded-2xl p-5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-400">Rapid Price</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-300 dark:text-slate-300">Le prix moyen du marché basé sur les transactions réelles. Savoir si vous payez trop cher.</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher une pièce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary"
          />
        </div>

        {/* Selected Part Detail */}
        {selectedPart && (
          <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{selectedPart.name}</h3>
                <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">{selectedPart.brand} • {selectedPart.quality}</p>
              </div>
              <button onClick={() => setSelectedPart(null)} className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white">✕</button>
            </div>

            {/* Price display */}
            <div className="text-center py-4">
              <div className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-1">Prix moyen du marché</div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">{formatPrice(selectedPart.avgPrice)}</div>
              <div className={`flex items-center justify-center gap-1 mt-2 ${trendColors[selectedPart.trend]}`}>
                {trendIcons[selectedPart.trend]}
                <span className="text-xs font-medium">{trendLabels[selectedPart.trend]}</span>
              </div>
            </div>

            {/* Price range */}
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-2">
                <span>Fourchette de prix</span>
                <span>{selectedPart.samples} offres analysées</span>
              </div>
              <div className="relative h-3 bg-slate-600 rounded-full">
                <div className="absolute h-3 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-full" style={{ left: '10%', right: '10%' }} />
                <div className="absolute top-0 w-1 h-3 bg-white rounded-full" style={{ left: `${((selectedPart.avgPrice - selectedPart.min) / (selectedPart.max - selectedPart.min)) * 80 + 10}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-emerald-400">{formatPrice(selectedPart.min)}</span>
                <span className="text-gray-900 dark:text-white font-bold">{formatPrice(selectedPart.avgPrice)}</span>
                <span className="text-red-400">{formatPrice(selectedPart.max)}</span>
              </div>
            </div>

            {/* Mini chart */}
            <div>
              <div className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-2">Évolution 6 mois</div>
              <div className="flex items-end gap-1 h-20">
                {priceHistory.map((h, i) => {
                  const maxP = Math.max(...priceHistory.map(p => p.price));
                  const minP = Math.min(...priceHistory.map(p => p.price));
                  const height = ((h.price - minP) / (maxP - minP)) * 60 + 20;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[8px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{(h.price / 1000).toFixed(0)}k</span>
                      <div className="w-full bg-red-600 rounded-t" style={{ height: `${height}px` }} />
                      <span className="text-[8px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{h.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Advice */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Conseil Rapid Price</p>
              <p className="text-[11px] text-gray-600 dark:text-slate-300 dark:text-slate-300 mt-1">
                {selectedPart.trend === 'down'
                  ? 'Les prix sont en baisse. Bon moment pour acheter.'
                  : selectedPart.trend === 'up'
                  ? 'Les prix montent. Pensez à commander rapidement.'
                  : 'Les prix sont stables. Vous pouvez acheter en confiance.'}
              </p>
            </div>

            <Link href="/requests/new" className="block w-full bg-red-600 text-white font-bold py-3 rounded-xl text-center text-sm flex items-center justify-center gap-1.5">
              Chercher cette pièce
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Parts List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase tracking-wide">Prix populaires</h3>
          {filtered.map((part, i) => (
            <button
              key={i}
              onClick={() => setSelectedPart(part)}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-left hover:border-red-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{part.name}</h4>
                  <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">{part.brand} • {part.quality}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-gray-900 dark:text-white">{part.avgPrice.toLocaleString('fr-FR')}</div>
                  <div className="flex items-center gap-1 justify-end">
                    {trendIcons[part.trend]}
                    <span className={`text-[10px] ${trendColors[part.trend]}`}>{trendLabels[part.trend]}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">
                <span>{formatPrice(part.min)} - {formatPrice(part.max)}</span>
                <span>•</span>
                <span>{part.samples} offres</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
