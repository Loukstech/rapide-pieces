'use client';

import Link from 'next/link';
import { Wrench, Cpu, Lightbulb, Snowflake, Droplets, Gauge, Car, CircuitBoard, Settings, Wind } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'Freinage': <Wrench className="w-6 h-6" />,
  'Moteur': <Settings className="w-6 h-6" />,
  'Éclairage': <Lightbulb className="w-6 h-6" />,
  'Climatisation': <Snowflake className="w-6 h-6" />,
  'Filtration': <Droplets className="w-6 h-6" />,
  'Suspension': <Gauge className="w-6 h-6" />,
  'Carrosserie': <Car className="w-6 h-6" />,
  'Électronique': <CircuitBoard className="w-6 h-6" />,
  'Transmission': <Cpu className="w-6 h-6" />,
  'Direction': <Wind className="w-6 h-6" />,
};

interface CategoryCardProps {
  name: string;
  count: number;
  href: string;
}

export default function CategoryCard({ name, count, href }: CategoryCardProps) {
  return (
    <Link href={href} className="group block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-red-300 dark:hover:border-red-600 hover:shadow-md transition-all duration-200">
      <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
        {iconMap[name] || <Wrench className="w-6 h-6" />}
      </div>
      <p className="text-xs font-semibold text-gray-900 dark:text-white">{name}</p>
      <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{count} pièces</p>
    </Link>
  );
}
