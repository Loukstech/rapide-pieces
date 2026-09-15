import React from 'react';
import { motion } from 'motion/react';
import { ScanLine, ShoppingCart, Truck, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../lib/i18n/LanguageContext';

interface HowItWorksProps {
  onOpenDownloadModal: (platform?: 'ios' | 'android' | 'all') => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenDownloadModal }) => {
  const { t } = useLanguage();
  const steps = [
    {
      number: '01',
      title: t('common.step1Title'),
      description: t('common.step1Desc'),
      icon: ScanLine,
      badge: t('common.step1Badge'),
      color: 'text-red-500',
      bgGlow: 'from-red-600/20 to-transparent',
    },
    {
      number: '02',
      title: t('common.step2Title'),
      description: t('common.step2Desc'),
      icon: ShoppingCart,
      badge: t('common.step2Badge'),
      color: 'text-amber-500',
      bgGlow: 'from-amber-600/20 to-transparent',
    },
    {
      number: '03',
      title: t('common.step3Title'),
      description: t('common.step3Desc'),
      icon: Truck,
      badge: t('common.step3Badge'),
      color: 'text-emerald-500',
      bgGlow: 'from-emerald-600/20 to-transparent',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {t('common.howItWorksBadge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {t('common.howItWorksTitle')}
          </h2>
          <p className="text-base text-slate-300 mt-4 leading-relaxed">
            {t('common.howItWorksSubtitle')}
          </p>
        </div>

        {/* Steps Grid with connector line */}
        <div className="grid md:grid-cols-3 gap-8 relative mb-16">
          {steps.map((step, index) => {
            const IconComp = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="relative bg-slate-900/80 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-red-500/50 transition-all duration-300 shadow-xl group"
              >
                {/* Step number watermark */}
                <div className="absolute top-6 right-6 text-5xl font-black text-slate-800/60 select-none group-hover:text-red-500/20 transition-colors">
                  {step.number}
                </div>

                <div>
                  {/* Icon & Badge */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
                      <IconComp className={`w-7 h-7 ${step.color}`} />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-red-400 transition-colors leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>{t('common.stepVerified')}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Confidence CTA Banner */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">{t('common.zeroRiskTitle')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('common.zeroRiskDesc')}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenDownloadModal('all')}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm whitespace-nowrap transition-colors shadow-md shadow-red-600/30 flex items-center gap-2"
          >
            <span>{t('common.downloadApp')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
