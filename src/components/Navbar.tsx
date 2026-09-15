import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Download, Sparkles, Apple, Play, ChevronRight, PhoneCall, UserPlus } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenDownloadModal: (platform?: 'ios' | 'android' | 'all') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDownloadModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Fonctionnalités', href: '#features' },
    { name: 'Recherche Plaque', href: '#compatibility-demo' },
    { name: 'Catégories', href: '#categories' },
    { name: 'L\'Application', href: '#app-screens' },
    { name: 'Comment ça marche', href: '#how-it-works' },
    { name: 'Avis & FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/40 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a href="#" className="flex items-center group" aria-label="Accueil Rapid Pièces">
              <Logo size="md" variant="light" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden 2xl:flex items-center gap-0.5 xl:gap-1 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="whitespace-nowrap px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Quick direct download store badges */}
              <div className="hidden 2xl:flex items-center gap-1.5 pr-2 border-r border-slate-800">
                <button
                  id="nav-quick-ios"
                  onClick={() => onOpenDownloadModal('ios')}
                  aria-label="Télécharger sur iOS"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-red-500/50 transition-colors"
                  title="Télécharger sur l'App Store"
                >
                  <Apple className="w-4 h-4" />
                </button>
                <button
                  id="nav-quick-android"
                  onClick={() => onOpenDownloadModal('android')}
                  aria-label="Télécharger sur Android"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-red-500/50 transition-colors"
                  title="Télécharger sur Google Play"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-red-500" />
                </button>
              </div>

              {/* Register Button (Vendeur & Acheteur) — mène vers la vraie application */}
              <a
                id="btn-nav-register"
                href="https://app.rapidpieces.com/login"
                className="whitespace-nowrap px-4 py-2.5 rounded-full border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold hover:text-white hover:border-red-500/50 hover:bg-slate-900 transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>S'enregistrer</span>
              </a>

              {/* Main Download Button */}
              <button
                id="btn-nav-download"
                onClick={() => onOpenDownloadModal('all')}
                className="relative group overflow-hidden px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/25 hover:shadow-red-600/40 transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                <span>Télécharger l'App</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white ml-1">
                  Gratuit
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 2xl:hidden">
              <button
                id="btn-mobile-download-icon"
                onClick={() => onOpenDownloadModal('all')}
                className="p-2 rounded-xl bg-red-600 text-white shadow-md sm:hidden"
                aria-label="Télécharger"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                id="btn-toggle-mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[70px] z-30 bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 p-6 2xl:hidden shadow-2xl max-h-[calc(100vh-70px)] overflow-y-auto"
          >
            <div className="flex flex-col space-y-3 mb-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-200 font-medium text-sm hover:bg-red-600/10 hover:border-red-500/30 hover:text-red-400 transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </a>
              ))}
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <a
                id="btn-mobile-drawer-register"
                href="https://app.rapidpieces.com/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>S'enregistrer (Vendeur ou Acheteur)</span>
              </a>

              <button
                id="btn-mobile-drawer-download"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDownloadModal('all');
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger pour iOS & Android</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-mobile-drawer-ios"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDownloadModal('ios');
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
                >
                  <Apple className="w-4 h-4" />
                  <span>App Store</span>
                </button>
                <button
                  id="btn-mobile-drawer-android"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDownloadModal('android');
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-red-500" />
                  <span>Google Play</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
