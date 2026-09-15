import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BuyerStackParamList } from '../../navigation/types';
import { useOffersForRequest, useRequestById, computeRapidScore, acceptOffer, rejectOffer, counterOffer } from '../../lib/store';
import { requestTitleLine, requestSubtitleLine, MAX_ACTIVE_SELLERS_PER_REQUEST, type Offer } from '../../lib/types';
import { Badge, Button, Card, EmptyState, Input, ScreenContainer } from '../../components/ui';
import { colors } from '../../theme';

export default function OffersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();
  const route = useRoute<RouteProp<BuyerStackParamList, 'Offers'>>();
  const { requestId } = route.params;

  const { data: request, loading: requestLoading } = useRequestById(requestId);
  const { data: offers, loading: offersLoading, refetch } = useOffersForRequest(requestId);
  const [counteringId, setCounteringId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const activeOffers = offers.filter((o) => o.status !== 'rejected');
  const activeSellersCount = activeOffers.filter((o) => o.status === 'countered' || o.status === 'accepted').length;

  const handleAccept = async (offer: Offer) => {
    setBusyId(offer.id);
    await acceptOffer(offer.id, requestId);
    await refetch();
    setBusyId(null);
  };
  const handleReject = async (offer: Offer) => {
    setBusyId(offer.id);
    await rejectOffer(offer.id);
    await refetch();
    setBusyId(null);
  };
  const handleCounter = async (offer: Offer) => {
    const price = parseInt(counterPrice, 10);
    if (!price) return;
    setBusyId(offer.id);
    const result = await counterOffer(offer, price, 'buyer');
    if (!result.success) setActionError(result.error ?? 'Action impossible');
    else { setCounteringId(null); setCounterPrice(''); await refetch(); }
    setBusyId(null);
  };

  if (requestLoading || offersLoading) {
    return (
      <ScreenContainer style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </ScreenContainer>
    );
  }

  const ranked = [...activeOffers].sort((a, b) => {
    const scoreA = computeRapidScore(a, activeOffers.filter((o) => o.id !== a.id)).total;
    const scoreB = computeRapidScore(b, activeOffers.filter((o) => o.id !== b.id)).total;
    return scoreB - scoreA;
  });

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        {request && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{requestTitleLine(request)}</Text>
            <Text style={styles.headerMeta}>
              {[requestSubtitleLine(request), request.location].filter(Boolean).join(' · ')}
            </Text>
          </View>
        )}

        {ranked.length === 0 ? (
          <EmptyState label="Aucune offre reçue pour l'instant. Les vendeurs sont notifiés." />
        ) : (
          <View style={{ gap: 12 }}>
            {ranked.map((offer) => {
              const { total } = computeRapidScore(offer, activeOffers.filter((o) => o.id !== offer.id));
              const isAccepted = offer.status === 'accepted';
              const isBuyerTurn = offer.lastActor === 'seller' && !isAccepted;
              const canCounter = offer.round < 3 && (offer.status === 'countered' || activeSellersCount < MAX_ACTIVE_SELLERS_PER_REQUEST);
              const displayName = isAccepted
                ? offer.sellerName
                : `Vendeur ${offer.sellerBadge} · #${offer.sellerId.slice(-4).toUpperCase()}`;
              return (
                <Card key={offer.id} style={isAccepted ? styles.cardSelected : undefined}>
                  <View style={styles.offerTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sellerName}>{displayName}</Text>
                      <Text style={styles.quality}>{offer.quality}</Text>
                    </View>
                    <Badge label={`Rapid Score ${total}`} tone="primary" />
                  </View>

                  <View style={styles.offerMeta}>
                    <Text style={styles.price}>{offer.price.toLocaleString('fr-FR')} FCFA</Text>
                    <Text style={styles.metaText}>Livraison : {offer.deliveryTime || offer.deliveryType}</Text>
                  </View>

                  {offer.description ? <Text style={styles.description}>{offer.description}</Text> : null}

                  {isAccepted ? (
                    <Button label="Payer maintenant" onPress={() => navigation.navigate('Checkout', { offerId: offer.id, requestId })} />
                  ) : !isBuyerTurn ? (
                    <Text style={styles.metaText}>En attente de la réponse du vendeur…</Text>
                  ) : counteringId === offer.id ? (
                    <View style={{ gap: 8 }}>
                      {actionError ? <Text style={styles.error}>{actionError}</Text> : null}
                      <Input value={counterPrice} onChangeText={setCounterPrice} keyboardType="number-pad" />
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <View style={{ flex: 1 }}><Button label="Envoyer" onPress={() => handleCounter(offer)} loading={busyId === offer.id} /></View>
                        <View style={{ flex: 1 }}><Button label="Annuler" variant="secondary" onPress={() => setCounteringId(null)} /></View>
                      </View>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <View style={{ flex: 1 }}><Button label="Accepter" variant="success" onPress={() => handleAccept(offer)} loading={busyId === offer.id} /></View>
                      <View style={{ flex: 1 }}><Button label="Contre-offre" variant="outline" disabled={busyId === offer.id || !canCounter} onPress={() => { setCounteringId(offer.id); setCounterPrice(String(offer.price)); setActionError(null); }} /></View>
                      <View style={{ flex: 1 }}><Button label="Refuser" variant="secondary" onPress={() => handleReject(offer)} loading={busyId === offer.id} /></View>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20, gap: 20, paddingBottom: 60 },
  header: { gap: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  headerMeta: { fontSize: 13, color: colors.textMuted },
  cardSelected: { borderColor: colors.primary, borderWidth: 1.5 },
  offerTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 },
  sellerName: { fontSize: 14, fontWeight: '700', color: colors.text },
  quality: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  offerMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  price: { fontSize: 18, fontWeight: '800', color: colors.text },
  metaText: { fontSize: 12, color: colors.textMuted },
  description: { fontSize: 12, color: colors.textMuted, marginBottom: 10 },
  error: { color: colors.primary, fontSize: 12, fontWeight: '600' },
});
