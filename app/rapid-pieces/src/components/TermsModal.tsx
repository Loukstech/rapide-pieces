'use client';

import { X } from 'lucide-react';
import { useLanguage } from '../lib/i18n/LanguageContext';

// Cahier V2 - Point 39 : les CGU/CGV ne doivent pas se télécharger en PDF —
// texte extrait du document fourni (CGVU RAPID PIECES APPS.pdf) et reformaté
// proprement en HTML/CSS, affiché dans une fenêtre plutôt que téléchargé.
export default function TermsModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">{t('common.legalTitle')}</h2>
            <p className="text-[11px] text-gray-400 dark:text-slate-500">{t('common.legalUpdate')}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white shrink-0 ml-3">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-5 text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
          <p>
            <strong className="text-gray-900 dark:text-white">{t('common.legalEditor')}</strong> RAPID PIÈCES (Next Africa Automotive)
          </p>

          <Article n={1} title={t('legal.art1_title')}>
            <p>{t('legal.art1_p1')}</p>
            <p>{t('legal.art1_p2')}</p>
          </Article>

          <Article n={2} title={t('legal.art2_title')}>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li><strong className="font-bold">{t('legal.art2_l1_title')}</strong> {t('legal.art2_l1_text')}</li>
              <li>
                <strong className="font-bold">{t('legal.art2_l2_title')}</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>{t('legal.art2_l2_buyer')}</li>
                  <li>{t('legal.art2_l2_seller')}</li>
                </ul>
              </li>
              <li><strong className="font-bold">{t('legal.art2_l3_title')}</strong> {t('legal.art2_l3_text')}</li>
            </ol>
          </Article>

          <Article n={3} title={t('legal.art3_title')}>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li><strong className="font-bold">{t('legal.art3_l1_title')}</strong> {t('legal.art3_l1_text')}</li>
              <li><strong className="font-bold">{t('legal.art3_l2_title')}</strong> {t('legal.art3_l2_text')}</li>
              <li><strong className="font-bold">{t('legal.art3_l3_title')}</strong> {t('legal.art3_l3_text')}</li>
            </ol>
          </Article>

          <Article n={4} title={t('legal.art4_title')}>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li><strong className="font-bold">{t('legal.art4_l1_title')}</strong> {t('legal.art4_l1_text')}</li>
              <li><strong className="font-bold">{t('legal.art4_l2_title')}</strong> {t('legal.art4_l2_text')}</li>
              <li><strong className="font-bold">{t('legal.art4_l3_title')}</strong> {t('legal.art4_l3_text')}</li>
              <li><strong className="font-bold">{t('legal.art4_l4_title')}</strong> {t('legal.art4_l4_text')}</li>
            </ol>
          </Article>

          <Article n={5} title={t('legal.art5_title')}>
            <p>{t('legal.art5_intro')}</p>
            <ul className="list-disc pl-5 mt-1.5 space-y-1">
              <li><strong className="font-bold">{t('legal.art5_l1_title')}</strong> {t('legal.art5_l1_text')}</li>
              <li><strong className="font-bold">{t('legal.art5_l2_title')}</strong> {t('legal.art5_l2_text')}</li>
              <li><strong className="font-bold">{t('legal.art5_l3_title')}</strong> {t('legal.art5_l3_text')}</li>
            </ul>
          </Article>

          <Article n={6} title={t('legal.art6_title')}>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li><strong className="font-bold">{t('legal.art6_l1_title')}</strong> {t('legal.art6_l1_text')}</li>
              <li><strong className="font-bold">{t('legal.art6_l2_title')}</strong> {t('legal.art6_l2_text')}</li>
              <li><strong className="font-bold">{t('legal.art6_l3_title')}</strong> {t('legal.art6_l3_text')}</li>
              <li><strong className="font-bold">{t('legal.art6_l4_title')}</strong> {t('legal.art6_l4_text')}</li>
            </ol>
          </Article>

          <Article n={7} title={t('legal.art7_title')}>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li><strong className="font-bold">{t('legal.art7_l1_title')}</strong> {t('legal.art7_l1_text')}</li>
              <li><strong className="font-bold">{t('legal.art7_l2_title')}</strong> {t('legal.art7_l2_text')}</li>
              <li><strong className="font-bold">{t('legal.art7_l3_title')}</strong> {t('legal.art7_l3_text')}</li>
            </ol>
          </Article>

          <Article n={8} title={t('legal.art8_title')}>
            <p>{t('legal.art8_p')}</p>
          </Article>

          <Article n={9} title={t('legal.art9_title')}>
            <p>{t('legal.art9_p')}</p>
          </Article>

          <Article n={10} title={t('legal.art10_title')}>
            <p>{t('legal.art10_p')}</p>
          </Article>
        </div>

        <div className="px-5 py-4 border-t border-gray-200 dark:border-slate-700 shrink-0">
          <button onClick={onClose} className="w-full py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold">
            {t('common.legalIRead')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Article({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-1.5">Article {n}. {title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
