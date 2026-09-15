import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  AlertCircle, 
  Star, 
  ChevronRight, 
  Car, 
  Fuel, 
  Calendar, 
  Gauge, 
  Sparkles,
  Download,
  Info
} from 'lucide-react';
import { DEMO_VEHICLES } from '../data/mockData';
import { DemoVehicle, CompatiblePart } from '../types';

interface CompatibilitySearchDemoProps {
  onOpenDownloadModal: (platform?: 'ios' | 'android' | 'all') => void;
}

export const CompatibilitySearchDemo: React.FC<CompatibilitySearchDemoProps> = ({ onOpenDownloadModal }) => {
  const [inputPlate, setInputPlate] = useState('AA-229-AA');
  const [selectedVehicle, setSelectedVehicle] = useState<DemoVehicle>(DEMO_VEHICLES[0]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Tous');
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuccess, setSearchSuccess] = useState(true);

  // Format license plate with hyphens as user types
  const handlePlateChange = (val: string) => {
    // Uppercase and clean
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2 && cleaned.length <= 5) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    } else if (cleaned.length > 5) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5, 7)}`;
    }
    setInputPlate(formatted);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    setTimeout(() => {
      const match = DEMO_VEHICLES.find(
        (v) => v.plate.replace(/-/g, '').toLowerCase() === inputPlate.replace(/-/g, '').toLowerCase()
      );

      if (match) {
        setSelectedVehicle(match);
        setSearchSuccess(true);
      } else {
        // Fallback to first vehicle with customized plate info
        const simulated: DemoVehicle = {
          plate: inputPlate || 'AA-229-AA',
          brand: 'Véhicule Identifié',
          model: 'Motorisation Reconnue',
          version: 'Base SIV Officielle Certifiée',
          year: 2022,
          fuel: 'Essence / Hybride',
          power: '130 CH (96 kW)',
          compatibleParts: DEMO_VEHICLES[0].compatibleParts,
        };
        setSelectedVehicle(simulated);
        setSearchSuccess(true);
      }
      setIsSearching(false);
    }, 450);
  };

  const handleSelectPredefined = (veh: DemoVehicle) => {
    setInputPlate(veh.plate);
    setSelectedVehicle(veh);
    setSearchSuccess(true);
  };

  const categories = ['Tous', 'Freinage', 'Filtration', 'Moteur', 'Suspension', 'Éclairage', 'Électrique'];

  const filteredParts = selectedVehicle.compatibleParts.filter((part) => {
    if (selectedCategoryFilter === 'Tous') return true;
    return part.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
  });

  return (
    <section id="compatibility-demo" className="py-20 lg:py-28 relative bg-slate-950/80 border-t border-b border-slate-800/80">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Démonstrateur Interactif
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Testez la recherche par <span className="text-red-500">plaque d’immatriculation</span>
          </h2>
          <p className="text-base text-slate-300 mt-4 leading-relaxed">
            Dans l'application Rapid Pièces, une simple saisie ou scan de votre plaque affiche instantanément les pièces techniques adaptées à votre motorisation exacte.
          </p>
        </div>

        {/* Search Simulator Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/60 max-w-5xl mx-auto mb-12">
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4 mb-6">
            
            {/* French License Plate Input Field */}
            <div className="relative w-full md:w-auto flex-1">
              <div className="flex items-stretch bg-white border-2 border-slate-800 rounded-2xl overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-red-500 transition-all">
                {/* Left Blue Band (F) */}
                <div className="bg-blue-700 text-white px-3 sm:px-4 py-3 flex flex-col items-center justify-center font-black select-none">
                  <span className="text-[10px] sm:text-xs">★ ★ ★</span>
                  <span className="text-xs sm:text-sm">F</span>
                </div>

                {/* Plate Text Input */}
                <input
                  id="input-license-plate"
                  type="text"
                  maxLength={9}
                  placeholder="AA-229-AA"
                  value={inputPlate}
                  onChange={(e) => handlePlateChange(e.target.value)}
                  className="flex-1 px-4 py-3 text-xl sm:text-2xl font-black tracking-widest text-slate-900 font-mono text-center uppercase placeholder-slate-400 focus:outline-none"
                />

                {/* Right Blue Band (Region 75) */}
                <div className="bg-blue-700 text-white px-2.5 sm:px-3.5 py-3 flex flex-col items-center justify-center font-bold select-none border-l border-blue-800">
                  <span className="text-[8px] sm:text-[9px] uppercase font-semibold">IDF</span>
                  <span className="text-xs sm:text-sm font-black">75</span>
                </div>
              </div>
            </div>

            {/* Search Action Button */}
            <button
              id="btn-search-plate-demo"
              type="submit"
              disabled={isSearching}
              className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Identifier mon véhicule</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Predefined vehicle pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Car className="w-3.5 h-3.5" />
              Exemples rapides :
            </span>
            {DEMO_VEHICLES.map((veh) => (
              <button
                key={veh.plate}
                id={`btn-select-vehicle-${veh.plate}`}
                onClick={() => handleSelectPredefined(veh)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  selectedVehicle.plate === veh.plate
                    ? 'bg-red-600/20 border-red-500/50 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="font-mono font-bold text-red-400 mr-1.5">{veh.plate}</span>
                <span>{veh.brand} {veh.model}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Vehicle Identity & Results Showcase */}
        <AnimatePresence mode="wait">
          {searchSuccess && (
            <motion.div
              key={selectedVehicle.plate}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Identified Vehicle Card */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
                
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 flex-shrink-0">
                    <Car className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Véhicule 100% Identifié
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {selectedVehicle.plate}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {selectedVehicle.brand} {selectedVehicle.model}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                      {selectedVehicle.version}
                    </p>
                  </div>
                </div>

                {/* Vehicle Tech Badges */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 sm:p-4">
                  <div className="flex flex-col items-center text-center px-2">
                    <Calendar className="w-4 h-4 text-slate-400 mb-1" />
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Année</span>
                    <span className="text-xs sm:text-sm font-bold text-white">{selectedVehicle.year}</span>
                  </div>
                  <div className="flex flex-col items-center text-center px-2 border-x border-slate-800">
                    <Fuel className="w-4 h-4 text-amber-400 mb-1" />
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Carburant</span>
                    <span className="text-xs sm:text-sm font-bold text-white">{selectedVehicle.fuel}</span>
                  </div>
                  <div className="flex flex-col items-center text-center px-2">
                    <Gauge className="w-4 h-4 text-red-400 mb-1" />
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Puissance</span>
                    <span className="text-xs sm:text-sm font-bold text-white">{selectedVehicle.power}</span>
                  </div>
                </div>

              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategoryFilter === cat
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Compatible Parts Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredParts.map((part) => (
                  <div
                    key={part.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col group hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-black/40"
                  >
                    {/* Part Image & Brand Banner */}
                    <div className="relative h-44 bg-slate-950 flex items-center justify-center overflow-hidden p-4">
                      <img
                        src={part.image}
                        alt={part.name}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-sm border border-slate-800 text-[10px] font-black uppercase tracking-wider text-red-400">
                        {part.brand}
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-sm border border-emerald-500/40 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Compatible
                      </div>
                    </div>

                    {/* Part Details */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-mono">Réf : {part.reference}</div>
                        <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors mt-1 leading-snug line-clamp-2">
                          {part.name}
                        </h4>

                        {/* Specs Bullets */}
                        <div className="mt-3 space-y-1">
                          {part.specifications.slice(0, 2).map((spec, i) => (
                            <div key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-red-500"></span>
                              <span>{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price, Delivery & Action */}
                      <div className="mt-4 pt-4 border-t border-slate-800/80">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-lg font-black text-white leading-tight">
                              {part.price.toFixed(2)} €
                            </div>
                            {part.originalPrice && (
                              <span className="text-xs text-slate-500 line-through">
                                {part.originalPrice.toFixed(2)} €
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-1">
                              <Truck className="w-3 h-3" />
                              {part.deliveryTime}
                            </span>
                            <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{part.rating} ({part.reviewsCount})</span>
                            </div>
                          </div>
                        </div>

                        <button
                          id={`btn-order-part-${part.id}`}
                          onClick={() => onOpenDownloadModal('all')}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Commander sur l'application</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Notice on database */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>
                    Base de données connectée en direct aux données constructeurs (SIV / VIN) pour une précision de 99.8%.
                  </span>
                </div>
                <button
                  onClick={() => onOpenDownloadModal('all')}
                  className="text-red-400 hover:text-red-300 font-bold underline flex items-center gap-1 flex-shrink-0"
                >
                  Télécharger l'application pour tester votre voiture
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
