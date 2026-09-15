import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  ScanLine, 
  Car, 
  ShoppingBag, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight,
  Download,
  Layers
} from 'lucide-react';
import { APP_FEATURES } from '../data/mockData';

interface AppScreensShowcaseProps {
  onOpenDownloadModal: (platform?: 'ios' | 'android' | 'all') => void;
}

export const AppScreensShowcase: React.FC<AppScreensShowcaseProps> = ({ onOpenDownloadModal }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const screens = [
    {
      id: 'scanner-screen',
      title: 'Scanner IA Intelligent',
      subtitle: 'Identification instantanée de véhicule',
      desc: 'Pointez la caméra sur une plaque d’immatriculation française ou le numéro VIN à 17 caractères de votre carte grise. L’application extrait les données techniques certifiées en moins de 0.5 seconde.',
      highlights: [
        'Reconnaissance automatique par caméra',
        'Compatibilité avec tous les formats de plaques (SIV & FNI)',
        'Accès instantané aux 2 500+ pièces associées',
        'Historique des scans récents mémorisé'
      ],
      badge: 'Technologie Propriétaire',
      accentColor: 'text-red-500',
      imagePreview: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'garage-screen',
      title: 'Garage Virtuel & Alertes Révisions',
      subtitle: 'Gestion multi-véhicules simplifiée',
      desc: 'Ajoutez votre voiture, celle de votre conjoint(e) ou votre flotte d’entreprise. L’application calcule l’usure prévisionnelle des consommables (freins, filtres, distribution) selon votre kilométrage.',
      highlights: [
        'Sauvegarde illimitée de véhicules',
        'Rappels automatiques de vidange & contrôle technique',
        'Factures et garanties centralisées au même endroit',
        'Partage facile avec votre garagiste'
      ],
      badge: 'Gestion Centralisée',
      accentColor: 'text-amber-500',
      imagePreview: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'catalog-screen',
      title: 'Catalogue Express & Vues Éclatées',
      subtitle: 'Des fiches techniques ultra complètes',
      desc: 'Découvrez les pièces avec leurs dimensions au millimètre près, leurs équivalences constructeur OEM et des schémas d’assemblage clairs pour ne jamais vous tromper.',
      highlights: [
        'Vues éclatées et schémas techniques 3D',
        'Comparateur de marques (Bosch vs Brembo vs Valeo)',
        'Guides et tutoriels vidéo de montage pas-à-pas',
        'Paiement en 1 clic via Apple Pay et Google Pay'
      ],
      badge: '500 000+ Références',
      accentColor: 'text-blue-500',
      imagePreview: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'tracking-screen',
      title: 'Livraison Express & Suivi GPS',
      subtitle: 'Vos pièces livrées en 24h chrono',
      desc: 'Suivez le coursier en direct sur la carte jusqu’à la remise en main propre. Choisissez de vous faire livrer à domicile, au travail ou directement dans un garage partenaire.',
      highlights: [
        'Livraison 24h ouvrées garantie partout en France',
        'Suivi GPS en temps réel du véhicule de livraison',
        'Créneaux de livraison précis de 2 heures',
        'Remise sans contact ou code sécurisé'
      ],
      badge: 'Livraison 24h',
      accentColor: 'text-emerald-500',
      imagePreview: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const current = screens[activeTab];

  return (
    <section id="app-screens" className="py-20 lg:py-32 relative bg-slate-950/80 border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Smartphone className="w-3.5 h-3.5" />
            L'Expérience Mobile
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Une application pensée pour <br />
            <span className="text-red-500">les automobilistes et pros</span>
          </h2>
          <p className="text-base text-slate-300 mt-4 leading-relaxed">
            Découvrez une interface moderne, ultra-rapide et sécurisée conçue avec les dernières technologies mobiles.
          </p>
        </div>

        {/* Tab Navigation Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-12">
          {screens.map((screen, idx) => (
            <button
              key={screen.id}
              onClick={() => setActiveTab(idx)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                activeTab === idx
                  ? 'bg-slate-900 border-red-500 shadow-xl shadow-red-950/40 ring-1 ring-red-500/50'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block mb-1 ${
                activeTab === idx ? screen.accentColor : 'text-slate-500'
              }`}>
                0{idx + 1}. {screen.badge}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white block">
                {screen.title}
              </span>
            </button>
          ))}
        </div>

        {/* Active Screen Feature Showcase Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl grid lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Description Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>{current.subtitle}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
                {current.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                {current.desc}
              </p>

              {/* Checklist Highlights */}
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {current.highlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => onOpenDownloadModal('all')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Essayer sur l'application</span>
                </button>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  Compatible iOS 15+ et Android 9+
                </span>
              </div>
            </div>

            {/* Right Visual Image / Mockup Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-slate-700/80 shadow-2xl shadow-black/80 bg-slate-950 group">
                <img
                  src={current.imagePreview}
                  alt={current.title}
                  className="w-full h-80 sm:h-96 object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Floating Tag Card */}
                <div className="absolute bottom-6 inset-x-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-red-400">Fonctionnalité V1.0</div>
                      <div className="text-sm font-bold text-white">{current.title}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
