import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, CheckCircle, Apple, Play, QrCode, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlatform?: 'ios' | 'android' | 'all';
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  defaultPlatform = 'all',
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android'>(
    defaultPlatform === 'ios' ? 'ios' : 'android'
  );
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;
    setSubmitted(true);
    setTimeout(() => {
      // Keep state
    }, 4000);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Top colored accent bar */}
          <div className="h-2 w-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500" />

          {/* Close button */}
          <button
            id="close-download-modal"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center max-w-lg mx-auto mb-8">
              <div className="flex justify-center mb-4">
                <Logo size="md" variant="light" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                Accès Bêta & Sortie Officielle
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Télécharger l'application <span className="text-red-500">Rapid Pièces</span>
              </h3>
              <p className="text-sm text-slate-300 mt-2">
                Scannez le QR Code avec votre téléphone ou téléchargez directement depuis votre store d'applications.
              </p>
            </div>

            {/* Platform Selector Tabs */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl mb-6">
              <button
                id="select-platform-ios"
                onClick={() => setSelectedPlatform('ios')}
                className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  selectedPlatform === 'ios'
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Apple className="w-5 h-5" />
                <span>iOS (iPhone / iPad)</span>
              </button>
              <button
                id="select-platform-android"
                onClick={() => setSelectedPlatform('android')}
                className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  selectedPlatform === 'android'
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Android (Google Play)</span>
              </button>
            </div>

            {/* QR Code & Store Links Section */}
            <div className="grid sm:grid-cols-2 gap-6 items-center bg-slate-950/50 border border-slate-800/80 rounded-2xl p-6 mb-6">
              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner text-slate-900 text-center">
                <div className="p-2 bg-white rounded-xl">
                  {/* Generated clean SVG QR representation */}
                  <svg
                    viewBox="0 0 160 160"
                    width="140"
                    height="140"
                    className="w-32 h-32 sm:w-36 sm:h-36"
                  >
                    <rect width="160" height="160" fill="#ffffff" />
                    {/* Corner 1 */}
                    <rect x="10" y="10" width="40" height="40" rx="6" fill="#0f172a" />
                    <rect x="18" y="18" width="24" height="24" rx="3" fill="#ffffff" />
                    <rect x="24" y="24" width="12" height="12" rx="2" fill="#dc2626" />

                    {/* Corner 2 */}
                    <rect x="110" y="10" width="40" height="40" rx="6" fill="#0f172a" />
                    <rect x="118" y="18" width="24" height="24" rx="3" fill="#ffffff" />
                    <rect x="124" y="24" width="12" height="12" rx="2" fill="#dc2626" />

                    {/* Corner 3 */}
                    <rect x="10" y="110" width="40" height="40" rx="6" fill="#0f172a" />
                    <rect x="18" y="118" width="24" height="24" rx="3" fill="#ffffff" />
                    <rect x="24" y="124" width="12" height="12" rx="2" fill="#dc2626" />

                    {/* Pattern Matrix */}
                    <rect x="60" y="15" width="8" height="8" fill="#0f172a" />
                    <rect x="75" y="15" width="14" height="8" fill="#dc2626" />
                    <rect x="60" y="30" width="12" height="12" fill="#0f172a" />
                    <rect x="80" y="30" width="8" height="20" fill="#0f172a" />
                    <rect x="15" y="60" width="10" height="10" fill="#0f172a" />
                    <rect x="30" y="65" width="16" height="8" fill="#0f172a" />
                    <rect x="55" y="60" width="20" height="10" fill="#dc2626" />
                    <rect x="85" y="60" width="12" height="12" fill="#0f172a" />
                    <rect x="105" y="65" width="16" height="8" fill="#0f172a" />
                    <rect x="130" y="60" width="15" height="15" fill="#dc2626" />

                    <rect x="60" y="80" width="14" height="14" fill="#0f172a" />
                    <rect x="80" y="80" width="16" height="8" fill="#dc2626" />
                    <rect x="105" y="80" width="10" height="20" fill="#0f172a" />
                    <rect x="125" y="85" width="20" height="8" fill="#0f172a" />

                    <rect x="60" y="105" width="20" height="10" fill="#dc2626" />
                    <rect x="90" y="105" width="12" height="12" fill="#0f172a" />
                    <rect x="60" y="125" width="10" height="20" fill="#0f172a" />
                    <rect x="80" y="125" width="15" height="15" fill="#dc2626" />
                    <rect x="105" y="120" width="20" height="10" fill="#0f172a" />
                    <rect x="135" y="125" width="15" height="15" fill="#0f172a" />

                    {/* Center Mini Car Badge */}
                    <circle cx="80" cy="80" r="14" fill="#0f172a" />
                    <circle cx="80" cy="80" r="11" fill="#dc2626" />
                    <path d="M74 81 L77 77 H83 L86 81 H74 Z" fill="#ffffff" />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-800">
                  <QrCode className="w-3.5 h-3.5 text-red-600" />
                  <span>Scanner avec l'appareil photo</span>
                </div>
              </div>

              {/* Direct Buttons & Info */}
              <div className="flex flex-col justify-center space-y-3">
                <a
                  href="#app-store"
                  id="btn-modal-appstore"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Redirection vers l'App Store (iOS) - Rapid Pièces V1.0");
                  }}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border transition-all ${
                    selectedPlatform === 'ios'
                      ? 'bg-slate-900 border-red-500/60 text-white shadow-md ring-2 ring-red-500/30'
                      : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-white">
                    <Apple className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wide">Disponible sur</div>
                    <div className="text-sm font-bold text-white">App Store (iOS)</div>
                  </div>
                </a>

                <a
                  href="#google-play"
                  id="btn-modal-googleplay"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Redirection vers le Google Play Store (Android) - Rapid Pièces V1.0");
                  }}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border transition-all ${
                    selectedPlatform === 'android'
                      ? 'bg-slate-900 border-red-500/60 text-white shadow-md ring-2 ring-red-500/30'
                      : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-red-500">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] text-slate-400 uppercase tracking-wide">Disponible sur</div>
                    <div className="text-sm font-bold text-white">Google Play Store</div>
                  </div>
                </a>

                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Version certifiée sans publicité invasive • 100% Sécurisé</span>
                </div>
              </div>
            </div>

            {/* Send Link via SMS/Email */}
            <div className="border-t border-slate-800/80 pt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-red-500" />
                  Recevoir le lien direct par SMS ou Email
                </span>
                <button
                  id="copy-site-link"
                  onClick={handleCopyLink}
                  className="text-xs text-slate-400 hover:text-red-400 underline transition-colors"
                >
                  {copied ? 'Lien copié !' : 'Copier le lien'}
                </button>
              </div>

              {submitted ? (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Lien envoyé avec succès ! Vous recevrez également votre code promo de bienvenue <strong>RAPID15</strong>.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSendLink} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="06 12 34 56 78 ou vous@email.com"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  />
                  <button
                    id="submit-send-link"
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-md shadow-red-600/20"
                  >
                    <span>Envoyer</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
