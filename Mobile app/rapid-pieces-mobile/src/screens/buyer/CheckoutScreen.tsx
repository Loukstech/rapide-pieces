import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BuyerStackParamList } from '../../navigation/types';
import { useAuth } from '../../lib/auth';
import { useOfferById, useRequestById, addOrder, addRapidPoints } from '../../lib/store';
import { Button, Card, ScreenContainer } from '../../components/ui';
import { colors } from '../../theme';

export default function CheckoutScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();
  const route = useRoute<RouteProp<BuyerStackParamList, 'Checkout'>>();
  const { offerId, requestId } = route.params;
  const { user } = useAuth();

  const { data: offer, loading: offerLoading } = useOfferById(offerId);
  const { data: request, loading: requestLoading } = useRequestById(requestId);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (offerLoading || requestLoading) {
    return (
      <ScreenContainer style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!offer || !request || !user) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={styles.metaText}>Offre introuvable.</Text>
      </ScreenContainer>
    );
  }

  const handleConfirmPayment = async () => {
    setError(null);
    setPaying(true);
    const order = await addOrder({
      requestId: request.id,
      offerId: offer.id,
      buyerId: user.id,
      sellerId: offer.sellerId,
      sellerName: offer.sellerName,
      partName: offer.partName,
      vehicle: request.vehicle,
      price: offer.price,
      deliveryType: offer.deliveryType,
    });
    if (!order) {
      setPaying(false);
      setError("Le paiement n'a pas pu être confirmé. Réessayez.");
      return;
    }
    await addRapidPoints(user.id, offer.price);
    setPaying(false);
    setDone(true);
  };

  if (done) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={styles.successTitle}>Paiement confirmé ✓</Text>
        <Text style={styles.metaText}>Le paiement est retenu en sécurité (escrow) jusqu&apos;à confirmation de livraison.</Text>
        <View style={{ height: 16 }} />
        <Button
          label="Voir mes commandes"
          onPress={() => navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: 'BuyerTabs', state: { routes: [{ name: 'Orders' }] } }],
          }))}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Confirmer la commande</Text>

        <Card>
          <Text style={styles.rowLabel}>Pièce</Text>
          <Text style={styles.rowValue}>{offer.partName}</Text>
          <View style={styles.divider} />
          <Text style={styles.rowLabel}>Véhicule</Text>
          <Text style={styles.rowValue}>{request.vehicle.brand} {request.vehicle.model} {request.vehicle.year}</Text>
          <View style={styles.divider} />
          <Text style={styles.rowLabel}>Qualité</Text>
          <Text style={styles.rowValue}>{offer.quality}</Text>
          <View style={styles.divider} />
          <Text style={styles.rowLabel}>Livraison</Text>
          <Text style={styles.rowValue}>{offer.deliveryTime || offer.deliveryType}</Text>
          <View style={styles.divider} />
          <Text style={styles.rowLabel}>Total</Text>
          <Text style={styles.total}>{offer.price.toLocaleString('fr-FR')} FCFA</Text>
        </Card>

        <Card style={styles.escrowNote}>
          <Text style={styles.escrowText}>
            🔒 Votre paiement est retenu en séquestre (escrow) et ne sera versé au vendeur qu&apos;une fois la livraison confirmée.
          </Text>
        </Card>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button label="Payer" onPress={handleConfirmPayment} loading={paying} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  scroll: { padding: 20, gap: 16, paddingBottom: 60 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  rowLabel: { fontSize: 11, color: colors.textMuted, marginBottom: 2 },
  rowValue: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 10 },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 10 },
  total: { fontSize: 20, fontWeight: '800', color: colors.primary },
  escrowNote: { backgroundColor: colors.successSoft, borderColor: colors.successBorder },
  escrowText: { fontSize: 12, color: colors.success, lineHeight: 18 },
  error: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  successTitle: { fontSize: 20, fontWeight: '800', color: colors.success, marginBottom: 8 },
  metaText: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
});
