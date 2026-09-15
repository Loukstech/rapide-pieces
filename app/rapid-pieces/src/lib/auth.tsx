'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from './supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

export type UserRole = 'buyer' | 'seller' | 'admin' | null;

export type BuyerType = 'individual' | 'mechanic' | 'garage' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  phoneSecondary?: string;
  country?: string;
  location?: string;
  address?: string;
  rapidPoints?: number;
  buyerType?: BuyerType;
}

export interface RegisterInput {
  name: string;
  phone: string;
  phoneSecondary?: string;
  email?: string;
  country?: string;
  location?: string;
  address?: string;
  password: string;
  // Acheteur uniquement — détermine si l'accès aux véhicules enregistrés est autorisé
  // (réservé aux particuliers, cahier §8).
  buyerType?: BuyerType;
  // Champs propres à la boutique — vendeur uniquement, ignorés pour un acheteur.
  brands?: string[];
  categories?: string[];
  conditionTypes?: string[];
  stockLevel?: 'Grand' | 'Moyen' | 'Petit';
  paymentMethods?: string[];
  deliveryAvailable?: boolean;
  openingHours?: string;
  note?: string;
  paymentNumber?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  role?: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (phoneOrEmail: string, password: string) => Promise<AuthResult>;
  register: (role: 'buyer' | 'seller', data: RegisterInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  isLoading: true,
});

// Un compte inscrit sans email reçoit un email technique invisible pour l'utilisateur,
// requis par Supabase Auth — la vraie identité de connexion reste le téléphone.
function technicalEmail(phone: string): string {
  // ".local" est un TLD réservé (RFC 6761) que le validateur d'email du nouveau
  // projet Supabase rejette ("email_address_invalid") — l'ancien projet l'acceptait
  // encore, mais on utilise un domaine réel pour rester valide partout.
  return `${phone.replace(/\D/g, '')}@phone.rapidpieces.com`;
}

async function loadProfile(supabase: SupabaseClient, authUser: { id: string; email?: string }): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, name, phone, phone_secondary, country, location, address, rapid_points, buyer_type')
    .eq('id', authUser.id)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    email: authUser.email ?? '',
    role: data.role,
    phone: data.phone ?? undefined,
    phoneSecondary: data.phone_secondary ?? undefined,
    country: data.country ?? undefined,
    location: data.location ?? undefined,
    address: data.address ?? undefined,
    rapidPoints: data.rapid_points,
    buyerType: data.buyer_type ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await loadProfile(supabase, session.user);
        if (active) setUser(profile);
      }
      if (active) setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await loadProfile(supabase, session.user);
        if (active) setUser(profile);
      } else if (active) {
        setUser(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const login = async (phoneOrEmail: string, password: string): Promise<AuthResult> => {
    let email = phoneOrEmail.trim();
    if (!email.includes('@')) {
      const { data: resolvedEmail, error: lookupError } = await supabase.rpc('email_for_phone', { p_phone: email });
      if (lookupError || !resolvedEmail) return { success: false, error: 'Numéro de téléphone non reconnu' };
      email = resolvedEmail;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { success: false, error: 'Identifiant ou mot de passe incorrect' };
    const profile = await loadProfile(supabase, data.user);
    if (!profile) return { success: false, error: 'Profil introuvable pour ce compte' };
    setUser(profile);
    return { success: true, role: profile.role };
  };

  const register = async (role: 'buyer' | 'seller', input: RegisterInput): Promise<AuthResult> => {
    const authEmail = input.email?.trim() || technicalEmail(input.phone);
    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: input.password,
      options: {
        data: {
          role, name: input.name, phone: input.phone, phoneSecondary: input.phoneSecondary,
          location: input.location, country: input.country, address: input.address,
          ...(role === 'buyer' ? { buyerType: input.buyerType } : {}),
          ...(role === 'seller' ? {
            brands: input.brands ?? [],
            categories: input.categories ?? [],
            conditionTypes: input.conditionTypes ?? [],
            stockLevel: input.stockLevel,
            paymentMethods: input.paymentMethods ?? [],
            deliveryAvailable: input.deliveryAvailable ?? false,
            openingHours: input.openingHours,
            note: input.note,
            paymentNumber: input.paymentNumber,
          } : {}),
        },
      },
    });
    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        return { success: false, error: 'Ce téléphone ou cet email est déjà utilisé' };
      }
      return { success: false, error: error.message };
    }
    if (!data.user) return { success: false, error: 'Inscription impossible' };

    if (role === 'seller') {
      // Cahier section 4 : « après l'enregistrement, rediriger vers la page de connexion » —
      // pas d'auto-login pour un vendeur. signUp() ouvre déjà une session locale (la confirmation
      // email est désactivée sur ce projet) ; on la referme explicitement, sinon le
      // onAuthStateChange souscrit plus haut repeuplerait `user` tout seul.
      await supabase.auth.signOut();
      return { success: true, role };
    }

    const profile = await loadProfile(supabase, data.user);
    setUser(profile ?? { id: data.user.id, name: input.name, email: input.email ?? '', role, phone: input.phone, location: input.location });
    return { success: true, role };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Cahier V2 - Point 21 : changement de mot de passe depuis l'espace utilisateur.
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return error ? { success: false, error: error.message } : { success: true };
}

// Route protection helper
export function getHomeRoute(role: UserRole): string {
  switch (role) {
    case 'admin': return '/admin';
    case 'seller': return '/seller';
    case 'buyer': return '/';
    default: return '/welcome';
  }
}
