'use client';

import Link from 'next/link';
import { ArrowLeft, Bell, Shield, Store } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useSellers } from '@/lib/store';
import { sellerAccountStatus } from '@/lib/types';
import ChangePasswordForm from '@/components/ChangePasswordForm';

export default function SellerSettingsPage() {
  const { user } = useAuth();
  const { data: sellers } = useSellers();
  const seller = sellers.find((item) => item.id === user?.id);
  const accountStatus = sellerAccountStatus(seller);

  return (
    <div className="min-h-screen bg-rp-bg pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/seller/profile" className="text-gray-400 hover:text-gray-900"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900">Paramètres vendeur</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900"><Store className="h-4 w-4" /> Boutique</div>
          <p className="text-xs text-gray-500">{seller?.name ?? user?.name ?? 'Vendeur'}</p>
          <p className="text-xs text-gray-500">{seller?.address ?? seller?.location ?? user?.location ?? 'Adresse non renseignée'}</p>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900"><Shield className="h-4 w-4" /> Statut</div>
          <p className="text-xs text-gray-500">
            {seller?.badge ?? 'New Seller'} -{' '}
            <span className={`${accountStatus.colorClass} font-semibold`}>{accountStatus.label}</span>
          </p>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900"><Bell className="h-4 w-4" /> Notifications</div>
          <p className="text-xs text-gray-500">Les alertes vendeur sont disponibles via la cloche et la page Notifications.</p>
        </section>
        <ChangePasswordForm />
      </main>
      <BottomNav role="seller" />
    </div>
  );
}
