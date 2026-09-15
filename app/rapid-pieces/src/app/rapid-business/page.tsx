'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Truck, Wrench, Users, CreditCard, BarChart3, Shield, Star, CheckCircle, Phone } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const plans = [
  {
    name: 'Garage',
    icon: Wrench,
    price: '25 000',
    period: '/mois',
    features: [
      'Historique véhicules clients',
      'Demandes de pièces illimitées',
      'Prix préférentiels (-5%)',
      'Support prioritaire',
      'Factures mensuelles',
      '5 comptes utilisateurs',
    ],
    color: 'border-blue-500/30',
    highlight: false,
  },
  {
    name: 'Flotte',
    icon: Truck,
    price: '75 000',
    period: '/mois',
    features: [
      'Tout du plan Garage',
      'Gestion multi-véhicules',
      'Achats groupés automatiques',
      'Prix préférentiels (-10%)',
      'Account manager dédié',
      'Rapports mensuels',
      '20 comptes utilisateurs',
      'Crédit commercial',
    ],
    color: 'border-red-300',
    highlight: true,
  },
  {
    name: 'Entreprise',
    icon: Building2,
    price: 'Sur devis',
    period: '',
    features: [
      'Tout du plan Flotte',
      'API intégration',
      'Sourcing sur mesure',
      'Logistique dédiée',
      'Facturation entreprise',
      'Comptes illimités',
      'SLA garanti',
      'Support 24/7',
    ],
    color: 'border-purple-500/30',
    highlight: false,
  },
];

const benefits = [
  { icon: CreditCard, title: 'Crédit commercial', desc: 'Payez à 30 jours pour vos achats récurrents' },
  { icon: BarChart3, title: 'Tableau de bord', desc: 'Suivez vos achats, budgets et consommations' },
  { icon: Shield, title: 'Garantie étendue', desc: 'Protection renforcée sur toutes vos commandes' },
  { icon: Star, title: 'Prix préférentiels', desc: 'Jusqu\'à -15% sur votre volume d\'achats' },
];

const testimonials = [
  { name: 'Garage Massa', type: 'Garage', text: 'Rapid Pièces a transformé notre approvisionnement. On trouve des pièces en 2h au lieu de 2 jours.', rating: 5 },
  { name: 'Transport GTA', type: 'Flotte', text: 'Gestion centralisée de 35 véhicules. Les achats groupés nous font économiser 30% par mois.', rating: 5 },
];

export default function RapidBusinessPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-rp-bg pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">Rapid Business</h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Solutions B2B pour professionnels</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-purple-900/30 to-slate-900 rounded-2xl p-6 border border-purple-500/20 text-center">
          <Building2 className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Rapid Business</h2>
          <p className="text-sm text-gray-600 dark:text-slate-300 dark:text-slate-300 max-w-md mx-auto">
            Solutions professionnelles pour garages, flottes et entreprises. Gérez vos achats de pièces en toute simplicité.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                <Icon className="w-5 h-5 text-purple-400 mb-2" />
                <div className="text-xs font-bold text-gray-900 dark:text-white dark:text-white">{b.title}</div>
                <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 mt-0.5">{b.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Plans */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase tracking-wide">Choisir un plan</h3>
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`bg-gray-50 border rounded-2xl p-5 transition-all ${
                  plan.highlight ? `${plan.color} ring-1 ring-rp-primary/20` : 'border-gray-200'
                } ${selectedPlan === plan.name ? 'ring-2 ring-rp-primary' : ''}`}
              >
                {plan.highlight && (
                  <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold mb-3 inline-flex items-center gap-1"><Star className="w-3 h-3" /> Recommandé</span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">Plan {plan.name}</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                      {plan.period && <span className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">{plan.period}</span>}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-slate-300 dark:text-slate-300">{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                    plan.highlight
                      ? 'bg-red-600 text-white hover:bg-red-600-dark'
                      : 'bg-gray-200 text-gray-900 dark:text-white hover:bg-slate-600'
                  }`}
                >
                  {plan.price === 'Sur devis' ? 'Demander un devis' : 'Choisir ce plan'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase tracking-wide">Ils nous font confiance</h3>
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white dark:text-white">{t.name}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{t.type}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-300 dark:text-slate-300 italic">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white dark:text-white mb-2">Prêt à passer au niveau supérieur ?</h3>
          <p className="text-sm text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-4">Contactez notre équipe commerciale</p>
          <a href="https://wa.me/22901XXYYZZ?text=Bonjour%20Rapid%20Business%2C%20je%20suis%20intéressé%20par%20un%20plan%20professionnel."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
            <Phone className="w-4 h-4" /> Contacter l&apos;équipe commerciale
          </a>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
