import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BuyerStackParamList } from '../../navigation/types';
import { useAuth } from '../../lib/auth';
import { addRequest, uploadRequestPhoto } from '../../lib/store';
import { OPERATING_COUNTRIES, POPULAR_BRANDS, QUALITY_LEVELS, PartQuality, FUEL_TYPES, FuelType, CONDITION_TYPES } from '../../lib/types';
import { Button, Input, ScreenContainer } from '../../components/ui';
import { colors } from '../../theme';

export default function RequestNewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();
  const { user } = useAuth();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');
  const [cylinders, setCylinders] = useState('');
  const [vin, setVin] = useState('');
  const [partName, setPartName] = useState('');
  const [oemReference, setOemReference] = useState('');
  const [description, setDescription] = useState('');
  const [budgetIndicative, setBudgetIndicative] = useState('');
  const [quality, setQuality] = useState<PartQuality | undefined>(undefined);
  const [fuel, setFuel] = useState<FuelType | undefined>(undefined);
  const [condition, setCondition] = useState<'Nouveau' | 'Ancien' | undefined>(undefined);
  const [partPosition, setPartPosition] = useState('');
  const [note, setNote] = useState('');
  const [country, setCountry] = useState('Bénin');
  const [city, setCity] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = brand && model && year && partName && city && !submitting;
  const canSaveDraft = brand && model && year && partName && !submitting;

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
  };

  const handleSubmit = async (asDraft = false) => {
    if (!user) return;
    setError(null);
    if (asDraft ? !canSaveDraft : !canSubmit) {
      setError('Merci de compléter au moins la marque, le modèle, l\'année et la pièce.');
      return;
    }
    setSubmitting(true);
    const photoUrl = photoUri ? await uploadRequestPhoto(user.id, photoUri) : undefined;
    const created = await addRequest({
      vehicle: {
        brand, model, year: Number(year), engine, vin: vin || undefined,
        cylinders: cylinders ? Number(cylinders) : undefined,
      },
      partName,
      oemReference: oemReference || undefined,
      photo: photoUrl,
      description,
      quantity: 1,
      quality,
      fuel,
      condition,
      note: note || undefined,
      partPosition: partPosition || undefined,
      budgetIndicative: budgetIndicative ? Number(budgetIndicative) : undefined,
      location: city ? `${city}, ${country}` : '',
      buyerId: user.id,
      asDraft,
    });
    setSubmitting(false);
    if (!created) {
      setError("La demande n'a pas pu être envoyée. Réessayez.");
      return;
    }
    if (asDraft) {
      navigation.navigate('BuyerTabs', { screen: 'Cart' });
      return;
    }
    navigation.replace('Offers', { requestId: created.id });
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Publier une demande</Text>
        <Text style={styles.subtitle}>Décrivez ce que vous cherchez.</Text>

        <View style={styles.block}>
          <Text style={styles.label}>Marque du véhicule</Text>
          <View style={styles.chips}>
            {POPULAR_BRANDS.map((b) => (
              <Chip key={b} label={b} active={brand === b} onPress={() => setBrand(b)} />
            ))}
          </View>
        </View>

        <Input label="Modèle" placeholder="Ex: Corolla" value={model} onChangeText={setModel} />
        <Input label="Année" placeholder="Ex: 2019" value={year} onChangeText={setYear} keyboardType="number-pad" />
        <Input label="Type de moteur (optionnel)" placeholder="Ex: 1.8 essence" value={engine} onChangeText={setEngine} />
        <Input label="Cylindres (optionnel)" placeholder="Ex: 4" value={cylinders} onChangeText={setCylinders} keyboardType="number-pad" />
        <Input label="VIN / Numéro de châssis (optionnel)" placeholder="Ex: JT2AE09W7M0123456" value={vin} onChangeText={setVin} autoCapitalize="characters" />
        <Input label="Pièce recherchée" placeholder="Ex: Plaquettes de frein avant" value={partName} onChangeText={setPartName} />
        <Input label="Référence OEM (optionnel)" placeholder="Ex: 04465-06090" value={oemReference} onChangeText={setOemReference} />

        <View style={styles.block}>
          <Text style={styles.label}>Carburant (optionnel)</Text>
          <View style={styles.chips}>
            {FUEL_TYPES.map((f) => (
              <Chip key={f} label={f} active={fuel === f} onPress={() => setFuel(f)} />
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>Condition (optionnel)</Text>
          <View style={styles.chips}>
            {CONDITION_TYPES.map((c) => (
              <Chip key={c} label={c} active={condition === c} onPress={() => setCondition(c)} />
            ))}
          </View>
        </View>

        <Input label="Position de la pièce (optionnel)" placeholder="Ex: Avant gauche" value={partPosition} onChangeText={setPartPosition} />
        <Input
          label="Note (optionnel)"
          placeholder="Information complémentaire"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={2}
        />
        <Input
          label="Description (optionnel)"
          placeholder="Précisions utiles pour les vendeurs..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />
        <Input label="Budget indicatif (FCFA, optionnel)" placeholder="Ex: 50000" value={budgetIndicative} onChangeText={setBudgetIndicative} keyboardType="number-pad" />

        <View style={styles.block}>
          <Text style={styles.label}>Photo de la pièce (optionnel)</Text>
          {photoUri ? (
            <Pressable onPress={handlePickPhoto}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            </Pressable>
          ) : (
            <Pressable onPress={handlePickPhoto} style={styles.photoPicker}>
              <Text style={styles.photoPickerLabel}>+ Ajouter une photo</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>Qualité souhaitée (optionnel)</Text>
          <View style={styles.chips}>
            {QUALITY_LEVELS.map((q) => (
              <Chip key={q.value} label={q.label} active={quality === q.value} onPress={() => setQuality(q.value)} />
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>Pays</Text>
          <View style={styles.chips}>
            {OPERATING_COUNTRIES.map((c) => (
              <Chip key={c.country} label={c.country} active={country === c.country} onPress={() => { setCountry(c.country); setCity(''); }} />
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>Ville</Text>
          <View style={styles.chips}>
            {(OPERATING_COUNTRIES.find((c) => c.country === country)?.cities ?? []).map((c) => (
              <Chip key={c} label={c} active={city === c} onPress={() => setCity(c)} />
            ))}
          </View>
          <Text style={styles.hint}>Seule la ville est communiquée au vendeur avant la commande — pas d&apos;adresse précise.</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button label="Publier la demande" onPress={() => handleSubmit(false)} loading={submitting} disabled={!canSubmit} />
        <Button label="Enregistrer dans le panier" variant="secondary" onPress={() => handleSubmit(true)} disabled={submitting || !canSaveDraft} />
      </ScrollView>
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
  scroll: { padding: 20, gap: 16, paddingBottom: 60 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  block: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text },
  hint: { fontSize: 11, color: colors.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  chipLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  chipLabelActive: { color: colors.primary },
  error: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  photoPicker: {
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 12, paddingVertical: 24, alignItems: 'center', backgroundColor: '#fff',
  },
  photoPickerLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  photoPreview: { width: '100%', height: 160, borderRadius: 12, resizeMode: 'cover' },
});
