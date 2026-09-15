'use client';

import { Zap, MapPin, Globe, Clock } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'RAPID PIECES': <Zap className="w-5 h-5" />,
  'RAPID CITY': <MapPin className="w-5 h-5" />,
  'RAPID NIGERIA': <Globe className="w-5 h-5" />,
  'RAPID USA': <Globe className="w-5 h-5" />,
};

const colorMap: Record<string, string> = {
  'RAPID PIECES': 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  'RAPID CITY': 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  'RAPID NIGERIA': 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  'RAPID USA': 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
};

interface DeliveryCardProps {
  label: string;
  desc: string;
  time: string;
}

export default function DeliveryCard({ label, desc, time }: DeliveryCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-all duration-200">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorMap[label] || 'bg-gray-100 text-gray-600'}`}>
        {iconMap[label] || <Clock className="w-5 h-5" />}
      </div>
      <h3 className="text-xs font-bold text-gray-900 dark:text-white">{label}</h3>
      <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{desc}</p>
      <span className="inline-block mt-2 text-[10px] px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full font-medium">
        {time}
      </span>
    </div>
  );
}
