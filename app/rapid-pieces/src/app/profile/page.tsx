'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Car, Clock, Star, Gift, MessageCircle, LogOut, ChevronRight, Plus, CheckCircle2, Zap, AlertTriangle, CreditCard, type LucideIcon } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationsBell from '@/components/NotificationsBell';
import { useAuth } from '@/lib/auth';
import { useOrders, useRapidPoints, useVehicles, addVehicle, usePendingPayments, cancelAcceptedOffer } from '@/lib/store';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import { requestTitleLine, formatPrice } from '@/lib/types';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  desc: string;
  href: string;
  color: string;
  hasBadge?: boolean;
}

const badges = [
  { icon: <Star className="w-3 h-3" />, name: 'Top Buyer', desc: 'Plus de 10 achats' },
  { icon: <CheckCircle2 className="w-3 h-3" />, name: 'Fidèle', desc: '3 mois actif' },
  { icon: <Zap className="w-3 h-3" />, name: 'Rapide', desc: 'Temps de réponse < 5min' },
];

export default function BuyerProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'menu' | 'pending' | 'vehicles' | 'history'>('menu');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ brand: '', model: '', year: '', engine: '', vin: '' });

  // Cahier §8 : l'enregistrement de véhicules est réservé aux particuliers —
  // garages/mécaniciens/entreprises voient passer trop de véhicules différents.
  const canHaveVehicles = !user?.buyerType || user.buyerType === 'individual';

  const { data: allOrders } = useOrders();
  const orders = user ? allOrders.filter((o) => o.buyerId === user.id) : [];
  const { data: points } = useRapidPoints(user?.id);
  const { data: vehicles, refetch: refetchVehicles } = useVehicles(user?.id);
  const { data: pendingPayments, refetch: refetchPending } = usePendingPayments(user?.id);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleAddVehicle = async () => {
    if (!user || !newVehicle.brand || !newVehicle.model || !newVehicle.year) return;
    await addVehicle(user.id, {
      brand: newVehicle.brand,
      model: newVehicle.model,
      year: parseInt(newVehicle.year, 10) || new Date().getFullYear(),
      engine: newVehicle.engine,
      vin: newVehicle.vin || undefined,
    });
    refetchVehicles();
    setNewVehicle({ brand: '', model: '', year: '', engine: '', vin: '' });
    setShowAddVehicle(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/welcome');
  };

  const handleCancelPending = async (requestId: string, offerId: string) => {
    if (!user) return;
    setBusyId(offerId);
    await cancelAcceptedOffer(user.id, requestId, offerId);
    await refetchPending();
    setBusyId(null);
  };

  const menuItems = [
    { icon: CreditCard, label: 'Paiement en attente', desc: `${pendingPayments.length} paiement${pendingPayments.length > 1 ? 's' : ''}`, href: '#pending', color: 'text-red-500', hasBadge: pendingPayments.length > 0 },
    ...(canHaveVehicles ? [{ icon: Car, label: 'Mes véhicules', desc: `${vehicles.length} véhicule${vehicles.length > 1 ? 's' : ''} enregistré${vehicles.length > 1 ? 's' : ''}`, href: '#vehicles', color: 'text-purple-500', hasBadge: false }] : []),
    { icon: Clock, label: 'Historique', desc: `${orders.length} achat${orders.length > 1 ? 's' : ''} précédent${orders.length > 1 ? 's' : ''}`, href: '#history', color: 'text-amber-500', hasBadge: false },
    { icon: Gift, label: 'Rapid Points', desc: `${points.toLocaleString('fr-FR')} points`, href: '/orders', color: 'text-green-500', hasBadge: false },
    { icon: MessageCircle, label: 'Support', desc: 'Contacter l\'équipe', href: '/whatsapp-contact', color: 'text-emerald-500', hasBadge: false },
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!user || user.role !== 'buyer') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 pb-24">
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Vous n&apos;êtes pas connecté</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Connectez-vous pour voir vos commandes, vos points et vos véhicules.</p>
          <Link href="/login" className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all">
            Se connecter
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-red-500">RAPID</span>
            <span className="text-xl font-black text-gray-900 dark:text-white">PIÈCES</span>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationsBell role="buyer" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Profile card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-3">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h2>
          {user.location && <p className="text-sm text-gray-500 dark:text-slate-400">{user.location}</p>}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{orders.length}</div>
              <div className="text-xs text-gray-400">Achats</div>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-slate-600" />
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-500">{points.toLocaleString('fr-FR')}</div>
              <div className="text-xs text-gray-400">Points</div>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-slate-600" />
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{vehicles.length}</div>
              <div className="text-xs text-gray-400">Véhicules</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['menu', 'pending', 'vehicles', 'history'] as const).filter((tab) => tab !== 'vehicles' || canHaveVehicles).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-700'
              }`}
            >
              {tab === 'menu' ? 'Menu' : tab === 'pending' ? 'Paiements' : tab === 'vehicles' ? 'Véhicules' : 'Historique'}
            </button>
          ))}
        </div>

        {/* Pending Payments Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-3">
            {pendingPayments.length === 0 && (
              <div className="text-center text-sm text-gray-400 dark:text-slate-500 py-6">Aucun paiement en attente.</div>
            )}
            {pendingPayments.map(({ request, offer }) => (
              <div key={offer.id} className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{requestTitleLine(request)}</h3>
                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-1">Offre acceptée : {formatPrice(offer.price, offer.currency)}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/checkout?offerId=${offer.id}&requestId=${request.id}`}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold text-center">
                    Payer maintenant
                  </Link>
                  <button onClick={() => handleCancelPending(request.id, offer.id)} disabled={busyId === offer.id}
                    title="Vos points Rapid diminueront"
                    className="px-3 py-2 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-lg text-xs font-semibold disabled:opacity-50">
                    Annuler
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-2">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <>
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-slate-700 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {item.hasBadge && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white dark:border-slate-800" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-slate-600" />
                </>
              );
              const className = "w-full flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md transition-all";
              if (item.href.startsWith('#')) {
                return (
                  <button key={i} onClick={() => setActiveTab(item.href === '#vehicles' ? 'vehicles' : item.href === '#pending' ? 'pending' : 'history')} className={className}>
                    {content}
                  </button>
                );
              }
              return (
                <Link key={i} href={item.href} className={className}>
                  {content}
                </Link>
              );
            })}
            <button onClick={handleLogout}
              className="w-full flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-slate-700 text-red-500">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-bold text-gray-900 dark:text-white">Se déconnecter</div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
            </button>
            <ChangePasswordForm />
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="space-y-3">
            {vehicles.length === 0 && !showAddVehicle && (
              <div className="text-center text-sm text-gray-400 dark:text-slate-500 py-6">Aucun véhicule enregistré.</div>
            )}
            {vehicles.map((v, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{v.brand} {v.model}</div>
                      <div className="text-xs text-gray-400">{v.year} • {v.engine}</div>
                      {v.vin && <div className="text-[10px] text-gray-400 mt-0.5">{v.vin}</div>}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href="/requests/new" className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-lg text-center transition-all">
                    Commander une pièce
                  </Link>
                  <Link href="/vehicle-history" className="flex-1 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 text-xs font-bold py-2.5 rounded-lg text-center transition-all">
                    Historique
                  </Link>
                </div>
              </div>
            ))}
            <button onClick={() => setShowAddVehicle(!showAddVehicle)}
              className="w-full bg-white dark:bg-slate-800 rounded-xl p-4 border border-dashed border-gray-300 dark:border-slate-600 text-center hover:border-red-400 dark:hover:border-red-500 transition-all">
              <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-gray-500">Ajouter un véhicule</div>
            </button>
            {showAddVehicle && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Nouveau véhicule</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Marque" value={newVehicle.brand} onChange={(e) => setNewVehicle(p => ({ ...p, brand: e.target.value }))} className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
                  <input type="text" placeholder="Modèle" value={newVehicle.model} onChange={(e) => setNewVehicle(p => ({ ...p, model: e.target.value }))} className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Année" value={newVehicle.year} onChange={(e) => setNewVehicle(p => ({ ...p, year: e.target.value }))} className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
                  <input type="text" placeholder="Motorisation" value={newVehicle.engine} onChange={(e) => setNewVehicle(p => ({ ...p, engine: e.target.value }))} className="bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
                </div>
                <input type="text" placeholder="VIN / Châssis (optionnel)" value={newVehicle.vin} onChange={(e) => setNewVehicle(p => ({ ...p, vin: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white" />
                <button onClick={handleAddVehicle} disabled={!newVehicle.brand || !newVehicle.model || !newVehicle.year}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50">
                  Ajouter
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {orders.length === 0 && (
              <div className="text-center text-sm text-gray-400 dark:text-slate-500 py-6">Aucun achat pour le moment.</div>
            )}
            {orders.map((o) => (
              <div key={o.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{o.partName}</div>
                      <div className="text-xs text-gray-400">{o.vehicle.brand} {o.vehicle.model} {o.vehicle.year}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(o.price, o.currency)}</div>
                    <div className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Vendeur: {o.sellerName}</span>
                  <Link href="/orders" className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-all">
                    Suivre
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
