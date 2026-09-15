'use client';

import Link from 'next/link';
import { MapPin, Clock, MessageSquare, ChevronRight, Wrench, Car } from 'lucide-react';
import { useLanguage } from '../lib/i18n/LanguageContext';

interface RequestCardProps {
  id: string;
  part: string;
  buyer: string;
  buyerType: string;
  location: string;
  time: string;
  responses: number;
  status: 'En cours' | 'Pièce trouvée' | 'Urgent';
  vehicle?: string;
}

export default function RequestCard({ id, part, buyer, buyerType, location, time, responses, status, vehicle }: RequestCardProps) {
  const { t } = useLanguage();
  const statusConfig = {
    'En cours': { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-700', translation: t('common.reqInProgress') },
    'Pièce trouvée': { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-700', translation: t('common.reqFound') },
    'Urgent': { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-700', translation: t('common.reqUrgent') },
  };

  const config = statusConfig[status];

  return (
    <Link href={`/requests/new`} className="group block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <Wrench className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{part}</h3>
            <p className="text-[10px] text-gray-500 dark:text-slate-400">{buyer} • {buyerType}</p>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border}`}>
          {config.translation}
        </span>
      </div>

      {vehicle && (
        <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500 mb-2">
          <Car className="w-3 h-3" /> {vehicle}
        </div>
      )}

      <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-slate-500">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {time}</span>
        <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
          <MessageSquare className="w-3 h-3" /> {t('common.offersCount', { count: responses })}
        </span>
      </div>

      <div className="flex items-center justify-end mt-2 text-[10px] text-red-600 dark:text-red-400 font-medium group-hover:underline">
        {t('common.respond')} <ChevronRight className="w-3 h-3" />
      </div>
    </Link>
  );
}
