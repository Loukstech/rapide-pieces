'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, ShieldCheck, Percent, Truck, Globe, Bell, Users, Database, AlertTriangle, ChevronRight, X } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import LanguageSelector from '@/components/LanguageSelector';
import { useAuth } from '@/lib/auth';
import { useAdminSettings, updateAdminSetting } from '@/lib/store';
import { type AdminSetting } from '@/lib/types';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface SettingsItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  rawValue: string;
  desc: string;
  editable: boolean;
  key: string;
}

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

// Helper to convert AdminSetting to SettingsItem
const adminSettingToSettingsItem = (setting: AdminSetting): SettingsItem => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    commission_rate: Percent,
    sourcing_fee: Percent,
    escrow_enabled: Shield,
    rapid_now_enabled: Truck,
    rapid_city_enabled: Truck,
    rapid_nigeria_enabled: Globe,
    rapid_usa_enabled: Globe,
    rapid_protection_enabled: Shield,
    kyc_required: Users,
    fraud_detection_enabled: AlertTriangle,
    notification_enabled: Bell,
    seller_verification_required: ShieldCheck,
    phone_otp_required: ShieldCheck,
  };

  const labelMap: Record<string, string> = {
    commission_rate: 'Taux de commission',
    sourcing_fee: 'Frais de sourcing',
    escrow_enabled: 'Escrow',
    rapid_now_enabled: 'RAPID PIECES',
    rapid_city_enabled: 'RAPID CITY',
    rapid_nigeria_enabled: 'RAPID NIGERIA',
    rapid_usa_enabled: 'RAPID USA',
    rapid_protection_enabled: 'Rapide Protection',
    kyc_required: 'KYC Vendeurs',
    fraud_detection_enabled: 'Détection fraude',
    notification_enabled: 'Notifications',
    seller_verification_required: 'Vérification vendeur obligatoire',
    phone_otp_required: 'OTP téléphone obligatoire',
  };

  const descMap: Record<string, string> = {
    commission_rate: 'Par catégorie',
    sourcing_fee: 'Sourcing international',
    escrow_enabled: 'Paiement sécurisé',
    rapid_now_enabled: 'Locale express',
    rapid_city_enabled: 'Intra-ville',
    rapid_nigeria_enabled: 'Sourcing Nigeria',
    rapid_usa_enabled: 'Sourcing USA',
    rapid_protection_enabled: 'Garantie et retour',
    kyc_required: 'Vérification identité',
    fraud_detection_enabled: 'Coordonnées masquées',
    notification_enabled: 'Alertes push',
    seller_verification_required: 'Bloque le tableau de bord tant qu\'un admin n\'a pas validé le compte',
    phone_otp_required: 'Exige un code SMS (Infobip) à l\'inscription — nécessite un compte Infobip hors mode démo',
  };

  const categoryEditable: Record<string, boolean> = {
    commission: true,
    payment: false,
    delivery: false,
    trust: false,
    system: false,
  };
  // Certains réglages sont éditables individuellement même si leur catégorie ne
  // l'est pas globalement (ex: les autres réglages "trust" — KYC, détection de
  // fraude — ne sont pas encore implémentés et doivent rester en lecture seule).
  const editableKeys = ['commission_rate', 'sourcing_fee', 'seller_verification_required', 'phone_otp_required'];

  return {
    icon: iconMap[setting.key] || Database,
    label: labelMap[setting.key] || setting.key,
    value: setting.value === 'true' ? 'Activé' : setting.value === 'false' ? 'Désactivé' : setting.value,
    rawValue: setting.value,
    desc: descMap[setting.key] || setting.description,
    editable: categoryEditable[setting.category] || editableKeys.includes(setting.key),
    key: setting.key,
  };
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { data: adminSettings, refetch: refetchSettings } = useAdminSettings();
  const [editingItem, setEditingItem] = useState<{ key: string; label: string; isBoolean: boolean } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/login?role=admin');
  }, [user, isLoading, router]);

  // Group admin settings by category
  const settingsGroups: SettingsGroup[] = [
    {
      title: t('admin.commissionPayment'),
      items: adminSettings
        .filter(s => s.category === 'commission' || s.category === 'payment')
        .map(adminSettingToSettingsItem),
    },
    {
      title: t('admin.delivery'),
      items: adminSettings
        .filter(s => s.category === 'delivery')
        .map(adminSettingToSettingsItem),
    },
    {
      title: t('admin.trust'),
      items: adminSettings
        .filter(s => s.category === 'trust')
        .map(adminSettingToSettingsItem),
    },
    {
      title: 'Système',
      items: adminSettings
        .filter(s => s.category === 'system')
        .map(adminSettingToSettingsItem),
    },
  ];

  const handleEditClick = (key: string, label: string, currentValue: string) => {
    const isBoolean = currentValue === 'true' || currentValue === 'false';
    setEditingItem({ key, label, isBoolean });
    setEditValue(currentValue);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (editingItem && user) {
      const success = await updateAdminSetting(editingItem.key, editValue, user.id);
      if (success) {
        await refetchSettings();
        setShowEditModal(false);
        setEditingItem(null);
        setEditValue('');
        showToast('Paramètre sauvegardé avec succès', 'success');
      } else {
        showToast('Erreur lors de la sauvegarde', 'error');
      }
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingItem(null);
    setEditValue('');
  };

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-rp-bg">
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{t('admin.settings')}</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24 lg:pb-6">
        {/* Status */}
        <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-emerald-400">Plateforme active</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">Système</p><p className="text-[10px] text-emerald-400/70">Opérationnel</p></div>
            <div><p className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">{adminSettings.length}</p><p className="text-[10px] text-emerald-400/70">Paramètres</p></div>
            <div><p className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">99.9%</p><p className="text-[10px] text-emerald-400/70">Uptime</p></div>
          </div>
        </div>

        {settingsGroups.map(group => (
          <div key={group.title}>
            <h2 className="text-xs font-bold text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-3 uppercase tracking-wider">{group.title}</h2>
            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              {group.items.map((item: SettingsItem, i: number) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => item.editable && handleEditClick(item.key, item.label, item.rawValue)}
                    disabled={!item.editable}
                    className={`w-full px-4 py-3.5 flex items-center gap-3 ${i < group.items.length - 1 ? 'border-b border-gray-200' : ''} ${!item.editable ? 'cursor-default' : 'hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors'}`}
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-400 dark:text-slate-500 dark:text-slate-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-emerald-400">{item.value}</span>
                      {item.editable && <ChevronRight className="w-4 h-4 text-gray-400 dark:text-slate-500 dark:text-slate-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Zone dangereuse</h3>
          <div className="space-y-2">
            <button onClick={() => showToast("Action de suspendre confirmée", "warning")} className="w-full py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">Suspendre la plateforme</button>
            <button onClick={() => showToast("Export en cours...", "info")} className="w-full py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Exporter toutes les données</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Modifier {editingItem.label}</h3>
              <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            {editingItem.isBoolean ? (
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => setEditValue('true')}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-colors ${editValue === 'true' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'}`}
                >
                  Activé
                </button>
                <button
                  onClick={() => setEditValue('false')}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-colors ${editValue === 'false' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'}`}
                >
                  Désactivé
                </button>
              </div>
            ) : (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
                placeholder="Nouvelle valeur..."
              />
            )}
            <div className="flex gap-2">
              <button onClick={handleCancelEdit} className="flex-1 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">Annuler</button>
              <button onClick={handleSaveEdit} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav role="admin" />
    </div>
  );
}
