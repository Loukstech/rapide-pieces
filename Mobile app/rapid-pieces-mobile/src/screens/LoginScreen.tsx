import { useState } from 'react';
import {
  Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../lib/auth';
import {
  OPERATING_COUNTRIES, POPULAR_BRANDS, POPULAR_CATEGORIES,
  CONDITION_TYPES, STOCK_LEVELS, PAYMENT_METHODS, BUYER_TYPES,
} from '../lib/types';
import { Button, Input, ScreenContainer } from '../components/ui';
import { PhoneInput } from '../components/PhoneInput';
import type { AuthStackParamList } from '../navigation/types';
import { colors } from '../theme';

type Role = 'buyer' | 'seller';
type StockLevel = (typeof STOCK_LEVELS)[number];
type LoginRoute = RouteProp<AuthStackParamList, 'Login'>;
type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const { login, register } = useAuth();
  const navigation = useNavigation<Nav>();
  const route = useRoute<LoginRoute>();
  const role: Role = route.params?.role ?? 'buyer';
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneSecondary, setPhoneSecondary] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [country, setCountry] = useState('Bénin');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [buyerType, setBuyerType] = useState<'individual' | 'mechanic' | 'garage' | 'business'>('individual');
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [conditionTypes, setConditionTypes] = useState<string[]>([]);
  const [stockLevel, setStockLevel] = useState<StockLevel | ''>('');
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean | null>(null);
  const [openingHours, setOpeningHours] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const resetRegisterFields = () => {
    setName(''); setPhone(''); setPhoneSecondary(''); setRegEmail('');
    setCountry('Bénin'); setCity(''); setAddress(''); setBuyerType('individual');
    setBrands([]); setCategories([]); setConditionTypes([]);
    setStockLevel(''); setPaymentMethods([]); setDeliveryAvailable(null);
    setOpeningHours(''); setNote('');
  };

  const handleSubmit = async () => {
    setError(null);
    setInfo(null);
    if (!password || (mode === 'login' ? !identifier : (!name || !phone))) {
      setError('Merci de remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    const result = mode === 'login'
      ? await login(identifier, password)
      : await register(role, {
        name,
        phone,
        phoneSecondary: phoneSecondary || undefined,
        email: regEmail || undefined,
        country,
        location: city ? `${city}, ${country}` : undefined,
        address: address || undefined,
        password,
        ...(role === 'buyer' ? { buyerType } : {}),
        ...(role === 'seller' ? {
          brands,
          categories,
          conditionTypes,
          stockLevel: stockLevel || undefined,
          paymentMethods,
          deliveryAvailable: deliveryAvailable ?? false,
          openingHours: openingHours || undefined,
          note: note || undefined,
        } : {}),
      });
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "Une erreur est survenue.");
      return;
    }
    if (mode === 'register' && role === 'seller') {
      // Cahier section 4 : après l'enregistrement, redirection immédiate vers la connexion
      // (pas d'auto-login vendeur — register() ne connecte plus le vendeur automatiquement).
      resetRegisterFields();
      setPassword('');
      setMode('login');
      setInfo('Compte créé. Connectez-vous pour accéder à votre boutique.');
      return;
    }
    // Acheteur : la navigation bascule automatiquement (RootNavigator écoute useAuth().user)
  };

  const sellerSubtitle = mode === 'register'
    ? 'Enregistrer votre boutique et commencer à vendre'
    : 'Connectez-vous et commencez à vendre dès aujourd’hui.';

  const buyerSubtitle = mode === 'register'
    ? 'Enregistrez-vous pour commencer à commander des pièces'
    : 'Connectez-vous pour commencer à commander des pièces';

  return (
    <ScreenContainer>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => navigation.navigate('Welcome')} hitSlop={8}>
            <Text style={styles.backLink}>← Choisir un profil</Text>
          </Pressable>

          <View style={styles.header}>
            <Image source={require('../../assets/logo-wordmark.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.subtitle}>
              {role === 'seller' ? sellerSubtitle : buyerSubtitle}
            </Text>
          </View>

          <View style={styles.form}>
            {mode === 'register' && (
              <>
                <Input label={role === 'seller' ? 'Nom du magasin *' : 'Nom complet *'} placeholder="Ex: Jean Kakpassi" value={name} onChangeText={setName} />
                {role === 'buyer' && (
                  <View style={{ gap: 8 }}>
                    <Text style={styles.label}>Vous êtes</Text>
                    <View style={styles.chips}>
                      {BUYER_TYPES.map((t) => (
                        <Chip key={t.value} label={t.label} active={buyerType === t.value} onPress={() => setBuyerType(t.value)} />
                      ))}
                    </View>
                  </View>
                )}
                {/* Pays/Ville avant le téléphone : PhoneInput affiche l'indicatif du pays
                    choisi, il doit donc être sélectionné avant la saisie du numéro. */}
                <View style={{ gap: 8 }}>
                  <Text style={styles.label}>Pays</Text>
                  <View style={styles.chips}>
                    {OPERATING_COUNTRIES.map((c) => (
                      <Chip key={c.country} label={c.country} active={country === c.country} onPress={() => { setCountry(c.country); setCity(''); }} />
                    ))}
                  </View>
                </View>
                <View style={{ gap: 8 }}>
                  <Text style={styles.label}>Ville</Text>
                  <View style={styles.chips}>
                    {(OPERATING_COUNTRIES.find((c) => c.country === country)?.cities ?? []).map((c) => (
                      <Chip key={c} label={c} active={city === c} onPress={() => setCity(c)} />
                    ))}
                  </View>
                </View>

                <PhoneInput label={role === 'seller' ? 'Numéro de téléphone principal *' : 'Téléphone *'} country={country} value={phone} onChangeText={setPhone} />
                {role === 'seller' && (
                  <PhoneInput label="Autre numéro" country={country} value={phoneSecondary} onChangeText={setPhoneSecondary} />
                )}
                <Input label="Email (optionnel)" placeholder="votre@email.com" value={regEmail} onChangeText={setRegEmail}
                  autoCapitalize="none" keyboardType="email-address" />

                {role === 'seller' && (
                  <Input label="Adresse" placeholder="Ex: Marché Dantokpa, Ilot 42" value={address} onChangeText={setAddress} />
                )}

                {role === 'seller' && (
                  <>
                    <View style={{ gap: 8 }}>
                      <Text style={styles.label}>Marques</Text>
                      <View style={styles.chips}>
                        {POPULAR_BRANDS.map((b) => (
                          <Chip key={b} label={b} active={brands.includes(b)} onPress={() => toggle(brands, setBrands, b)} />
                        ))}
                      </View>
                    </View>
                    <View style={{ gap: 8 }}>
                      <Text style={styles.label}>Pièces</Text>
                      <View style={styles.chips}>
                        {POPULAR_CATEGORIES.slice(0, 8).map((c) => (
                          <Chip key={c} label={c} active={categories.includes(c)} onPress={() => toggle(categories, setCategories, c)} />
                        ))}
                      </View>
                    </View>
                    <View style={{ gap: 8 }}>
                      <Text style={styles.label}>Condition</Text>
                      <View style={styles.chips}>
                        {CONDITION_TYPES.map((c) => (
                          <Chip key={c} label={c} active={conditionTypes.includes(c)} onPress={() => toggle(conditionTypes, setConditionTypes, c)} />
                        ))}
                      </View>
                    </View>
                    <View style={{ gap: 8 }}>
                      <Text style={styles.label}>Niveau du stock</Text>
                      <View style={styles.chips}>
                        {STOCK_LEVELS.map((s) => (
                          <Chip key={s} label={s} active={stockLevel === s} onPress={() => setStockLevel(s)} />
                        ))}
                      </View>
                    </View>
                    <View style={{ gap: 8 }}>
                      <Text style={styles.label}>Conditions de paiement</Text>
                      <View style={styles.chips}>
                        {PAYMENT_METHODS.map((m) => (
                          <Chip key={m} label={m} active={paymentMethods.includes(m)} onPress={() => toggle(paymentMethods, setPaymentMethods, m)} />
                        ))}
                      </View>
                    </View>
                    <View style={{ gap: 8 }}>
                      <Text style={styles.label}>Service de livraison</Text>
                      <View style={styles.chips}>
                        <Chip label="Oui" active={deliveryAvailable === true} onPress={() => setDeliveryAvailable(true)} />
                        <Chip label="Non" active={deliveryAvailable === false} onPress={() => setDeliveryAvailable(false)} />
                      </View>
                    </View>
                    <Input label="Horaires d'ouverture" placeholder="Ex: Lun-Sam 8h-19h" value={openingHours} onChangeText={setOpeningHours} />
                    <Input label="Note" placeholder="Informations complémentaires (optionnel)" value={note} onChangeText={setNote}
                      multiline numberOfLines={3} />
                  </>
                )}
              </>
            )}
            {mode === 'login' && (
              <Input label="Téléphone" placeholder="+229 XX XX XX XX ou email" value={identifier} onChangeText={setIdentifier}
                autoCapitalize="none" />
            )}
            <Input label="Mot de passe" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />

            {info ? <Text style={styles.info}>{info}</Text> : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              label={mode === 'login' ? 'Se connecter' : `Créer mon compte ${role === 'seller' ? 'vendeur' : 'acheteur'}`.trim()}
              onPress={handleSubmit}
              loading={loading}
            />

            <Text style={styles.switchMode} onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); setInfo(null); }}>
              {mode === 'login' ? "Pas encore de compte ? Ouvrir un compte" : 'Déjà un compte ? Se connecter'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center', gap: 24 },
  backLink: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  header: { alignItems: 'center', gap: 6 },
  logo: { width: 260, height: 56 },
  subtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  form: { gap: 14 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  chipLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  chipLabelActive: { color: colors.primary },
  error: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  info: { color: colors.success, fontSize: 13, fontWeight: '600' },
  switchMode: { textAlign: 'center', color: '#DC2626', fontSize: 13, fontWeight: '600', marginTop: 4 },
});
