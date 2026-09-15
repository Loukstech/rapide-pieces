import React from 'react';
import { Apple, Play, ShieldCheck, Heart, ArrowUp, Truck, CreditCard } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onOpenDownloadModal: (platform?: 'ios' | 'android' | 'all') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDownloadModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer: Logo, Value Prop & Download CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" variant="light" />
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed mt-3">
              L'application mobile de référence pour trouver, commander et recevoir vos pièces détachées automobiles certifiées en un temps record.
            </p>

            {/* Quick App Store buttons in footer */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onOpenDownloadModal('ios')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-colors text-xs font-semibold"
              >
                <Apple className="w-4 h-4" />
                <span>App Store</span>
              </button>
              <button
                onClick={() => onOpenDownloadModal('android')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-colors text-xs font-semibold"
              >
                <Play className="w-3.5 h-3.5 fill-current text-red-500" />
                <span>Google Play</span>
              </button>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">L'Application</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="hover:text-red-400 transition-colors">Fonctionnalités clés</a></li>
              <li><a href="#compatibility-demo" className="hover:text-red-400 transition-colors">Recherche par plaque</a></li>
              <li><a href="#categories" className="hover:text-red-400 transition-colors">Catalogue de pièces</a></li>
              <li><a href="#app-screens" className="hover:text-red-400 transition-colors">Écrans & Scanner IA</a></li>
              <li><a href="#how-it-works" className="hover:text-red-400 transition-colors">Comment ça marche</a></li>
            </ul>
          </div>

          {/* Col 4: Services & Garanties */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Engagements</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Compatibilité Garantie</li>
              <li className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-red-400" /> Livraison Express 24h/48h</li>
              <li>Garantie constructeur 2 ans</li>
              <li>30 jours pour changer d'avis</li>
              <li>Paiement 3x / 4x sans frais</li>
              <li>Réseau de 2 500 garagistes</li>
            </ul>
          </div>

          {/* Col 5: Support & Légal */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Assistance & Légal</h4>
            <ul className="space-y-2.5">
              <li><a href="#faq" className="hover:text-red-400 transition-colors">Foire aux questions (FAQ)</a></li>
              <li><a href="#contact" className="hover:text-red-400 transition-colors">Nous contacter</a></li>
              <li><a href="#mentions" onClick={(e) => { e.preventDefault(); alert("Mentions Légales - Rapid Pièces SAS au capital de 50 000€, immatriculée au RCS de Paris."); }} className="hover:text-red-400 transition-colors">Mentions légales</a></li>
              <li><a href="#cgu" onClick={(e) => { e.preventDefault(); alert("Conditions Générales d'Utilisation et de Vente (CGU/CGV) conformes au droit français."); }} className="hover:text-red-400 transition-colors">CGU & CGV</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Politique de Confidentialité conforme RGPD."); }} className="hover:text-red-400 transition-colors">Protection des données (RGPD)</a></li>
            </ul>
          </div>

        </div>

        {/* Middle Footer: Carrier & Payment Badges */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-900">
          
          {/* Logistics Partners */}
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transporteurs partenaires :</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px]">Chronopost 24h</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px]">DPD Express</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px]">Mondial Relay</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px]">Colissimo</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Paiements 100% sécurisés :</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px]">CB / Visa</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px]">Mastercard</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px]">Apple Pay</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px]">Google Pay</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-[10px]">3x / 4x CB</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Rapid Pièces SAS. Tous droits réservés. Conçu pour les passionnés et professionnels de l'automobile.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <span>Haut de page</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
