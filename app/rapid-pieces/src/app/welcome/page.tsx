'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User as UserIcon, Store, ChevronRight } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// Cahier section 3 : nouvel écran de démarrage — plus de switch Acheteur/Vendeur,
// deux grands blocs de choix ; le rôle choisi ici pilote ensuite /login (Inscription/Connexion).
export default function WelcomePage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-end">
            <LanguageSelector />
          </div>
          <Image src="/logo_rapidePiece.jpeg" alt="Rapide Pièces" width={240} height={80} className="h-20 w-auto object-contain mx-auto" priority />
          <p className="text-sm text-gray-500 dark:text-slate-400">{t('auth.whoAreYou')}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/login?role=buyer')}
            className="w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:border-red-300 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 dark:text-white">{t('auth.buyer')}</div>
              <div className="text-xs text-gray-500 dark:text-slate-400">{t('auth.buyerDescription')}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-slate-600 flex-shrink-0" />
          </button>

          <button
            onClick={() => router.push('/login?role=seller')}
            className="w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:border-red-300 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <Store className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 dark:text-white">{t('auth.seller')}</div>
              <div className="text-xs text-gray-500 dark:text-slate-400">{t('auth.sellerDescription')}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-slate-600 flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
