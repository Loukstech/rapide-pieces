'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, ArrowLeft, Lock, User, AlertTriangle } from 'lucide-react';
import { useAuth, getHomeRoute } from '@/lib/auth';
import { useFeatureFlag } from '@/lib/store';
import {
  POPULAR_BRANDS, POPULAR_CATEGORIES, OPERATING_COUNTRIES,
  CONDITION_TYPES, STOCK_LEVELS, PAYMENT_METHODS, BUYER_TYPES,
} from '@/lib/types';
import PhoneInput from '@/components/PhoneInput';
import PhoneOtpVerification from '@/components/PhoneOtpVerification';
import LanguageSelector from '@/components/LanguageSelector';
import { useToast } from '@/components/Toast';
import TermsModal from '@/components/TermsModal';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type Mode = 'login' | 'register';
type Role = 'buyer' | 'seller' | 'admin';
type StockLevel = (typeof STOCK_LEVELS)[number];

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();
  const { showToast } = useToast();
  // Réglage admin (013/030) : désactivé par défaut tant que le compte
  // Infobip est en mode démo (whitelist manuelle uniquement) — évite de
  // bloquer les inscriptions réelles pendant la période de test.
  const { data: otpRequired } = useFeatureFlag('phone_otp_required');
  const { t } = useLanguage();
  // Le rôle vient uniquement de l'écran de démarrage (/welcome) via ce paramètre — plus de
  // switch modifiable ici (cahier section 3 : supprimer le switch Acheteur/Vendeur à l'arrivée).
  const roleParam = searchParams.get('role');
  const role: Role = roleParam === 'admin' ? 'admin' : roleParam === 'seller' ? 'seller' : 'buyer';
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regAcceptTerms, setRegAcceptTerms] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPhoneSecondary, setRegPhoneSecondary] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCountry, setRegCountry] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regCustomCity, setRegCustomCity] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regBuyerType, setRegBuyerType] = useState<'individual' | 'mechanic' | 'garage' | 'business'>('individual');
  const [regBrands, setRegBrands] = useState<string[]>([]);
  const [regCategories, setRegCategories] = useState<string[]>([]);
  const [regConditionTypes, setRegConditionTypes] = useState<string[]>([]);
  const [regStockLevel, setRegStockLevel] = useState<StockLevel | ''>('');
  const [regPaymentMethods, setRegPaymentMethods] = useState<string[]>([]);
  const [regDeliveryAvailable, setRegDeliveryAvailable] = useState<boolean | null>(null);
  const [regNote, setRegNote] = useState('');
  const [regCustomBrand, setRegCustomBrand] = useState('');
  const [regCustomCategory, setRegCustomCategory] = useState('');
  const [regPaymentNumber, setRegPaymentNumber] = useState('');

  const toggleBrand = (b: string) => {
    if (b === 'Toutes les marques') {
      if (regBrands.includes('Toutes les marques')) {
        setRegBrands([]);
      } else {
        setRegBrands(['Toutes les marques']);
      }
    } else if (b === 'Autre') {
      if (regBrands.includes('Autre')) {
        setRegBrands(p => p.filter(x => x !== 'Autre'));
        setRegCustomBrand('');
      } else {
        setRegBrands(p => [...p.filter(x => x !== 'Toutes les marques' && x !== 'Autre'), 'Autre']);
      }
    } else {
      setRegBrands(p => {
        if (p.includes('Toutes les marques')) {
          return [b];
        }
        return p.includes(b) ? p.filter(x => x !== b) : [...p.filter(x => x !== 'Toutes les marques' && x !== 'Autre'), b];
      });
    }
  };
  const toggleCategory = (c: string) => {
    if (c === 'Toutes les pièces') {
      if (regCategories.includes('Toutes les pièces')) {
        setRegCategories([]);
      } else {
        setRegCategories(['Toutes les pièces']);
      }
    } else if (c === 'Autre') {
      if (regCategories.includes('Autre')) {
        setRegCategories(p => p.filter(x => x !== 'Autre'));
        setRegCustomCategory('');
      } else {
        setRegCategories(p => [...p.filter(x => x !== 'Toutes les pièces' && x !== 'Autre'), 'Autre']);
      }
    } else {
      setRegCategories(p => {
        if (p.includes('Toutes les pièces')) {
          return [c];
        }
        return p.includes(c) ? p.filter(x => x !== c) : [...p.filter(x => x !== 'Toutes les pièces' && x !== 'Autre'), c];
      });
    }
  };
  const toggleConditionType = (c: string) => setRegConditionTypes(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const togglePaymentMethod = (m: string) => setRegPaymentMethods(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(identifier, password);
    setIsLoading(false);
    if (result.success) {
      // Redirige selon le vrai rôle du compte (pas l'onglet sélectionné) — un admin qui se
      // connecte depuis l'onglet Client atterrit quand même sur /admin.
      router.push(getHomeRoute(result.role ?? role));
      return;
    }
    setError(result.error ?? t('common.loginIncorrect'));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (role === 'admin') {
      setError(t('common.adminRegisterDisabled'));
      return;
    }
    if (!regName || !regPhone || !password) { setError(t('common.fillRequiredFields')); return; }
    // Cahier V2 - Point 15 : le numéro doit être vérifié par OTP avant de
    // pouvoir finaliser l'inscription — sauf si désactivé par l'admin
    // (compte Infobip en mode démo, cf. réglage phone_otp_required).
    if (otpRequired && !phoneVerified) { setError(t('common.verifyPhone')); return; }
    // Cahier V2 - Point 16 : confirmation de mot de passe, obligatoire pour
    // acheteur et vendeur.
    if (password !== regPasswordConfirm) { setError(t('common.passwordsMismatch')); return; }
    // Cahier V2 - Point 39 : acceptation obligatoire des CGV, pour acheteur et
    // vendeur.
    if (!regAcceptTerms) { setError(t('common.acceptTermsRequired')); return; }
    if (role === 'seller' && !regPaymentNumber) { setError(t('common.paymentNumberRequired')); return; }
    setIsLoading(true);
    const cityName = regLocation === 'Autre' ? (regCustomCity || 'Autre') : regLocation;
    const location = cityName && regCountry ? `${cityName}, ${regCountry}` : cityName;
    const result = await register(role, {
      name: regName,
      password,
      phone: regPhone,
      phoneSecondary: regPhoneSecondary || undefined,
      email: regEmail || undefined,
      country: regCountry || undefined,
      location,
      address: regAddress || undefined,
      ...(role === 'buyer' ? { buyerType: regBuyerType } : {}),
      ...(role === 'seller' ? {
        brands: regBrands
          .filter(b => b !== 'Toutes les marques')
          .map(b => b === 'Autre' ? (regCustomBrand || 'Autre') : b),
        categories: regCategories
          .filter(c => c !== 'Toutes les pièces')
          .map(c => c === 'Autre' ? (regCustomCategory || 'Autre') : c),
        conditionTypes: regConditionTypes,
        stockLevel: regStockLevel || undefined,
        paymentMethods: regPaymentMethods,
        deliveryAvailable: regDeliveryAvailable ?? false,
        note: regNote || undefined,
        paymentNumber: regPaymentNumber,
      } : {}),
    });
    setIsLoading(false);
    if (result.success) {
      if (role === 'seller') {
        // Cahier section 4 : après l'enregistrement, redirection immédiate vers la connexion
        // (pas d'auto-login vendeur).
        reset();
        setMode('login');
        setInfo(t('auth.accountCreated'));
        return;
      }
      showToast(t('auth.accountCreated'), 'success');
      router.push(getHomeRoute(role));
      return;
    }
    setError(result.error ?? t('auth.registrationFailed'));
  };

  const reset = () => {
    setIdentifier(''); setPassword(''); setError(''); setInfo('');
    setRegName(''); setRegPhone(''); setRegPhoneSecondary(''); setRegEmail('');
    setRegCountry(''); setRegLocation(''); setRegAddress(''); setRegBuyerType('individual');
    setRegBrands([]); setRegCategories([]); setRegConditionTypes([]);
    setRegStockLevel(''); setRegPaymentMethods([]); setRegDeliveryAvailable(null);
    setRegNote('');
    setRegCustomBrand(''); setRegCustomCategory('');
    setRegPaymentNumber('');
    setPhoneVerified(false);
  };

  const sellerSubtitle = mode === 'register'
    ? t('auth.sellerDescription')
    : t('auth.sellerLoginSubtitle');

  const buyerSubtitle = mode === 'register'
    ? t('auth.buyerRegisterSubtitle')
    : t('auth.buyerLoginSubtitle');

  const pageTitle = role === 'admin' ? t('nav.adminSpace') : role === 'seller' ? t('nav.sellerSpace') : t('nav.buyerSpace');
  const pageSubtitle = role === 'admin' ? t('auth.adminLoginSubtitle') : role === 'seller' ? sellerSubtitle : buyerSubtitle;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      <div className="px-4 pt-4 flex justify-between items-center">
        <Link href="/welcome" className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300 dark:text-slate-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('common.back')}
        </Link>
        <LanguageSelector />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image src="/logo_rapidePiece.jpeg" alt="Rapide Pièces" width={240} height={80} className="h-20 w-auto object-contain mx-auto mb-4" priority />
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{pageTitle}</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 dark:text-slate-400 mt-1">
              {pageSubtitle}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
            {mode === 'login' && (
              <>
                <h2 className="text-center text-lg font-bold text-gray-900 dark:text-white dark:text-white mb-5">{t('auth.connect')}</h2>
                {info && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl mb-4 text-center">{info}</div>}
                {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-4 text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">{t('auth.phone')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 dark:text-slate-500" />
                      <input type="text" placeholder="+229 XX XX XX XX" value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">{t('auth.password')}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 dark:text-slate-500" />
                      <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300 dark:text-slate-300">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading || !identifier || !password}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {t('auth.loginInProgress')}</> : t('auth.connect')}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">
                    {role === 'admin' ? t('auth.adminAccountRequired') : t('auth.noAccount')}{' '}
                    {role !== 'admin' && <button onClick={() => { setMode('register'); reset(); }} className="text-red-600 font-semibold hover:underline">{t('auth.createAccount')}</button>}
                  </p>
                </div>
              </>
            )}

            {mode === 'register' && (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <button onClick={() => { setMode('login'); reset(); }} className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300 dark:text-slate-300"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">{role === 'seller' ? t('auth.sellerRegister') : t('auth.buyerRegister')}</h2>
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-4 text-center">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">{role === 'seller' ? t('auth.storeName') : t('auth.fullName')} <span className="text-red-500">*</span></label>
                    <input type="text" placeholder={role === 'seller' ? t('auth.placeholderStore') : t('auth.placeholderName')} value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                  </div>

                  {role === 'buyer' && (
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-2 block">{t('auth.youAre')}</label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
                        {BUYER_TYPES.map((bt) => (
                          <button key={bt.value} type="button" onClick={() => setRegBuyerType(bt.value)}
                            className={`py-2 rounded-lg text-xs font-semibold transition-all ${regBuyerType === bt.value ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : 'text-gray-500 dark:text-slate-400'}`}>{t(`auth.buyer${bt.value.charAt(0).toUpperCase() + bt.value.slice(1)}`)}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pays/Ville avant le téléphone : PhoneInput affiche l'indicatif du pays
                      choisi, il doit donc être sélectionné avant la saisie du numéro. */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">{t('auth.country')}</label>
                      <select value={regCountry} onChange={(e) => { setRegCountry(e.target.value); setRegLocation(''); setRegCustomCity(''); }}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option value="">{t('auth.select')}</option>
                        {OPERATING_COUNTRIES.map((c) => <option key={c.country} value={c.country}>{c.country}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">{t('auth.city')}</label>
                      <select value={regLocation} onChange={(e) => { setRegLocation(e.target.value); if (e.target.value !== 'Autre') setRegCustomCity(''); }} disabled={!regCountry}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50">
                        <option value="">{t('auth.select')}</option>
                        {(OPERATING_COUNTRIES.find((c) => c.country === regCountry)?.cities ?? []).map((city) => <option key={city} value={city}>{city}</option>)}
                        <option value="Autre">Autre</option>
                      </select>
                      {regLocation === 'Autre' && (
                        <input type="text" placeholder={t('auth.specifyCity')} value={regCustomCity}
                          onChange={(e) => setRegCustomCity(e.target.value)}
                          className="mt-2 w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                      )}
                    </div>
                  </div>

                  <PhoneInput
                    label={role === 'seller' ? t('auth.phoneNumber') : t('auth.phone')}
                    country={regCountry}
                    value={regPhone}
                    onChange={(v) => { setRegPhone(v); setPhoneVerified(false); }}
                    required
                  />
                  {otpRequired && (
                    <PhoneOtpVerification phone={regPhone} verified={phoneVerified} onVerified={() => setPhoneVerified(true)} />
                  )}
                  {role === 'seller' && (
                    <PhoneInput
                      label={t('auth.otherPhone')}
                      country={regCountry}
                      value={regPhoneSecondary}
                      onChange={setRegPhoneSecondary}
                    />
                  )}

                  {role === 'seller' && (
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">{t('auth.address')}</label>
                      <input type="text" placeholder="Ex: Marché Dantokpa, Ilot 42" value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">{t('auth.emailOptional')}</label>
                    <input type="email" placeholder={t('auth.placeholderEmail')} value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">{t('auth.passwordRequired')} <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 pr-10 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-600 dark:text-slate-300 dark:text-slate-300">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">{t('auth.confirmPassword')} <span className="text-red-500">*</span></label>
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={regPasswordConfirm}
                      onChange={(e) => setRegPasswordConfirm(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                    {regPasswordConfirm && password !== regPasswordConfirm && (
                      <p className="text-[11px] text-red-500 mt-1">{t('common.passwordsMismatch')}</p>
                    )}
                  </div>

                  {role === 'seller' && (
                    <>
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-2 block">{t('auth.brands')}</label>
                        <div className="flex flex-wrap gap-1.5">
                          {POPULAR_BRANDS.map(b => (
                            <button key={b} type="button" onClick={() => toggleBrand(b)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${regBrands.includes(b) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 dark:text-slate-400 dark:text-slate-400'}`}>{b}</button>
                          ))}
                        </div>
                        {regBrands.includes('Autre') && (
                          <input
                            type="text"
                            placeholder={t('auth.specifyBrand')}
                            value={regCustomBrand}
                            onChange={(e) => setRegCustomBrand(e.target.value)}
                            className="mt-2 w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-2 block">{t('auth.parts')}</label>
                        <div className="flex flex-wrap gap-1.5">
                          {POPULAR_CATEGORIES.map(c => (
                            <button key={c} type="button" onClick={() => toggleCategory(c)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${regCategories.includes(c) ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500 dark:text-slate-400 dark:text-slate-400'}`}>{c}</button>
                          ))}
                        </div>
                        {regCategories.includes('Autre') && (
                          <input
                            type="text"
                            placeholder={t('auth.specifyCategory')}
                            value={regCustomCategory}
                            onChange={(e) => setRegCustomCategory(e.target.value)}
                            className="mt-2 w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-2 block">{t('auth.condition')}</label>
                        <div className="flex flex-wrap gap-1.5">
                          {CONDITION_TYPES.map(c => (
                            <button key={c} type="button" onClick={() => toggleConditionType(c)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${regConditionTypes.includes(c) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 dark:text-slate-400'}`}>{t('condition.' + (c === 'Nouveau' ? 'new' : 'used'))}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-2 block">{t('auth.stockLevel')}</label>
                        <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
                          {STOCK_LEVELS.map(s => (
                            <button key={s} type="button" onClick={() => setRegStockLevel(s)}
                              className={`py-2 rounded-lg text-xs font-semibold transition-all ${regStockLevel === s ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : 'text-gray-500 dark:text-slate-400'}`}>{t('stock.' + (s === 'Grand' ? 'large' : s === 'Moyen' ? 'medium' : 'small'))}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-2 block">{t('auth.paymentConditions')}</label>
                        <div className="flex flex-wrap gap-1.5">
                          {PAYMENT_METHODS.map(m => (
                            <button key={m} type="button" onClick={() => togglePaymentMethod(m)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${regPaymentMethods.includes(m) ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500 dark:text-slate-400'}`}>{t('payment.' + (m === 'Cash' ? 'cash' : m === 'Mobile' ? 'mobile' : 'bank'))}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">{t('auth.paymentNumberRequired')} <span className="text-red-500">*</span></label>
                        <input type="text" placeholder={t('auth.placeholderPaymentNumber')} value={regPaymentNumber}
                          onChange={(e) => setRegPaymentNumber(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-2 block">{t('auth.deliveryService')}</label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
                          <button type="button" onClick={() => setRegDeliveryAvailable(true)}
                            className={`py-2 rounded-lg text-xs font-semibold transition-all ${regDeliveryAvailable === true ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : 'text-gray-500 dark:text-slate-400'}`}>{t('auth.yes')}</button>
                          <button type="button" onClick={() => setRegDeliveryAvailable(false)}
                            className={`py-2 rounded-lg text-xs font-semibold transition-all ${regDeliveryAvailable === false ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : 'text-gray-500 dark:text-slate-400'}`}>{t('auth.no')}</button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">{t('auth.note')}</label>
                        <textarea placeholder={t('auth.placeholderNote')} value={regNote} rows={3}
                          onChange={(e) => setRegNote(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" />
                      </div>

                    </>
                  )}

                  <label className="flex items-start gap-2 text-xs text-gray-600 dark:text-slate-300">
                    <input type="checkbox" checked={regAcceptTerms} onChange={(e) => setRegAcceptTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-blue-600" />
                    <span>
                      {t('auth.acceptTerms')}{' '}
                      <button type="button" onClick={() => setShowTerms(true)} className="text-blue-600 underline hover:text-blue-700">
                        {t('auth.termsLink')}
                      </button>
                    </span>
                  </label>

                  <button type="submit" disabled={!password || !regName || !regPhone || !regAcceptTerms || (otpRequired && !phoneVerified) || password !== regPasswordConfirm}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50">
                    {t('auth.registerButton')}
                  </button>
                </form>

                {role === 'seller' && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-[10px] text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {t('auth.pendingVerification')}</p>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">
                    {t('auth.alreadyHaveAccount')}{' '}
                    <button onClick={() => { setMode('login'); reset(); }} className="text-blue-600 font-semibold hover:underline">{t('auth.loginLink')}</button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </div>
  );
}
