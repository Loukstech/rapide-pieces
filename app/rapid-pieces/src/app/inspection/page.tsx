'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, CheckCircle, XCircle, AlertTriangle, Shield, Upload, AlertCircle, ClipboardList } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const inspectionSteps = [
  { step: 1, label: 'Photo de la pièce', desc: 'Le vendeur prend des photos de la pièce', icon: Camera },
  { step: 2, label: 'Vérification référence', desc: 'Comparaison avec la référence demandée', icon: CheckCircle },
  { step: 3, label: 'Contrôle qualité', desc: 'Inspection visuelle et fonctionnelle', icon: Shield },
  { step: 4, label: 'Validation', desc: 'Approuvé pour expédition', icon: CheckCircle },
];

const inspectionTypes = [
  { category: 'Freinage', parts: ['Plaquettes', 'Disques', 'Étriers', 'Maîtres-cylindres'], risk: 'high', reason: 'Sécurité véhicule' },
  { category: 'Moteur', parts: ['Alternateur', 'Démarreur', 'Pompe à injection', 'Turbo'], risk: 'medium', reason: 'Coût élevé' },
  { category: 'Électronique', parts: ['Boîtier électronique', 'Capteurs', 'Calculateurs'], risk: 'high', reason: 'Compatibilité critique' },
  { category: 'Transmission', parts: ['Boîte de vitesses', 'Embrayage', 'Pont arrière'], risk: 'medium', reason: 'Pièces complexes' },
];

const riskColors: Record<string, string> = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const recentInspections = [
  { id: 'INS-001', part: 'Plaquettes de frein OEM', seller: 'BigMoteurs', status: 'approved', date: '2025-06-12', photos: 4 },
  { id: 'INS-002', part: 'Alternateur reconditionné', seller: 'Massa Garage', status: 'pending', date: '2025-06-12', photos: 2 },
  { id: 'INS-003', part: 'Boîtier électronique Honda', seller: 'Sotra Pièces', status: 'rejected', date: '2025-06-11', photos: 3 },
];

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  approved: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Approuvé', icon: <CheckCircle className="w-4 h-4" /> },
  pending: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'En cours', icon: <AlertTriangle className="w-4 h-4" /> },
  rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Rejeté', icon: <XCircle className="w-4 h-4" /> },
};

export default function InspectionPage() {
  return (
    <div className="min-h-screen bg-rp-bg pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/protection" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">Inspection qualité</h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Vérification avant livraison</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* How it works */}
        <div className="bg-gradient-to-br from-blue-900/30 to-slate-900 rounded-2xl p-5 border border-blue-500/20">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-4">Comment fonctionne l&apos;inspection ?</h2>
          <div className="space-y-3">
            {inspectionSteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-blue-400">{s.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-900 dark:text-white dark:text-white">{s.label}</div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{s.desc}</div>
                  </div>
                  <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Inspection types */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase tracking-wide">Pièces soumises à inspection</h3>
          {inspectionTypes.map((type, i) => (
            <div key={i} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{type.category}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1 ${riskColors[type.risk]}`}>
                  {type.risk === 'high' ? (<><AlertTriangle className="w-3 h-3" /> Risque élevé</>) : (<><AlertCircle className="w-3 h-3" /> Risque moyen</>)}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-2">Raison: {type.reason}</p>
              <div className="flex flex-wrap gap-1.5">
                {type.parts.map(p => (
                  <span key={p} className="text-[10px] bg-gray-100 text-gray-600 dark:text-slate-300 dark:text-slate-300 px-2 py-0.5 rounded-full">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent inspections */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase tracking-wide">Inspections récentes</h3>
          {recentInspections.map((insp, i) => (
            <div key={i} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 font-mono">{insp.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${statusConfig[insp.status].color}`}>
                    {statusConfig[insp.status].icon}
                    {statusConfig[insp.status].label}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{insp.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white dark:text-white">{insp.part}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Vendeur: {insp.seller}</div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">
                  <Camera className="w-3 h-3" /> {insp.photos} photos
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Request inspection */}
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-3">Demander une inspection</h3>
          <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-4">Pour les pièces sensibles (freinage, électronique, moteur), vous pouvez demander une inspection avant livraison.</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Numéro de commande</label>
              <input type="text" placeholder="RP-XXXXX" className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Type de pièce</label>
              <select className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm">
                <option>Freinage</option>
                <option>Moteur</option>
                <option>Électronique</option>
                <option>Transmission</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Notes supplémentaires</label>
              <textarea rows={2} className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm resize-none" placeholder="Détails spécifiques..." />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-gray-900 dark:text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
              <ClipboardList className="w-4 h-4" /> Demander l&apos;inspection
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
