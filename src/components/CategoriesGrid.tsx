import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Disc, 
  Filter, 
  Activity, 
  Cpu, 
  Sun, 
  Zap, 
  Layers, 
  Wind, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Download,
  ShieldCheck
} from 'lucide-react';
import { CATEGORIES, BRAND_PARTNERS } from '../data/mockData';
import { CarCategory } from '../types';

interface CategoriesGridProps {
  onOpenDownloadModal: (platform?: 'ios' | 'android' | 'all') => void;
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({ onOpenDownloadModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<CarCategory>(CATEGORIES[0]);

  // Icon selector mapping
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Disc': return <Disc className="w-6 h-6 text-red-500" />;
      case 'Filter': return <Filter className="w-6 h-6 text-amber-500" />;
      case 'Activity': return <Activity className="w-6 h-6 text-blue-500" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-orange-500" />;
      case 'Sun': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'Zap': return <Zap className="w-6 h-6 text-emerald-500" />;
      case 'Layers': return <Layers className="w-6 h-6 text-purple-500" />;
      case 'Wind': return <Wind className="w-6 h-6 text-rose-500" />;
      default: return <Disc className="w-6 h-6 text-red-500" />;
    }
  };

  return (
    <section id="categories" className="py-20 lg:py-32 relative bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Catalogue & Pièces Auto
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Toutes les pièces de votre auto, <br />
            <span className="text-red-500">disponibles en 1 clic</span>
          </h2>
          <p className="text-base text-slate-300 mt-4 leading-relaxed">
            De la révision classique au remplacement d'éléments mécaniques complexes, accédez à un stock de plus de 500 000 pièces certifiées.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {CATEGORIES.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                selectedCategory.id === category.id
                  ? 'bg-slate-900 border-red-500 shadow-xl shadow-red-950/30 ring-2 ring-red-500/30'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {renderCategoryIcon(category.iconName)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                    {category.itemCount}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {category.shortDesc}
                </p>
              </div>

              {/* Popular items chips */}
              <div className="space-y-1.5 pt-3 border-t border-slate-800/60">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Top commandes:</span>
                <div className="flex flex-wrap gap-1">
                  {category.popularParts.slice(0, 2).map((part, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-slate-300 bg-slate-950/80 border border-slate-800 px-2 py-0.5 rounded-md"
                    >
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Category Spotlight Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 mb-20">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              Catégorie Phare
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              {selectedCategory.name} - Pièces certifiées origine & équipementiers
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl mb-6">
              {selectedCategory.shortDesc}. Retrouvez l'intégralité des références disponibles sur l'application Rapid Pièces avec filtre de compatibilité automatique.
            </p>

            <div className="flex flex-wrap gap-2">
              {selectedCategory.popularParts.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
            <button
              onClick={() => onOpenDownloadModal('all')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Commander sur l'app</span>
            </button>
            <span className="text-[11px] text-center text-slate-400 font-medium">
              Livraison 24h disponible sur toute la gamme
            </span>
          </div>
        </div>

        {/* OEM Equipment Brands Partners Carousel / Grid */}
        <div className="text-center">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-8">
            En partenariat direct avec les plus grands équipementiers mondiaux
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {BRAND_PARTNERS.map((brand) => (
              <div
                key={brand.name}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col items-center justify-center text-center group"
              >
                <span className="text-base sm:text-lg font-black text-white group-hover:text-red-400 transition-colors tracking-tight">
                  {brand.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {brand.category}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
