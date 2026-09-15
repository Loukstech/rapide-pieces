'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock, Ban, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useSellers, useFeatureFlag } from '@/lib/store';

// Tant que l'admin n'a pas vérifié le compte, le vendeur n'a accès à rien de
// l'espace vendeur (pas de demandes, rien) — seul un écran
// "en attente de validation" s'affiche. Un vendeur banni voit un écran
// équivalent. Bloqué ici, au niveau du layout, pour couvrir toutes les
// pages /seller/* d'un coup plutôt que d'ajouter la même garde partout.
export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { data: sellers, loading: sellersLoading } = useSellers();
  // Pilotable par l'admin (page /admin/settings, section Confiance) — désactivé
  // par défaut pendant la phase de test pour ne pas bloquer les nouveaux comptes.
  const { data: verificationRequired, loading: flagLoading } = useFeatureFlag('seller_verification_required');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'seller')) router.replace('/login');
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/welcome');
  };

  if (isLoading || !user || user.role !== 'seller') {
    return (
      <div className="min-h-screen bg-rp-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if ((sellersLoading && sellers.length === 0) || flagLoading) {
    return (
      <div className="min-h-screen bg-rp-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sellerRecord = sellers.find((s) => s.id === user.id);

  if (sellerRecord?.isBanned) {
    return (
      <div className="min-h-screen bg-rp-bg flex flex-col items-center justify-center px-4 text-center">
        <Image src="/logo_rapidePiece.jpeg" alt="Rapide Pièces" width={240} height={80} className="h-16 w-auto object-contain mb-6" priority />
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <Ban className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-lg font-bold text-gray-900 mb-2">Compte suspendu</h1>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          Votre compte vendeur a été suspendu par un administrateur. Vous n&apos;avez plus accès à l&apos;espace vendeur.
        </p>
        <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
          <LogOut className="w-4 h-4" /> Se déconnecter
        </button>
      </div>
    );
  }

  if (verificationRequired && !sellerRecord?.isVerified) {
    return (
      <div className="min-h-screen bg-rp-bg flex flex-col items-center justify-center px-4 text-center">
        <Image src="/logo_rapidePiece.jpeg" alt="Rapide Pièces" width={240} height={80} className="h-16 w-auto object-contain mb-6" priority />
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-lg font-bold text-gray-900 mb-2">
          <span className="text-red-600">En attente de validation</span>
        </h1>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          Votre boutique a bien été créée. Un administrateur doit vérifier votre compte avant que vous puissiez voir les
          demandes et proposer des offres. Vous recevrez l&apos;accès dès que votre compte sera validé.
        </p>
        <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
          <LogOut className="w-4 h-4" /> Se déconnecter
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
