'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { ArrowLeft, Package, Clock, DollarSign, Truck, CheckCircle, Globe, MapPin, Star, MessageSquare, Inbox, BarChart3, Lightbulb, Banknote, Timer, CheckCircle2, ArrowRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const incomingRequests = [
  { id: 'REQ-001', part: 'Alternateur Toyota Hilux 2018', origin: 'Bénin', quantity: 1, budget: '180 000 FCFA', deadline: '7 jours', quality: 'OEM', vehicle: 'Toyota Hilux 2018', description: 'Alternateur neuf ou reconditionné. Référence OEM si possible.' },
  { id: 'REQ-002', part: 'Kit d\'embrayage Honda Civic 2017', origin: 'Bénin', quantity: 2, budget: '250 000 FCFA', deadline: '10 jours', quality: 'Premium', vehicle: 'Honda Civic 2017', description: 'Kit complet : disque, butée, roulement.' },
  { id: 'REQ-003', part: 'Turbo BMW Serie 3 2015', origin: 'Bénin', quantity: 1, budget: '900 000 FCFA', deadline: '14 jours', quality: 'OEM', vehicle: 'BMW Serie 3 2015', description: 'Turbo original BMW. Référence: 11658511427.' },
  { id: 'REQ-004', part: 'Boîtier de direction Mercedes Classe C', origin: 'Bénin', quantity: 1, budget: '420 000 FCFA', deadline: '10 jours', quality: 'Genuine', vehicle: 'Mercedes Classe C 2016', description: 'Boîtier de direction assistée.' },
];

const activeShipments = [
  { id: 'SHP-001', part: 'Kit d\'embrayage Toyota Corolla', buyer: 'Massa Garage, Cotonou', status: 'in-transit', departure: 'Lagos', arrival: 'Cotonou', eta: '2 jours', value: '185 000 FCFA' },
  { id: 'SHP-002', part: 'Alternateur Honda Civic', buyer: 'BigMoteurs, Cotonou', status: 'delivered', departure: 'Houston', arrival: 'Cotonou', eta: 'Livré', value: '420 000 FCFA' },
];

const stats = {
  requestsReceived: 47,
  offersSubmitted: 38,
  ordersWon: 23,
  totalRevenue: '12 500 000 FCFA',
  avgResponseTime: '4h',
  successRate: '61%',
};

const statusColors: Record<string, string> = {
  'in-transit': 'bg-blue-50 text-blue-600 border-blue-200',
  'delivered': 'bg-green-50 text-green-600 border-green-200',
};

export default function SupplierPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'requests' | 'shipments' | 'stats'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<typeof incomingRequests[0] | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerQuality, setOfferQuality] = useState('OEM');
  const [offerLeadTime, setOfferLeadTime] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <ThemeToggle className="ml-auto" />
          <Link href="/" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300 dark:text-slate-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{t('supplier.spaceTitle')}</h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Nigeria • USA • International</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* Stats overview */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center shadow-sm">
            <div className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">{stats.requestsReceived}</div>
            <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('seller.newRequests')}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center shadow-sm">
            <div className="text-lg font-bold text-blue-600">{stats.ordersWon}</div>
            <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('supplier.ordersWon')}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center shadow-sm">
            <div className="text-lg font-bold text-green-600">{stats.successRate}</div>
            <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('supplier.successRate')}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['requests', 'shipments', 'stats'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab ? 'bg-red-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 dark:text-slate-400 hover:text-gray-700'
              }`}
            >
              {tab === 'requests' ? <Inbox className="w-4 h-4" /> : tab === 'shipments' ? <Package className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
              <span className="truncate">{tab === 'requests' ? t('seller.requests') : tab === 'shipments' ? t('supplier.shipments') : t('seller.statistics')}</span>
            </button>
          ))}
        </div>

        {/* Requests Tab */}
        {activeTab === 'requests' && !selectedRequest && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 dark:text-slate-400 dark:text-slate-400 uppercase tracking-wide">{t('seller.newRequests')}</h3>
            {incomingRequests.map(req => (
              <button
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-left hover:border-red-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 font-mono">{req.id}</span>
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-bold">Nouveau</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{req.part}</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 dark:text-slate-400 mt-0.5">{req.vehicle} • {req.quality}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.origin}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {req.budget}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {req.deadline}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Offer form */}
        {activeTab === 'requests' && selectedRequest && (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">Soumettre une offre</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300 dark:text-slate-300 text-xs">✕ Fermer</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs font-bold text-gray-900 dark:text-white dark:text-white">{selectedRequest.part}</div>
              <div className="text-[10px] text-gray-500 dark:text-slate-400 dark:text-slate-400">{selectedRequest.vehicle} • {selectedRequest.quality}</div>
              <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 mt-1">{selectedRequest.description}</div>
              <div className="text-xs text-red-600 font-bold mt-2">Budget: {selectedRequest.budget}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Votre prix (FCFA)</label>
                <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="Ex: 150000"
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Qualité</label>
                <select value={offerQuality} onChange={(e) => setOfferQuality(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white">
                  <option>OEM</option>
                  <option>Genuine</option>
                  <option>Premium Aftermarket</option>
                  <option>Standard Aftermarket</option>
                  <option>Reconditionné</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Délai de livraison</label>
              <select value={offerLeadTime} onChange={(e) => setOfferLeadTime(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white">
                <option value="">Sélectionner</option>
                <option value="3">3 jours</option>
                <option value="5">5 jours</option>
                <option value="7">7 jours</option>
                <option value="10">10 jours</option>
                <option value="14">14 jours</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Notes</label>
              <textarea rows={2} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white resize-none" placeholder="Informations supplémentaires..." />
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
              <Banknote className="w-4 h-4" /> Envoyer l&apos;offre
            </button>
          </div>
        )}

        {/* Shipments Tab */}
        {activeTab === 'shipments' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 dark:text-slate-400 dark:text-slate-400 uppercase tracking-wide">Expéditions en cours</h3>
            {activeShipments.map(ship => (
              <div key={ship.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 font-mono">{ship.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1 ${statusColors[ship.status]}`}>
                    {ship.status === 'in-transit' ? (<><Truck className="w-3 h-3" /> En transit</>) : (<><CheckCircle2 className="w-3 h-3" /> Livré</>)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{ship.part}</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 dark:text-slate-400">Acheteur: {ship.buyer}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ship.departure} <ArrowRight className="w-3 h-3 text-gray-300 dark:text-slate-600" /> {ship.arrival}</span>
                  <span className="flex items-center gap-1"><Banknote className="w-3 h-3" /> {ship.value}</span>
                  <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {ship.eta}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-4 flex items-center gap-1.5"><BarChart3 className="w-4 h-4" /> Performance</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {[
                  { label: 'Demandes reçues', value: stats.requestsReceived, color: 'text-gray-900 dark:text-white' },
                  { label: 'Offres soumises', value: stats.offersSubmitted, color: 'text-blue-600' },
                  { label: 'Commandes gagnées', value: stats.ordersWon, color: 'text-green-600' },
                  { label: 'CA total', value: stats.totalRevenue, color: 'text-red-600' },
                  { label: 'Temps moyen réponse', value: stats.avgResponseTime, color: 'text-amber-600' },
                  { label: 'Taux succès', value: stats.successRate, color: 'text-green-600' },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-2 flex items-center gap-1.5"><Lightbulb className="w-4 h-4" /> Conseil Rapid</h3>
              <p className="text-xs text-gray-600 dark:text-slate-300 dark:text-slate-300">Répondez en moins de 4h pour augmenter vos chances de vente de 60%. Les vendeurs les plus rapides obtiennent 3x plus de commandes.</p>
            </div>
          </div>
        )}

        {/* Contact Rapid Pièces */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 text-center shadow-sm">
          <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">Besoin d&apos;aide ?</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 dark:text-slate-400 mb-4">Contactez l&apos;équipe Rapid Pièces</p>
          <a href="https://wa.me/22901XXYYZZ" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-md">
            <MessageSquare className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </div>

      <BottomNav role="seller" />
    </div>
  );
}
