'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Phone, MessageSquare, AlertTriangle, Lock, Eye, BarChart3, Bot } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const conversations = [
  {
    id: 1,
    seller: 'BigMoteurs',
    sellerMasked: 'Vendeur #BM-2847',
    lastMessage: 'La pièce est disponible. Je peux livrer aujourd\'hui.',
    time: 'Il y a 15 min',
    unread: 2,
    part: 'Plaquettes de frein avant',
    status: 'active',
  },
  {
    id: 2,
    seller: 'Sotra Pièces',
    sellerMasked: 'Vendeur #SP-1293',
    lastMessage: 'J\'ai confirmé la disponibilité. Prix final : 38 000 FCFA.',
    time: 'Il y a 1h',
    unread: 0,
    part: 'Filtre à huile',
    status: 'active',
  },
];

const antiContournementRules = [
  { icon: <Lock className="w-5 h-5 text-gray-400" />, title: 'Coordonnées masquées', desc: 'Numéros de téléphone, WhatsApp, emails sont automatiquement cachés.' },
  { icon: <Bot className="w-5 h-5 text-gray-400" />, title: 'Détection automatique', desc: 'Le système détecte et remplace les coordonnées partagées dans les messages.' },
  { icon: <Shield className="w-5 h-5 text-gray-400" />, title: 'Rapid Protection', desc: 'En achetant via la plateforme, vous bénéficiez de la garantie et du retour.' },
  { icon: <BarChart3 className="w-5 h-5 text-gray-400" />, title: 'Historique garanti', desc: 'Chaque transaction est enregistrée pour votre historique véhicule.' },
];

export default function WhatsAppContactPage() {
  const { t } = useLanguage();
  const [selectedConvo, setSelectedConvo] = useState<typeof conversations[0] | null>(null);
  const [message, setMessage] = useState('');
  const [blockedAttempt, setBlockedAttempt] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    // Check for contact info
    const contactPatterns = /\b\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}\b|whatsapp|telegram|@|\.com|\.fr|facebook/i;
    if (contactPatterns.test(message)) {
      setBlockedAttempt(true);
      setTimeout(() => setBlockedAttempt(false), 3000);
      return;
    }
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-rp-bg pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white">{t('whatsappContact.title')}</h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500">{t('whatsappContact.subtitle')}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* Anti-contournement banner */}
        <div className="bg-gradient-to-br from-blue-900/30 to-slate-900 rounded-2xl p-5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold text-blue-400">{t('whatsappContact.protectedLabel')}</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-300 mb-4">{t('whatsappContact.protectedNotice')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {antiContournementRules.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3">
                {r.icon}
                <div className="text-[10px] font-bold text-gray-900 dark:text-white mt-1">{r.title}</div>
                <div className="text-[9px] text-gray-400 dark:text-slate-500 mt-0.5">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversations */}
        {!selectedConvo ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Conversations</h3>
            {conversations.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedConvo(c)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-left hover:border-red-200 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{c.sellerMasked}</span>
                        {c.unread > 0 && <span className="w-4 h-4 bg-red-600 text-white text-[8px] rounded-full flex items-center justify-center font-bold">{c.unread}</span>}
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500">{c.time}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{c.part}</p>
                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 truncate">{c.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Chat view */
          <div className="space-y-4">
            {/* Chat header */}
            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 flex items-center gap-3">
              <button onClick={() => setSelectedConvo(null)} className="text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:text-white">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 bg-red-600/20 rounded-full flex items-center justify-center">
                <Lock className="w-3 h-3 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-gray-900 dark:text-white">{selectedConvo.sellerMasked}</div>
                <div className="text-[10px] text-emerald-400"><span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" /> En ligne</div>
              </div>
              <Shield className="w-4 h-4 text-blue-400" />
            </div>

            {/* Warning */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-[10px] text-amber-300">Les numéros de téléphone et coordonnées sont automatiquement masqués pour votre protection.</p>
            </div>

            {/* Messages */}
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl rounded-tl-sm p-3 max-w-[80%]">
                <p className="text-xs text-gray-900 dark:text-white">{selectedConvo.lastMessage}</p>
                <span className="text-[9px] text-gray-400 dark:text-slate-500 mt-1 block">{selectedConvo.time}</span>
              </div>
              <div className="bg-red-600/20 border border-red-200 rounded-xl rounded-tr-sm p-3 max-w-[80%] ml-auto">
                <p className="text-xs text-gray-900 dark:text-white">Bonjour, je suis intéressé. Quel est le prix final ?</p>
                <span className="text-[9px] text-gray-400 dark:text-slate-500 mt-1 block text-right">Il y a 20 min</span>
              </div>
            </div>

            {/* Blocked attempt */}
            {blockedAttempt && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-[10px] text-red-300">Coordonnées détectées et masquées. Utilisez la plateforme pour toute transaction.</p>
              </div>
            )}

            {/* Quick replies */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['Quel est le prix ?', 'Disponible maintenant ?', 'Livraison possible ?', 'Garantie ?'].map((q) => (
                <button
                  key={q}
                  onClick={() => setMessage(q)}
                  className="shrink-0 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full px-3 py-1.5 text-[10px] text-gray-600 dark:text-slate-300 hover:border-red-200 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Votre message..."
                className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary"
              />
              <button
                onClick={handleSend}
                className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-600-dark transition-all"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
