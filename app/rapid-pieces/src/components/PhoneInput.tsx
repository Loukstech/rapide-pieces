'use client';

import { callingCodeForCountry } from '@/lib/types';

interface PhoneInputProps {
  label: string;
  country: string;
  value: string;
  onChange: (fullValue: string) => void;
  placeholder?: string;
  required?: boolean;
}

// Cahier section 1 : l'indicatif du pays doit s'afficher automatiquement selon le pays
// sélectionné (ex: Bénin -> +229). La valeur applicative reste une chaîne unique
// "+229 XX XX XX XX" (compatible avec RegisterInput.phone: string), reconstruite ici.
export default function PhoneInput({ label, country, value, onChange, placeholder, required }: PhoneInputProps) {
  const code = callingCodeForCountry(country) ?? '+…';
  
  // Détection : si l'utilisateur a déjà entré l'indicatif complet, utiliser la valeur telle quelle
  // Sinon, reconstruire avec l'indicatif du pays
  const hasOwnCode = value && (value.startsWith('+') && value.length > code.length && !value.startsWith(code));
  const displayValue = hasOwnCode ? value : value.startsWith(code) ? value.slice(code.length).trimStart() : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Si l'utilisateur entre un numéro qui commence déjà par un indicatif, le garder tel quel
    if (newValue.startsWith('+')) {
      onChange(newValue);
    } else {
      onChange(newValue ? `${code} ${newValue}` : '');
    }
  };

  return (
    <div>
      <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="flex items-center gap-2">
        <span className="px-3 py-3 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-gray-500 dark:text-slate-300 font-medium select-none">
          {code}
        </span>
        <input
          type="tel"
          placeholder={placeholder ?? 'XX XX XX XX'}
          value={displayValue}
          onChange={handleChange}
          className="flex-1 min-w-0 px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
