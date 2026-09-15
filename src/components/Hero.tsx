import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Apple, 
  Play, 
  QrCode, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ArrowRight,
  ScanLine,
  Car,
  ShoppingBag,
  MapPin,
  Clock,
  Search,
  Bell,
  Wrench,
  ChevronRight,
  BatteryCharging
} from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../lib/i18n/LanguageContext';

interface HeroProps {
  onOpenDownloadModal: (platform?: 'ios' | 'android' | 'all') => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDownloadModal }) => {
  const { t } = useLanguage();
  const [activeScreen, setActiveScreen] = useState<'home' | 'scanner' | 'catalog' | 'tracking'>('scanner');
  const [scannedPlate, setScannedPlate] = useState('AA-229-AA');

  return (
    <section className="relative pt-28 sm:pt-36 pb-20 lg:pb-32 overflow-hidden">
      {/* Dynamic Background Glows & Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-48 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 -right-48 w-[450px] h-[450px] bg-red-700/10 rounded-full blur-[130px]" />
        {/* Subtle high-tech carbon grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Value Proposition & Store CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Top Launching Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-red-500/30 text-xs font-semibold text-slate-200 shadow-lg shadow-red-950/40 mb-6 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-red-400 font-bold uppercase tracking-wider text-[11px]">{t('common.betaOpen')}</span>
              <span className="text-slate-400">•</span>
              <span>{t('common.mobileAppNo1')}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6"
            >
              {t('common.allParts')} {' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">
                {t('common.deliveredFast')}
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed mb-8"
            >
              {t('common.scanPlate')} {' '}
              <strong className="text-white font-semibold"> {t('common.compatible')} </strong> {' '}
              {t('common.certifiedOrigin')}
            </motion.p>

            {/* Key Value Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 mb-8"
            >
              <div className="flex flex-col items-center lg:items-start p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  <span>{t('common.compatibility')}</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5">{t('common.guaranteed100')}</span>
              </div>

              <div className="flex flex-col items-center lg:items-start p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Truck className="w-4 h-4 text-amber-500" />
                  <span>{t('common.delivery')}</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5">{t('common.expressDelivery')}</span>
              </div>

              <div className="flex flex-col items-center lg:items-start p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{t('common.bigBrands')}</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5">{t('common.factoryPrice')}</span>
              </div>
            </motion.div>

            {/* Accéder à l'application web (version test) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mb-5 flex justify-center lg:justify-start"
            >
              <a
                id="btn-hero-access-app"
                href="https://app.rapidpieces.com"
                className="group inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold shadow-xl shadow-red-600/30 transition-all duration-200"
              >
                <span>{t('common.accessApp')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>

            {/* Store Download CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
            >
              {/* Apple App Store */}
              <button
                id="btn-hero-appstore"
                onClick={() => onOpenDownloadModal('ios')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-red-500/60 text-white font-medium flex items-center justify-center gap-3.5 shadow-xl hover:shadow-red-950/20 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Apple className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Télécharger dans l'</div>
                  <div className="text-base font-bold text-white leading-tight">App Store</div>
                </div>
              </button>

              {/* Google Play Store */}
              <button
                id="btn-hero-googleplay"
                onClick={() => onOpenDownloadModal('android')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium flex items-center justify-center gap-3.5 shadow-xl shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-red-100 uppercase tracking-wider font-semibold">Disponible sur</div>
                  <div className="text-base font-bold text-white leading-tight">Google Play</div>
                </div>
              </button>

              {/* QR Code Quick Trigger */}
              <button
                id="btn-hero-qr"
                onClick={() => onOpenDownloadModal('all')}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
                title="Afficher le QR Code pour mobile"
                aria-label="Afficher le QR Code pour mobile"
              >
                <QrCode className="w-6 h-6" />
              </button>
            </motion.div>

            {/* Social Proof & Rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 pt-2"
            >
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-white font-bold ml-1">4.9 / 5</span>
              </div>
              <span className="text-slate-600">•</span>
              <span>Plus de 1 200 avis vérifiés</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Garantie retour 30 jours
              </span>
            </motion.div>

          </div>

          {/* Right Column: Interactive Photorealistic Phone Simulator */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Screen Selector Controller */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl mb-4 backdrop-blur-md shadow-lg max-w-sm w-full">
              <button
                id="tab-phone-scanner"
                onClick={() => setActiveScreen('scanner')}
                className={`flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeScreen === 'scanner'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Scanner</span>
              </button>

              <button
                id="tab-phone-catalog"
                onClick={() => setActiveScreen('catalog')}
                className={`flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeScreen === 'catalog'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pièces</span>
              </button>

              <button
                id="tab-phone-tracking"
                onClick={() => setActiveScreen('tracking')}
                className={`flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeScreen === 'tracking'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Suivi</span>
              </button>

              <button
                id="tab-phone-home"
                onClick={() => setActiveScreen('home')}
                className={`flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeScreen === 'home'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Garage</span>
              </button>
            </div>

            {/* Smartphone Hardware Frame Mockup */}
            <div className="relative w-[310px] sm:w-[340px] h-[640px] sm:h-[680px] bg-slate-900 border-[10px] border-slate-850 rounded-[48px] shadow-2xl shadow-red-950/50 ring-1 ring-slate-700/60 overflow-hidden flex flex-col">
              
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900/80 ring-1 ring-slate-800" />
                <div className="w-3 h-3 rounded-full bg-slate-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900/70" />
                </div>
              </div>

              {/* Status Bar */}
              <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-300 z-20 select-none">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* In-App Screen Content */}
              <div className="flex-1 bg-slate-950 text-slate-100 overflow-hidden relative flex flex-col">
                <AnimatePresence mode="wait">
                  
                  {/* SCREEN 1: SCANNER IA */}
                  {activeScreen === 'scanner' && (
                    <motion.div
                      key="screen-scanner"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col p-4 relative"
                    >
                      {/* Top bar inside app */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Logo size="sm" variant="light" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                          <Bell className="w-4 h-4 text-slate-300" />
                        </div>
                      </div>

                      {/* Camera Viewfinder Mockup */}
                      <div className="relative flex-1 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                        {/* Scanner Laser Anim */}
                        <div className="absolute inset-x-4 top-1/3 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse shadow-lg shadow-red-500" />

                        {/* Target Bounding Frame */}
                        <div className="relative z-10 w-full max-w-[240px] p-3 rounded-xl border-2 border-dashed border-red-500/80 bg-black/60 backdrop-blur-sm text-center">
                          <div className="text-[10px] uppercase font-bold text-red-400 tracking-wider mb-1">
                            Plaque détectée par IA
                          </div>
                          {/* French License Plate Graphics */}
                          <div className="inline-flex items-stretch bg-white rounded-lg border-2 border-slate-900 overflow-hidden shadow-md">
                            <div className="bg-blue-700 text-white px-2 py-1 flex flex-col items-center justify-center text-[10px] font-black">
                              <span>F</span>
                            </div>
                            <div className="px-3 py-1 text-slate-950 font-black tracking-widest text-base font-mono">
                              {scannedPlate}
                            </div>
                            <div className="bg-blue-700 text-white px-1.5 py-1 flex flex-col items-center justify-center text-[8px] font-bold">
                              <span>75</span>
                            </div>
                          </div>
                        </div>

                        {/* Detected Vehicle Pill Card */}
                        <div className="mt-4 w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-xl z-10">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-black text-white">Peugeot 208 II</div>
                              <div className="text-[10px] text-slate-400">1.2 PureTech 100ch (2021)</div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                              100% Validé
                            </span>
                          </div>
                          <button
                            id="btn-phone-see-parts"
                            onClick={() => setActiveScreen('catalog')}
                            className="mt-2.5 w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-red-600/30"
                          >
                            <span>Voir les 2 450 pièces compatibles</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Plate Selector */}
                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
                        <span>Exemples:</span>
                        <div className="flex gap-1">
                          {['AA-229-AA', 'EK-784-WZ', 'FX-312-GH'].map((p) => (
                            <button
                              key={p}
                              onClick={() => setScannedPlate(p)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                scannedPlate === p ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {p.substring(0, 6)}..
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN 2: CATALOGUE & PIÈCES */}
                  {activeScreen === 'catalog' && (
                    <motion.div
                      key="screen-catalog"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col p-4 overflow-y-auto"
                    >
                      {/* Vehicle Header Badge */}
                      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-2.5 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
                            <Car className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-white leading-tight">Peugeot 208 II</div>
                            <div className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Filtre compatibilité actif
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">AA-229-AA</span>
                      </div>

                      {/* Part Item 1: Brembo Brake Pads */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-2.5 shadow-md">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img
                              src="https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=160&q=80"
                              alt="Plaquettes de frein"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase text-red-400 tracking-wider">BREMBO</span>
                              <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">En stock</span>
                            </div>
                            <div className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                              Jeu 4 Plaquettes de Frein Avant
                            </div>
                            <div className="text-[10px] text-slate-400">Réf: P 61 127 • ECE R90</div>
                            <div className="flex items-baseline justify-between mt-2">
                              <div>
                                <span className="text-sm font-black text-white">38,90 €</span>
                                <span className="text-[10px] text-slate-500 line-through ml-1.5">56,00 €</span>
                              </div>
                              <button
                                onClick={() => setActiveScreen('tracking')}
                                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm"
                              >
                                <span>Commander</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Part Item 2: Mann Filter */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-2.5 shadow-md">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img
                              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=160&q=80"
                              alt="Filtre à huile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">MANN-FILTER</span>
                              <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Livré 24h</span>
                            </div>
                            <div className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                              Filtre à Huile Synthétique
                            </div>
                            <div className="text-[10px] text-slate-400">Réf: HU 7033 z</div>
                            <div className="flex items-baseline justify-between mt-2">
                              <div>
                                <span className="text-sm font-black text-white">9,40 €</span>
                                <span className="text-[10px] text-slate-500 line-through ml-1.5">14,50 €</span>
                              </div>
                              <button
                                onClick={() => setActiveScreen('tracking')}
                                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm"
                              >
                                <span>Ajouter</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Promise Banner */}
                      <div className="mt-auto p-2.5 rounded-xl bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-red-400" />
                          <span className="text-[10px] text-slate-200 font-medium">Livraison Demain avant 13h</span>
                        </div>
                        <span className="text-[10px] font-bold text-red-400">Gratuit dès 49€</span>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN 3: SUIVI DE COMMANDE GPS EN DIRECT */}
                  {activeScreen === 'tracking' && (
                    <motion.div
                      key="screen-tracking"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col p-4"
                    >
                      <div className="text-xs font-black text-white mb-2 flex items-center justify-between">
                        <span>Suivi de Colis en Direct</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          En cours de livraison
                        </span>
                      </div>

                      {/* Map Graphic Preview */}
                      <div className="relative h-44 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden mb-3">
                        <div className="absolute inset-0 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:12px_12px] opacity-30" />

                        {/* Simulated roads & route */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 160">
                          <path
                            d="M 30 130 Q 90 100 130 80 T 220 30"
                            fill="none"
                            stroke="#dc2626"
                            strokeWidth="3"
                            strokeDasharray="6 4"
                          />
                        </svg>

                        {/* Destination Pin */}
                        <div className="absolute top-5 right-8 flex flex-col items-center">
                          <div className="p-1.5 bg-red-600 text-white rounded-full shadow-lg shadow-red-600/50">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[9px] font-bold text-white bg-black/80 px-1.5 py-0.5 rounded mt-1">Vous</span>
                        </div>

                        {/* Moving Delivery Van */}
                        <div className="absolute bottom-10 left-12 flex flex-col items-center animate-bounce">
                          <div className="p-1.5 bg-slate-950 border border-slate-700 text-amber-400 rounded-full shadow-lg">
                            <Truck className="w-4 h-4" />
                          </div>
                          <span className="text-[8px] font-bold text-amber-400 bg-black/80 px-1 rounded mt-0.5">Livreur Rapid</span>
                        </div>
                      </div>

                      {/* Order Details Card */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">Commande #RP-84920</span>
                          <span className="text-[11px] font-bold text-white">Arrivée estimée: 11h30</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-red-400" />
                          <span>Livreur dans votre quartier (à 3 arrêts)</span>
                        </div>
                        <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                          <span>1x Plaquettes Brembo + 1x Filtre Mann</span>
                          <span className="font-bold text-emerald-400">48,30 €</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenDownloadModal('all')}
                        className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-red-600/30"
                      >
                        <span>Activer les notifications SMS</span>
                      </button>
                    </motion.div>
                  )}

                  {/* SCREEN 4: MON GARAGE */}
                  {activeScreen === 'home' && (
                    <motion.div
                      key="screen-home"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col p-4 overflow-y-auto"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Mon Garage</div>
                          <div className="text-sm font-black text-white">2 Véhicules Enregistrés</div>
                        </div>
                        <button
                          onClick={() => setActiveScreen('scanner')}
                          className="text-[10px] font-bold text-red-400 bg-red-600/10 border border-red-500/30 px-2 py-1 rounded-lg"
                        >
                          + Ajouter
                        </button>
                      </div>

                      {/* Car Card 1 */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-2.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black text-white">Peugeot 208 II GT</span>
                          <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">AA-229-AA</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mb-2">1.2 PureTech • 38 400 km</div>
                        <div className="bg-slate-950/80 rounded-lg p-2 flex items-center justify-between text-[10px]">
                          <span className="text-amber-400 flex items-center gap-1">
                            <Wrench className="w-3 h-3" />
                            Prochaine vidange dans 1 600 km
                          </span>
                          <button
                            onClick={() => setActiveScreen('catalog')}
                            className="text-red-400 font-bold hover:underline"
                          >
                            Commander pack
                          </button>
                        </div>
                      </div>

                      {/* Car Card 2 */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-2.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black text-white">Volkswagen Golf VII</span>
                          <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">FX-312-GH</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mb-2">2.0 TDI 150ch Carat • 84 200 km</div>
                        <div className="bg-slate-950/80 rounded-lg p-2 flex items-center justify-between text-[10px]">
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Entretien à jour
                          </span>
                          <button
                            onClick={() => setActiveScreen('catalog')}
                            className="text-slate-300 font-bold hover:underline"
                          >
                            Voir pièces
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>

                {/* In-App Bottom Navigation Bar */}
                <div className="bg-slate-900/95 border-t border-slate-800/90 py-2.5 px-4 flex items-center justify-around text-slate-400">
                  <button onClick={() => setActiveScreen('home')} className={activeScreen === 'home' ? 'text-red-500' : 'text-slate-400'}>
                    <Car className="w-4 h-4 mx-auto" />
                    <span className="text-[8px] font-bold block mt-0.5">Garage</span>
                  </button>
                  <button onClick={() => setActiveScreen('scanner')} className={activeScreen === 'scanner' ? 'text-red-500' : 'text-slate-400'}>
                    <ScanLine className="w-4 h-4 mx-auto" />
                    <span className="text-[8px] font-bold block mt-0.5">Scanner</span>
                  </button>
                  <button onClick={() => setActiveScreen('catalog')} className={activeScreen === 'catalog' ? 'text-red-500' : 'text-slate-400'}>
                    <ShoppingBag className="w-4 h-4 mx-auto" />
                    <span className="text-[8px] font-bold block mt-0.5">Boutique</span>
                  </button>
                  <button onClick={() => setActiveScreen('tracking')} className={activeScreen === 'tracking' ? 'text-red-500' : 'text-slate-400'}>
                    <Truck className="w-4 h-4 mx-auto" />
                    <span className="text-[8px] font-bold block mt-0.5">Suivi</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Interactive hint under mockup */}
            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Cliquez sur les onglets ci-dessus pour tester l'interface mobile</span>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
