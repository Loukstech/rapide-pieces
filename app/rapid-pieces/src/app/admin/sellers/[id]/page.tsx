'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Star, Shield, Ban, MapPin, Phone, Eye, Package, Award, BarChart3, Globe } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useSellers, updateSellerVerification, updateSellerBan, useSellerPaymentNumber, useReviewsForSeller } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

export default function AdminSellerDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sellerId = params.id;
  const { user, isLoading } = useAuth();
  const { data: sellers, refetch: refetchSellers } = useSellers();
  const { data: paymentNumber } = useSellerPaymentNumber(sellerId);
  const { data: reviews } = useReviewsForSeller(sellerId);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    phoneSecondary: '',
    location: '',
    country: '',
    address: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const seller = sellers?.find(s => s.id === sellerId);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/login?role=admin');
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (!seller) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><p className="text-gray-500">Vendeur non trouvé</p></div>;

  const handleEdit = () => {
    setFormData({
      name: seller.name,
      phone: seller.phone,
      phoneSecondary: seller.phoneSecondary || '',
      location: seller.location,
      country: seller.country || '',
      address: seller.address || '',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({
        name: formData.name,
        phone: formData.phone,
        phone_secondary: formData.phoneSecondary || null,
        location: formData.location,
        country: formData.country || null,
        address: formData.address || null,
      })
      .eq('id', sellerId);

    if (error) {
      setError('Erreur lors de la modification');
      return;
    }

    await refetchSellers();
    setEditing(false);
    setSuccess('Modifications enregistrées');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = async () => {
    const supabase = createClient();

    // Un seul delete sur profiles : sellers a "on delete cascade" vers profiles,
    // donc la ligne sellers disparaît automatiquement avec. Évite un état
    // incohérent (profile orphelin, role='seller' sans ligne sellers) si on
    // supprimait les deux tables séparément et que le second appel échouait.
    const { error: deleteError } = await supabase.from('profiles').delete().eq('id', sellerId);

    if (deleteError) {
      setError('Erreur lors de la suppression');
      return;
    }

    setShowDeleteModal(false);
    router.push('/admin/sellers');
  };

  const handleVerify = async () => {
    await updateSellerVerification(seller.id, !seller.isVerified);
    await refetchSellers();
  };

  const handleBan = async () => {
    await updateSellerBan(seller.id, !seller.isBanned);
    await refetchSellers();
  };

  return (
    <div className="min-h-screen bg-rp-bg">
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/admin/sellers" className="text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white flex-1">Détails vendeur</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 pb-24 lg:pb-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl text-center">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl text-center">{success}</div>}

        {!editing ? (
          <>
            {/* Header actions */}
            <div className="flex gap-2">
              <button onClick={handleEdit} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-gray-200">
                <Edit className="w-3 h-3" /> Modifier
              </button>
              <button onClick={handleVerify} className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${seller.isVerified ? 'bg-gray-100 text-gray-600' : 'bg-emerald-600 text-white'}`}>
                <Shield className="w-3 h-3" /> {seller.isVerified ? 'Retirer vérif' : 'Vérifier'}
              </button>
              <button onClick={handleBan} className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${seller.isBanned ? 'bg-emerald-100 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                <Ban className="w-3 h-3" /> {seller.isBanned ? 'Débannir' : 'Bannir'}
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-red-700">
                <Trash2 className="w-3 h-3" /> Supprimer
              </button>
            </div>

            {/* Seller info */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400">
                  {seller.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{seller.name}</h2>
                    {seller.isVerified && <Shield className="w-4 h-4 text-emerald-400" />}
                    {seller.isBanned && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/30">Banni</span>}
                    {!seller.isBanned && seller.hasWarning && seller.warningSeverity === 'critical' && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-500/10 text-red-600 border border-red-500/30">🚨 Suspension à valider</span>}
                    {!seller.isBanned && seller.hasWarning && seller.warningSeverity !== 'critical' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30">⚠ Avertissement</span>}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">ID: {seller.id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              {seller.hasWarning && seller.warningReason && (
                <div className={`border rounded-lg px-3 py-2 text-xs ${
                  seller.warningSeverity === 'critical'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                }`}>
                  {seller.warningReason}
                  {seller.warningSeverity === 'critical' && (
                    <> — utilise le bouton <strong>Bannir</strong> ci-dessous si tu juges la suspension justifiée.</>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-slate-300">{seller.phone}</span>
                </div>
                {seller.phoneSecondary && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-slate-300">{seller.phoneSecondary}</span>
                  </div>
                )}
                {/* Cahier V2 - Point 38 : visible uniquement ici (admin) — jamais côté acheteur */}
                <div className="flex items-center gap-2 text-sm bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-800 dark:text-amber-300 font-medium">N° de paiement : {paymentNumber ?? 'Non renseigné'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-slate-300">{seller.location}</span>
                </div>
                {seller.country && (
                  <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-slate-300">{seller.country}</span>
                  </div>
                )}
                {seller.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-slate-300">{seller.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{seller.rating}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Note</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{seller.totalTransactions}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Ventes</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{seller.badge}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Badge</p>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Performance</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-emerald-400">{seller.fulfillmentRate}%</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Satisfaction client</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-blue-400">{seller.responseRate}%</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Réponse</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <p className={`text-lg font-bold ${seller.returnRate > 4 ? 'text-red-400' : 'text-emerald-400'}`}>{seller.returnRate}%</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Retour de pièce</p>
                </div>
              </div>
            </div>

            {/* Cahier V2 - Points 11/12/13 : avis clients — sans ça, impossible de
                savoir si un rating bas vient d'un vrai problème ou d'un avis isolé */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Avis clients ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-slate-500">Aucun avis pour le moment.</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 dark:border-slate-700 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} className={`w-3.5 h-3.5 ${n <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-slate-600'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-slate-500">{new Date(review.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {review.comment && <p className="text-xs text-gray-600 dark:text-slate-300">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specialties */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Spécialités</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mb-1">Marques</p>
                  <div className="flex flex-wrap gap-1">
                    {seller.brands.map(brand => (
                      <span key={brand} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px]">{brand}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mb-1">Catégories</p>
                  <div className="flex flex-wrap gap-1">
                    {seller.categories.map(cat => (
                      <span key={cat} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px]">{cat}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Modifier vendeur</h2>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Nom</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Téléphone principal</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Téléphone secondaire</label>
                <input type="text" value={formData.phoneSecondary} onChange={(e) => setFormData({...formData, phoneSecondary: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Ville</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Pays</label>
                <input type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Adresse</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold">Enregistrer</button>
                <button onClick={() => setEditing(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">Annuler</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Supprimer le vendeur</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">Cette action est irréversible. Le vendeur et toutes ses données seront supprimés.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">Annuler</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-xs font-semibold">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav role="admin" />
    </div>
  );
}