'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Camera, Check, FileText, Car, Rocket, ArrowRight, ShoppingCart } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import BottomActionBar from '@/components/BottomActionBar';
import NotificationsBell from '@/components/NotificationsBell';
import { useToast } from '@/components/Toast';
import { addRequest, uploadRequestPhoto } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { OPERATING_COUNTRIES, FUEL_TYPES, CONDITION_TYPES, QUALITY_LEVELS, requestTitleLine, requestSubtitleLine, currencyForCountry, currencyLabel, formatPrice, type PartRequest } from '@/lib/types';


const brands = ['Toutes les marques', 'Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Volkswagen', 'Hyundai', 'Nissan', 'Ford', 'Peugeot', 'Renault', 'Kia', 'Mitsubishi', 'Isuzu', 'Land Rover', 'Suzuki', 'Mazda', 'Autre'];

const categories = ['Toutes les pièces', 'Freinage', 'Moteur', 'Éclairage', 'Climatisation', 'Filtration', 'Suspension', 'Électrique', 'Carrosserie', 'Direction', 'Échappement', 'Transmission', 'Autre'];

const searchModes = [
  { id: 'text', label: 'Décrire la pièce', icon: FileText, desc: 'Décrivez la pièce dont vous avez besoin' },
  { id: 'photo', label: 'Pièce selon photo', icon: Camera, desc: 'Photographiez la pièce pour identification' },
  { id: 'vin', label: 'Numéro châssis /VIN', icon: Car, desc: 'Via numéro VIN du véhicule' },
];

export default function NewRequestPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [searchMode, setSearchMode] = useState<'text' | 'photo' | 'vin'>('text');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<PartRequest | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'buyer')) router.replace('/login');
  }, [user, isLoading, router]);

  const [form, setForm] = useState({
    brand: '', model: '', year: '', engine: '', vin: '', cylinders: '',
    partName: '', oemReference: '', description: '', quantity: '1', budgetIndicative: '',
    fuel: '' as '' | (typeof FUEL_TYPES)[number],
    condition: '' as '' | (typeof CONDITION_TYPES)[number],
    quality: '' as '' | (typeof QUALITY_LEVELS)[number]['value'],
    partPosition: '', note: '',
    country: 'Bénin', city: '',
    specificBrand: '', // Cahier V2 - Point 6: Marque spécifique optionnelle
    customBrand: '', // Cahier V2 - Point 17: Marque personnalisée quand "Autre" est sélectionné
    customCategory: '', // Cahier V2 - Point 17: Catégorie personnalisée quand "Autre" est sélectionné
    photo: null as File | null,
  });

  const update = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setForm(p => ({ ...p, photo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (asDraft = false) => {
    if (!user) return;
    setSubmitting(true);
    const photoUrl = form.photo ? await uploadRequestPhoto(user.id, form.photo) : undefined;
    const request = await addRequest({
      vehicle: {
        brand: form.brand,
        model: form.model,
        year: parseInt(form.year, 10) || new Date().getFullYear(),
        engine: form.engine,
        vin: form.vin || undefined,
        cylinders: form.cylinders ? parseInt(form.cylinders, 10) : undefined,
      },
      partName: form.partName || 'Pièce auto',
      oemReference: form.oemReference || undefined,
      photo: photoUrl,
      description: form.description,
      quantity: parseInt(form.quantity, 10) || 1,
      quality: form.quality || undefined,
      fuel: form.fuel || undefined,
      condition: form.condition || undefined,
      note: form.note || undefined,
      partPosition: form.partPosition || undefined,
      budgetIndicative: form.budgetIndicative ? parseInt(form.budgetIndicative, 10) : undefined,
      location: form.city ? `${form.city}, ${form.country}` : '',
      buyerId: user.id,
      specificBrand: form.specificBrand || undefined, // Cahier V2 - Point 6
      asDraft,
    });
    setSubmitting(false);
    if (request && asDraft) {
      router.push('/cart');
      return;
    }
    if (request) {
      setCreatedRequest(request);
      setSubmitted(true);
    } else {
      showToast("La demande n'a pas pu être envoyée. Réessayez.", 'error');
    }
  };

  if (isLoading || !user) {
    return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-rp-bg flex items-center justify-center px-4">
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Demande envoyée !</h2>
          <p className="text-sm text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-6">Votre demande a été diffusée aux vendeurs. Vous recevrez des offres sous peu.</p>
          <div className="bg-gray-100 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-1">Pièce recherchée</p>
            {createdRequest && (
              <>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{requestTitleLine(createdRequest)}</p>
                {requestSubtitleLine(createdRequest) && (
                  <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 mt-1">{requestSubtitleLine(createdRequest)}</p>
                )}
              </>
            )}
          </div>
          {createdRequest && (
            <Link href={`/offers/${createdRequest.id}`} className="block w-full py-3 mb-3 bg-red-600 text-white rounded-xl text-sm font-bold text-center shadow-lg shadow-red-600/20">
              Voir les offres reçues
            </Link>
          )}
          <div className="flex gap-3">
            <Link href="/orders" className="flex-1 py-3 bg-gray-200 text-gray-900 dark:text-white rounded-xl text-sm font-semibold text-center">Mes commandes</Link>
            <Link href="/" className="flex-1 py-3 bg-gray-200 text-gray-900 dark:text-white rounded-xl text-sm font-semibold text-center">Accueil</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rp-bg">
      {/* Header */}
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">Nouvelle demande</h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Étape {step}/3</p>
          </div>
          <NotificationsBell role="buyer" />
          <Image src="/logo_rapidePiece.jpeg" alt="RP" width={96} height={32} className="h-8 w-auto object-contain" />
        </div>
        {/* Progress */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">

        {/* ===== ÉTAPE 1 : Mode de recherche + Véhicule ===== */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Search Mode */}
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Comment souhaitez-vous rechercher ?</h2>
              <div className="space-y-2">
                {searchModes.map(mode => {
                  const Icon = mode.icon;
                  return (
                    <button key={mode.id} onClick={() => setSearchMode(mode.id as typeof searchMode)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        searchMode === mode.id
                          ? 'bg-red-600/10 border-red-300 shadow-lg shadow-red-600/10'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300 dark:hover:border-slate-500'
                      }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        searchMode === mode.id ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-400 dark:text-slate-500 dark:text-slate-500'
                      }`}><Icon className="w-5 h-5" /></div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{mode.label}</p>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{mode.desc}</p>
                      </div>
                      {searchMode === mode.id && <Check className="w-5 h-5 text-red-600 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo Upload (if photo mode) */}
            {searchMode === 'photo' && (
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-2 block">Photo de la pièce *</label>
                <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-red-300 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  {photoPreview ? (
                    <img src={photoPreview} alt="Pièce" className="max-h-40 mx-auto rounded-lg object-contain" />
                  ) : (
                    <>
                      <Camera className="w-10 h-10 text-gray-400 dark:text-slate-500 dark:text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 dark:text-slate-500 dark:text-slate-500">Appuyez pour ajouter une photo</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 mt-1">Aide l&apos;expert à identifier la pièce précisément</p>
                    </>
                  )}
                </label>
              </div>
            )}

            {/* Vehicle Info */}
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Informations du véhicule</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Marque *</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {brands.map(b => (
                      <button key={b} type="button" onClick={() => {
                        update('brand', b);
                        if (b !== 'Autre') update('customBrand', '');
                      }}
                        className={`py-2 px-1 rounded-lg text-[10px] font-medium text-center transition-all ${
                          form.brand === b ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 dark:text-slate-300 dark:text-slate-300 border border-gray-200 hover:border-slate-500'
                        }`}>{b}</button>
                    ))}
                  </div>
                  {form.brand === 'Autre' && (
                    <input type="text" placeholder="Entrez votre marque" value={form.customBrand} onChange={(e) => update('customBrand', e.target.value)}
                      className="w-full mt-2 px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary" />
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Modèle *</label>
                    <input type="text" placeholder="Ex: Corolla" value={form.model} onChange={(e) => update('model', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Année *</label>
                    <select value={form.year} onChange={(e) => update('year', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rp-primary">
                      <option value="">Année</option>
                      {Array.from({ length: 20 }, (_, i) => 2025 - i).map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Marque spécifique (optionnel)</label>
                    <input type="text" placeholder="Si requis une marque précise" value={form.specificBrand} onChange={(e) => update('specificBrand', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Type de moteur</label>
                    <input type="text" placeholder="Ex: 1.8 essence" value={form.engine} onChange={(e) => update('engine', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Cylindres</label>
                    <input type="number" min="1" placeholder="Ex: 4" value={form.cylinders} onChange={(e) => update('cylinders', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">VIN / Châssis</label>
                    <input type="text" placeholder={searchMode === 'vin' ? 'Requis *' : 'Optionnel'} value={form.vin} onChange={(e) => update('vin', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Carburant</label>
                  <div className="flex flex-wrap gap-1.5">
                    {FUEL_TYPES.map((f) => (
                      <button key={f} type="button" onClick={() => update('fuel', f)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                          form.fuel === f ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-400 dark:text-slate-500 dark:text-slate-500'
                        }`}>{f}</button>
                    ))}
                  </div>
                </div>
                {searchMode === 'vin' && !form.vin && (
                  <p className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 p-2 rounded-lg">
                    ⚠️ VIN manquant (requis pour commande externe)
                  </p>
                )}
              </div>
            </div>

            </div>
        )}

        {/* ===== ÉTAPE 2 : Pièce + Description ===== */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Pièce recherchée</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Nom de la pièce *</label>
                  <input type="text" placeholder="Ex: Plaquettes de frein avant" value={form.partName} onChange={(e) => update('partName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Référence OEM (optionnel)</label>
                  <input type="text" placeholder="Ex: 04465-06090" value={form.oemReference} onChange={(e) => update('oemReference', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Catégorie</label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map(c => (
                      <button key={c} type="button" onClick={() => {
                        update('partName', c);
                        if (c !== 'Autre') update('customCategory', '');
                      }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                          form.partName === c ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:bg-slate-600'
                        }`}>{c}</button>
                    ))}
                  </div>
                  {form.partName === 'Autre' && (
                    <input type="text" placeholder="Entrez votre catégorie" value={form.customCategory} onChange={(e) => update('customCategory', e.target.value)}
                      className="w-full mt-2 px-3 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary" />
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">État de la pièce</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CONDITION_TYPES.map((c) => (
                      <button key={c} type="button" onClick={() => update('condition', c)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                          form.condition === c ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-400 dark:text-slate-500 dark:text-slate-500'
                        }`}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Qualité souhaitée (optionnel)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUALITY_LEVELS.map((q) => (
                      <button key={q.value} type="button" onClick={() => update('quality', q.value)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                          form.quality === q.value ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-400 dark:text-slate-500 dark:text-slate-500'
                        }`}>{q.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Description détaillée *</label>
                  <textarea placeholder="Décrivez votre besoin en détail. Plus c&apos;est précis, plus les vendeurs pourront vous aider." value={form.description}
                    onChange={(e) => update('description', e.target.value)} rows={4}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary resize-none" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Quantité</label>
                    <input type="number" min="1" value={form.quantity} onChange={(e) => update('quantity', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rp-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Offre acheteur ({currencyLabel(currencyForCountry(user?.country))})</label>
                    <input type="number" min="0" placeholder="Ex: 50000" value={form.budgetIndicative} onChange={(e) => update('budgetIndicative', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Position de la pièce</label>
                    <input type="text" placeholder="Ex: Avant gauche" value={form.partPosition} onChange={(e) => update('partPosition', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Note (optionnel)</label>
                  <textarea placeholder="Information complémentaire" value={form.note} onChange={(e) => update('note', e.target.value)} rows={2}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-rp-primary resize-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Photo (optionnel)</label>
                  <label className="block py-3 px-4 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-400 dark:text-slate-500 dark:text-slate-500 cursor-pointer hover:border-slate-500 transition-colors text-center flex items-center justify-center gap-1.5">
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                    {photoPreview ? <><Check className="w-4 h-4" /> Photo ajoutée</> : <><Camera className="w-4 h-4" /> Ajouter photo</>}
                  </label>
                </div>
              </div>
            </div>

            </div>
        )}

        {/* ===== ÉTAPE 3 : Localisation ===== */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Localisation</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Pays *</label>
                  <select value={form.country} onChange={(e) => { update('country', e.target.value); update('city', ''); }}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rp-primary">
                    {OPERATING_COUNTRIES.map(c => <option key={c.country} value={c.country}>{c.country}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Ville *</label>
                  <select value={form.city} onChange={(e) => update('city', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rp-primary">
                    <option value="">Sélectionner</option>
                    {(OPERATING_COUNTRIES.find(c => c.country === form.country)?.cities ?? []).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 mt-2">
                Seule la ville est communiquée au vendeur avant la commande — pour votre sécurité, pas d&apos;adresse précise.
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-2">Résumé</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Véhicule</span><span className="text-gray-900 dark:text-white font-medium">{form.brand} {form.model} {form.year}</span></div>
                <div className="flex justify-between"><span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Pièce</span><span className="text-gray-900 dark:text-white font-medium">{form.partName}</span></div>
                {form.oemReference && <div className="flex justify-between"><span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Référence OEM</span><span className="text-gray-900 dark:text-white font-medium">{form.oemReference}</span></div>}
                {form.budgetIndicative && <div className="flex justify-between"><span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Budget indicatif</span><span className="text-gray-900 dark:text-white font-medium">{formatPrice(parseInt(form.budgetIndicative, 10), currencyForCountry(user?.country))}</span></div>}
                <div className="flex justify-between"><span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Ville</span><span className="text-gray-900 dark:text-white font-medium">{form.city || '—'}</span></div>
              </div>
            </div>
          </div>
        )}

        <BottomActionBar>
          {step === 1 && (
            <button onClick={() => setStep(2)} disabled={!form.brand || !form.model || !form.year || (searchMode === 'vin' && !form.vin)}
              className="flex-1 py-3.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 hover:bg-red-600-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
              Continuer
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {step === 2 && (
            <>
              <button onClick={() => setStep(1)} className="py-3 px-5 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl text-sm font-medium">Retour</button>
              <button onClick={() => setStep(3)} disabled={!form.partName}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 disabled:opacity-40 flex items-center justify-center gap-2">
                Continuer
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <button onClick={() => setStep(2)} className="py-3 px-5 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl text-sm font-medium">Retour</button>
              <button onClick={() => handleSubmit(true)} disabled={submitting}
                title="Enregistrer dans le panier"
                className="px-4 py-3.5 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl text-sm font-bold disabled:opacity-40 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </button>
              <button onClick={() => handleSubmit(false)} disabled={!form.city || submitting}
                className="flex-1 py-3.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 disabled:opacity-40 flex items-center justify-center gap-2">
                {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Rocket className="w-4 h-4" />}
                <span>{submitting ? 'Publication...' : 'Publier la demande'}</span>
              </button>
            </>
          )}
        </BottomActionBar>
      </div>

      <BottomNav />
    </div>
  );
}
