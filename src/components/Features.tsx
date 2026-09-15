import React from 'react';
import { motion } from 'motion/react';
import { 
  ScanLine, 
  Truck, 
  ShieldCheck, 
  Coins, 
  Car, 
  Wrench, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  Headset,
  Check
} from 'lucide-react';
import { KEY_STATS } from '../data/mockData';

interface FeaturesProps {
  onOpenDownloadModal: (platform?: 'ios' | 'android' | 'all') => void;
}

export const Features: React.FC<FeaturesProps> = ({ onOpenDownloadModal }) => {
  const mainFeatures = [
    {
      icon: ScanLine,
      badge: 'Zéro Erreur',
      title: 'Scanner Intelligent Plaque & VIN',
      description: 'Prenez en photo votre plaque ou carte grise. L\'algorithme détecte en une fraction de seconde la motorisation exacte et filtre le catalogue pour éliminer tout risque d\'erreur.',
      color: 'from-red-600/20 to-red-950/40',
      border: 'border-red-500/30',
      iconColor: 'text-red-500',
    },
    {
      icon: Truck,
      badge: '24h Garanti',
      title: 'Livraison Ultra-Rapide 24/48h',
      description: 'Commandez avant 18h et recevez vos colis dès le lendemain matin chez vous, en point relais ou directement chez votre garagiste avec géolocalisation en temps réel.',
      color: 'from-amber-600/20 to-amber-950/40',
      border: 'border-amber-500/30',
      iconColor: 'text-amber-500',
    },
    {
      icon: ShieldCheck,
      badge: 'Origine Certifiée',
      title: '500 000+ Pièces Sous Garantie Constructeur',
      description: 'Toutes nos références proviennent des plus grands équipementiers mondiaux (Bosch, Brembo, Valeo, Sachs, Mann-Filter) et bénéficient d\'une garantie de 2 ans.',
      color: 'from-blue-600/20 to-blue-950/40',
      border: 'border-blue-500/30',
      iconColor: 'text-blue-500',
    },
    {
      icon: Coins,
      badge: 'Prix Juste',
      title: 'Jusqu\'à 60% d\'Économie vs Concession',
      description: 'En supprimant les intermédiaires superflus, Rapid Pièces vous fait profiter des meilleurs tarifs du marché avec paiements échelonnés en 3x ou 4x sans frais.',
      color: 'from-emerald-600/20 to-emerald-950/40',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Car,
      badge: 'Multi-Véhicules',
      title: 'Garage Virtuel & Carnet d\'Entretien',
      description: 'Gérez l\'ensemble de vos véhicules de famille ou de société dans l\'application. Recevez des alertes automatiques pour vos futures vidanges, courroies et révisions.',
      color: 'from-purple-600/20 to-purple-950/40',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-500',
    },
    {
      icon: Headset,
      badge: '6j / 7',
      title: 'Conseillers Mécaniciens Dédiés',
      description: 'Un doute technique sur un diamètre de disque ou une référence OEM ? Nos techniciens mécaniciens sont joignables directement par chat dans l\'application.',
      color: 'from-rose-600/20 to-rose-950/40',
      border: 'border-rose-500/30',
      iconColor: 'text-rose-500',
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            L'Excellence Automobile
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Pourquoi choisir l'application <br />
            <span className="text-red-500">Rapid Pièces</span> ?
          </h2>
          <p className="text-base text-slate-300 mt-4 leading-relaxed">
            Nous avons conçu l'expérience d'achat de pièces auto la plus simple, la plus fiable et la plus rapide du marché.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {mainFeatures.map((feat, index) => {
            const IconComp = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group relative p-6 sm:p-8 rounded-3xl bg-slate-900/80 border ${feat.border} hover:border-red-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-950/20 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} border border-slate-700/60 flex items-center justify-center ${feat.iconColor} group-hover:scale-110 transition-transform`}>
                      <IconComp className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-extrabold text-white group-hover:text-red-400 transition-colors mb-3 leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Bottom link */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-red-400 transition-colors">
                  <span>En savoir plus</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Key Metrics Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {KEY_STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base font-bold text-white mt-2">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
