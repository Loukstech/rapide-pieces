'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RefreshCcw, AlertCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useRequestById, renewRequest } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/Toast';

export default function RequestDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const requestId = params.id;
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const { data: request, loading, refetch } = useRequestById(requestId);
  const [isRenewing, setIsRenewing] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'buyer')) router.replace('/login');
  }, [user, authLoading, router]);

  const handleRenew = async () => {
    setIsRenewing(true);
    try {
      const success = await renewRequest(requestId);
      await refetch();
      showToast(success ? 'Votre demande a été republiée pour 24h.' : 'Le renouvellement a échoué, réessayez.', success ? 'success' : 'error');
    } catch (e) {
      console.error("Erreur lors du renouvellement", e);
      showToast('Le renouvellement a échoué, réessayez.', 'error');
    } finally {
      setIsRenewing(false);
    }
  };

  if (authLoading || !user || loading) return <div className="p-4 text-center">Chargement...</div>;
  if (!request) return <div className="p-4 text-center">Demande introuvable</div>;

  const isExpired = request.status === 'expired';

  return (
    <div className="p-4 pb-24 space-y-6">
      {isExpired && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col items-center text-center gap-3">
          <div className="p-2 bg-amber-100 rounded-full text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900">Demande expirée</h3>
            <p className="text-sm text-amber-700">
              Votre demande est arrivée à expiration. Souhaitez-vous la republier pour recevoir de nouvelles offres ?
            </p>
          </div>
          <button 
            onClick={handleRenew}
            disabled={isRenewing}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-bold transition-all disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${isRenewing ? 'animate-spin' : ''}`} />
            {isRenewing ? 'Renouvellement...' : 'Renouveler ma demande'}
          </button>
        </div>
      )}
      
      {/* Reste du détail de la demande... */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800">
        <h2 className="text-xl font-bold">{request.partName}</h2>
        <p className="text-gray-500 text-sm">{request.vehicle.brand} {request.vehicle.model}</p>
      </div>
      <BottomNav />
    </div>
  );
}
