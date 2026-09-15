'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, ChevronRight, Calendar, MapPin, Wrench, Shield, AlertTriangle, Car, Lightbulb, Check, ArrowRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const vehicles = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Corolla',
    year: 2018,
    motor: '1.8 Essence',
    plate: 'CA-2018-4521',
    vin: 'SB1AZ3GE5H0123456',
    history: [
      { part: 'Huile moteur 5W-30', date: '2025-06-10', km: 85000, seller: 'Sotra Pièces', amount: 15000, quality: 'Genuine', status: 'Installée' },
      { part: 'Filtre à huile', date: '2025-06-10', km: 85000, seller: 'Sotra Pièces', amount: 8000, quality: 'Genuine', status: 'Installée' },
      { part: 'Plaquettes de frein avant', date: '2025-05-15', km: 82000, seller: 'BigMoteurs', amount: 45000, quality: 'OEM', status: 'Installée' },
      { part: 'Filtre à air', date: '2025-04-20', km: 80000, seller: 'Sotra Pièces', amount: 12000, quality: 'Genuine', status: 'Installée' },
      { part: 'Amortisseur arrière gauche', date: '2025-03-10', km: 78000, seller: 'Diallo & Frères', amount: 85000, quality: 'Premium', status: 'Installée' },
      { part: 'Batterie 45Ah', date: '2025-01-15', km: 75000, seller: 'Massa Garage', amount: 55000, quality: 'Standard', status: 'Installée' },
    ],
    totalSpent: 220000,
    lastService: '2025-06-10',
    nextService: '2025-09-10',
  },
  {
    id: 2,
    brand: 'Honda',
    model: 'Civic',
    year: 2020,
    motor: '1.5 Turbo',
    plate: 'CA-2020-1187',
    vin: '2HGFC2F59LH543210',
    history: [
      { part: 'Plaquettes de frein avant', date: '2025-05-20', km: 45000, seller: 'BigMoteurs', amount: 38000, quality: 'OEM', status: 'Installée' },
      { part: 'Pneu 225/45R17', date: '2025-04-10', km: 43000, seller: 'Diallo & Frères', amount: 220000, quality: 'Premium', status: 'Installée' },
    ],
    totalSpent: 258000,
    lastService: '2025-05-20',
    nextService: '2025-08-20',
  },
];

const maintenanceSchedule = [
  { interval: '10 000 km', parts: ['Huile moteur', 'Filtre à huile'], urgency: 'routine' },
  { interval: '20 000 km', parts: ['Filtre à air', 'Filtre habitacle', 'Bougies'], urgency: 'routine' },
  { interval: '40 000 km', parts: ['Plaquettes de frein', 'Liquide de frein'], urgency: 'important' },
  { interval: '60 000 km', parts: ['Amortisseurs', 'Courroie accessoires'], urgency: 'important' },
  { interval: '80 000 km', parts: ['Kit d\'embrayage', 'Disques de frein'], urgency: 'critique' },
  { interval: '100 000 km', parts: ['Pompe à eau', 'Thermostat', 'Alternateur'], urgency: 'critique' },
];

const urgencyColors: Record<string, string> = {
  routine: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  important: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  critique: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function VehicleHistoryPage() {
  const { t } = useLanguage();
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicles[0] | null>(vehicles[0]);

  return (
    <div className="min-h-screen bg-rp-bg pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/profile" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{t('vehicleHistory.title')}</h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('vehicleHistory.subtitle')}</p>
          </div>
          <Link href="/requests/new" className="bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1">
            <Plus className="w-3 h-3" /> {t('buyer.newRequest')}
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* Vehicle selector */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {vehicles.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              className={`shrink-0 rounded-xl p-3 border transition-all ${
                selectedVehicle?.id === v.id
                  ? 'bg-red-600/10 border-red-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Car className="w-6 h-6 text-gray-500" />
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900 dark:text-white dark:text-white">{v.brand} {v.model}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{v.year} • {v.plate}</div>
                </div>
              </div>
            </button>
          ))}
          <button className="shrink-0 rounded-xl p-3 border border-dashed border-gray-200 flex items-center justify-center min-w-[120px] hover:border-red-200 transition-all">
            <div className="text-center">
              <Plus className="w-5 h-5 text-gray-400 dark:text-slate-500 dark:text-slate-500 mx-auto" />
              <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Ajouter</span>
            </div>
          </button>
        </div>

        {selectedVehicle && (
          <>
            {/* Vehicle Info */}
            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center"><Car className="w-7 h-7 text-red-600" /></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">{selectedVehicle.brand} {selectedVehicle.model}</h2>
                  <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">{selectedVehicle.year} • {selectedVehicle.motor}</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">VIN: {selectedVehicle.vin}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-100 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">{selectedVehicle.history.length}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Pièces</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-yellow-400">{selectedVehicle.totalSpent.toLocaleString('fr-FR')}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">FCFA dépensés</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-emerald-400">85k</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">km actuels</div>
                </div>
              </div>
            </div>

            {/* Next service alert */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-400">Prochain entretien</p>
                <p className="text-[11px] text-gray-600 dark:text-slate-300 dark:text-slate-300">Prévu le {selectedVehicle.nextService} — Huile + Filtre</p>
              </div>
              <Link href="/requests/new" className="ml-auto bg-amber-500/20 text-amber-300 text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0">
                Commander
              </Link>
            </div>

            {/* Maintenance schedule */}
            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-3 flex items-center gap-2"><Wrench className="w-4 h-4 text-red-600" /> Planning d&apos;entretien</h3>
              <div className="space-y-2">
                {maintenanceSchedule.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-200 last:border-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${urgencyColors[m.urgency]}`}>{m.interval}</span>
                    <div className="flex-1">
                      <div className="text-xs text-gray-900 dark:text-white">{m.parts.join(', ')}</div>
                    </div>
                    <Link href="/requests/new" className="text-[10px] text-red-600 font-medium">Commander</Link>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase tracking-wide">Historique des pièces</h3>
              {selectedVehicle.history.map((h, i) => (
                <div key={i} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{h.part}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 mt-0.5">
                          <Calendar className="w-3 h-3" /> {h.date}
                          <span>•</span>
                          <span>{h.km.toLocaleString('fr-FR')} km</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{h.amount.toLocaleString('fr-FR')} FCFA</div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">{h.quality}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.seller}</span>
                    <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> {h.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 mb-1 flex items-center gap-1.5"><Lightbulb className="w-3 h-3" /> Recommandation Rapid</p>
              <p className="text-[11px] text-gray-600 dark:text-slate-300 dark:text-slate-300">Basé sur votre historique, les prochaines pièces à prévoir : plaquettes arrière (~35 000 FCFA) et filtre à carburant (~15 000 FCFA).</p>
              <Link href="/requests/new" className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 font-medium hover:underline">Demander ces pièces <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
