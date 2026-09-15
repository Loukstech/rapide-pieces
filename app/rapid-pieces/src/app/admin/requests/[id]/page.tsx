'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Package, User } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useRequestById, useOffersForRequest } from '@/lib/store';
import { requestTitleLine, requestSubtitleLine, formatPrice } from '@/lib/types';

const STATUS_LABEL: Record<string, string> = {
  open: 'Ouverte',
  matched: 'Correspondance',
  ordered: 'Commandée',
  completed: 'Terminée',
  expired: 'Expirée',
  draft: 'Brouillon',
};

export default function AdminRequestDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/login?role=admin');
  }, [user, isLoading, router]);

  const { data: request, loading: requestLoading } = useRequestById(params.id);
  const { data: offers, loading: offersLoading } = useOffersForRequest(params.id);

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-rp-bg">
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/admin/requests" className="text-gray-400 hover:text-gray-900"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 flex-1">Demande</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 pb-24 lg:pb-6">
        {(requestLoading) && !request && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!requestLoading && !request && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-500">Demande introuvable — elle a peut-être été retirée.</p>
            <Link href="/admin/requests" className="inline-block mt-3 text-xs text-blue-600 font-medium">Retour aux demandes</Link>
          </div>
        )}

        {request && (
          <>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                  {STATUS_LABEL[request.status] ?? request.status}
                </span>
                <span className="text-lg font-bold text-red-600">{request.responsesCount}</span>
              </div>
              <div className="flex items-start gap-3 mb-2">
                {request.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={request.photo} alt={request.partName} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-200" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-base font-bold text-gray-900">{requestTitleLine(request)}</h2>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">{requestSubtitleLine(request, { showMissing: true })}</p>
                  {request.oemReference && <p className="text-[11px] text-gray-400 mt-1">Réf. OEM : {request.oemReference}</p>}
                </div>
              </div>
              {request.description && <p className="text-xs text-gray-600 mb-3">{request.description}</p>}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {request.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(request.createdAt).toLocaleString('fr-FR')}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> Acheteur #{request.buyerId.slice(-4).toUpperCase()}</span>
                <span>Quantité : {request.quantity}</span>
                {request.budgetIndicative && <span className="text-red-600 font-medium">Budget : {formatPrice(request.budgetIndicative)}</span>}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Offres ({offers.length})</h3>
              {offersLoading && offers.length === 0 && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!offersLoading && offers.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-6">Aucune offre pour cette demande.</p>
              )}
              <div className="space-y-2">
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Vendeur {offer.sellerBadge} · #{offer.sellerId.slice(-4).toUpperCase()}</p>
                      <p className="text-[10px] text-gray-400">{offer.quality} · {offer.deliveryTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatPrice(offer.price, offer.currency)}</p>
                      <p className="text-[10px] text-gray-400">{offer.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav role="admin" />
    </div>
  );
}
