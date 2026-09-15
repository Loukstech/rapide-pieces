'use client';

import Link from 'next/link';
import { TrendingDown, Users, Car, Building2, BarChart3, Shield, Truck, Clock, Globe, Package } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'Rapid Price': <BarChart3 className="w-5 h-5" />,
  'Achats groupés': <Users className="w-5 h-5" />,
  'Historique véhicule': <Car className="w-5 h-5" />,
  'Rapid Business': <Building2 className="w-5 h-5" />,
  'Sourcing': <Globe className="w-5 h-5" />,
  'Protection': <Shield className="w-5 h-5" />,
  'Livraison rapide': <Truck className="w-5 h-5" />,
  'Suivi en temps réel': <Clock className="w-5 h-5" />,
};

interface ServiceCardProps {
  label: string;
  desc: string;
  href: string;
}

export default function ServiceCard({ label, desc, href }: ServiceCardProps) {
  return (
    <Link href={href} className="group block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md transition-all duration-200">
      <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-3 text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
        {iconMap[label] || <Package className="w-5 h-5" />}
      </div>
      <p className="text-xs font-semibold text-gray-900 dark:text-white">{label}</p>
      <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{desc}</p>
    </Link>
  );
}
