'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, MapPin, Phone, Globe } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';

export default function AdminBuyerDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const buyerId = params.id;
  const { user, isLoading } = useAuth();
  const [buyer, setBuyer] = useState<{
    id: string;
    name: string;
    phone: string;
    phone_secondary?: string;
    location: string;
    country?: string;
    address?: string;
    buyer_type?: 'individual' | 'mechanic' | 'garage' | 'business';
    created_at: string;
    rapid_points?: number;
  } | null>(null);
  const [loadingBuyer, setLoadingBuyer] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    phoneSecondary: '',
    location: '',
    country: '',
    address: '',
    buyerType: 'individual' as 'individual' | 'mechanic' | 'garage' | 'business',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/login?role=admin');
  }, [user, isLoading, router]);

  const loadBuyer = useCallback(async () => {
    setLoadingBuyer(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', buyerId)
      .eq('role', 'buyer')
      .single();

    if (error || !data) {
      setError('Acheteur non trouvé');
    } else {
      setBuyer(data);
    }
    setLoadingBuyer(false);
  }, [buyerId]);

  useEffect(() => {
    if (buyerId) {
      loadBuyer();
    }
  }, [buyerId, loadBuyer]);

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (loadingBuyer) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (!buyer) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><p className="text-gray-500">Acheteur non trouvé</p></div>;

  const handleEdit = () => {
    setFormData({
      name: buyer.name,
      phone: buyer.phone,
      phoneSecondary: buyer.phone_secondary || '',
      location: buyer.location,
      country: buyer.country || '',
      address: buyer.address || '',
      buyerType: buyer.buyer_type || 'individual',
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
        buyer_type: formData.buyerType,
      })
      .eq('id', buyerId);

    if (error) {
      setError('Erreur lors de la modification');
      return;
    }

    await loadBuyer();
    setEditing(false);
    setSuccess('Modifications enregistrées');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = async () => {
    const supabase = createClient();
    
    const { error } = await supabase.from('profiles').delete().eq('id', buyerId);
    
    if (error) {
      setError('Erreur lors de la suppression');
      return;
    }

    setShowDeleteModal(false);
    router.push('/admin/buyers');
  };

  const buyerTypeLabels = {
    individual: 'Particulier',
    mechanic: 'Mécanicien',
    garage: 'Garage',
    business: 'Entreprise',
  };

  return (
    <div className="min-h-screen bg-rp-bg">
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/admin/buyers" className="text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white flex-1">Détails acheteur</h1>
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
              <button onClick={() => setShowDeleteModal(true)} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-red-700">
                <Trash2 className="w-3 h-3" /> Supprimer
              </button>
            </div>

            {/* Buyer info */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400">
                  {buyer.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{buyer.name}</h2>
                  <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">ID: {buyer.id.slice(-8).toUpperCase()}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{buyerTypeLabels[buyer.buyer_type || 'individual']}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-slate-300">{buyer.phone}</span>
                </div>
                {buyer.phone_secondary && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-slate-300">{buyer.phone_secondary}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-slate-300">{buyer.location}</span>
                </div>
                {buyer.country && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-slate-300">{buyer.country}</span>
                  </div>
                )}
                {buyer.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-slate-300">{buyer.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{buyer.rapid_points || 0}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Points Rapid</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {new Date(buyer.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Inscription</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Modifier acheteur</h2>
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
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Type d&apos;acheteur</label>
                <select value={formData.buyerType} onChange={(e) => setFormData({...formData, buyerType: e.target.value as 'individual' | 'mechanic' | 'garage' | 'business'})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white">
                  <option value="individual">Particulier</option>
                  <option value="mechanic">Mécanicien</option>
                  <option value="garage">Garage</option>
                  <option value="business">Entreprise</option>
                </select>
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
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Supprimer l&apos;acheteur</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">Cette action est irréversible. L&apos;acheteur et toutes ses données seront supprimés.</p>
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