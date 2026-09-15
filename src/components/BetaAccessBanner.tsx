import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Gift, CheckCircle2, Apple, Play, Send, Copy, ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

export const BetaAccessBanner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [device, setDevice] = useState<'ios' | 'android'>('android');
  const [submitted, setSubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard?.writeText('RAPID15');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      
      {/* Background Accent Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-red-600/20 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-red-500/40 p-8 sm:p-12 lg:p-16 shadow-2xl shadow-red-950/40 overflow-hidden">
          
          {/* Top Decorative Speed Streak */}
          <div className="absolute top-0 right-0 w-96 h-1 bg-gradient-to-l from-red-500 via-amber-500 to-transparent" />

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Gift className="w-3.5 h-3.5" />
                Offre Spéciale Lancement
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-4">
                Recevez <span className="text-red-500">-15% sur votre 1ère commande</span> en avant-première
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                Inscrivez-vous pour être averti en priorité dès la mise en ligne sur l'App Store et Google Play. Nous vous enverrons immédiatement votre coupon VIP réservé aux premiers inscrits.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Aucun spam garanti</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Coupon valable sur tout le catalogue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Accès bêta testeur privé</span>
                </div>
              </div>
            </div>

            {/* Right Registration Form Card */}
            <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              {submitted ? (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Inscription VIP Confirmée !</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Votre code promotionnel de <strong>-15%</strong> a été généré :
                    </p>
                  </div>

                  {/* Coupon Box */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border-2 border-dashed border-red-500 flex items-center justify-between">
                    <span className="font-mono text-lg font-black tracking-widest text-red-400">
                      RAPID15
                    </span>
                    <button
                      onClick={handleCopyCoupon}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Un email de confirmation vous a été envoyé avec les liens d'installation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Votre appareil mobile
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDevice('ios')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                          device === 'ios'
                            ? 'bg-slate-900 border-red-500 text-white'
                            : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Apple className="w-3.5 h-3.5" />
                        <span>iPhone (iOS)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDevice('android')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                          device === 'android'
                            ? 'bg-slate-900 border-red-500 text-white'
                            : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current text-red-500" />
                        <span>Android</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Adresse Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jean.dupont@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all"
                  >
                    <span>Recevoir mon code -15% & l'accès prioritaire</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Données protégées • Désinscription en 1 clic</span>
                  </div>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
