'use client';

import { Star, MapPin, BadgeCheck, Award, TrendingUp } from 'lucide-react';

interface SellerCardProps {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  transactions: number;
  badge: 'Verified' | 'Premium' | 'Top';
  location: string;
  responseTime?: string;
}

export default function SellerCard({ id, name, specialty, rating, transactions, badge, location, responseTime }: SellerCardProps) {
  const badgeConfig = {
    Verified: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-700', icon: <BadgeCheck className="w-3 h-3" /> },
    Premium: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-700', icon: <Award className="w-3 h-3" /> },
    Top: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-700', icon: <TrendingUp className="w-3 h-3" /> },
  };

  const config = badgeConfig[badge];

  return (
    <div className="block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{name}</h3>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border flex items-center gap-0.5 ${config.bg} ${config.text} ${config.border}`}>
              {config.icon} {badge}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-slate-400">{specialty}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] text-gray-900 dark:text-white font-medium ml-0.5">{rating}</span>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-slate-500">({transactions} ventes)</span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-0.5">
              <MapPin className="w-3 h-3" /> {location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
