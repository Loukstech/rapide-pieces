import { useState } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../lib/auth';
import { useRequests, useSellers, addOffer, useOffersForRequest, acceptOffer, rejectOffer, counterOffer } from '../../lib/store';
import { PartQuality, QUALITY_LEVELS, DeliveryType, DELIVERY_OPTIONS, PartRequest, Offer, requestTitleLine, requestSubtitleLine } from '../../lib/types';
import { Badge, Button, Card, EmptyState, Input, ScreenContainer } from '../../components/ui';
import { colors } from '../../theme';

const AVAILABILITY_OPTIONS: { value: Offer['availability']; label: string }[] = [
  { value: 'immediate', label: 'Immédiate' },
  { value: '24h', label: '24 heures' },
  { value: '48h', label: '48 heures' },
  { value: '3-5days', label: '3-5 jours' },
];

export default function SellerRequestsScreen() {
  const { user } = useAuth();
  const { data: requests, loading, refetch: refetchRequests } = useRequests();
  const { data: sellers } = useSellers();
  const [openFormId, setOpenFormId] = useState<string | null>(null);

  const openRequests = requests.filter((r) => r.status === 'open' || r.status === 'matched');
  const currentSeller = sellers.find((s) => s.id === user?.id);

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetchRequests} />}
      >
        <Text style={styles.title}>Demandes des clients</Text>
        {openRequests.length === 0 ? (
          <EmptyState label="Aucune demande ouverte pour le moment." />
        ) : (
          <View style={{ gap: 12 }}>
            {openRequests.map((r) => (
              <RequestRow
                key={r.id}
                request={r}
                open={openFormId === r.id}
                onToggle={() => setOpenFormId(openFormId === r.id ? null : r.id)}
                onSubmitted={() => { setOpenFormId(null); refetchRequests(); }}
                sellerName={currentSeller?.name ?? user?.name ?? 'Vendeur'}
                sellerBadge={currentSeller?.badge ?? 'New Seller'}
                sellerScore={currentSeller?.rating ?? 0}
                sellerId={user?.id ?? ''}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function RequestRow({
  request, open, onToggle, onSubmitted, sellerName, sellerBadge, sellerScore, sellerId,
}: {
  request: PartRequest;
  open: boolean;
  onToggle: () => void;
  onSubmitted: () => void;
  sellerName: string;
  sellerBadge: string;
  sellerScore: number;
  sellerId: string;
}) {
  const [price, setPrice] = useState('');
  const [quality, setQuality] = useState<PartQuality>('Standard Aftermarket');
  const [availability, setAvailability] = useState<Offer['availability']>('immediate');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('RAPID_CITY');
  const [sending, setSending] = useState(false);
  const [countering, setCountering] = useState(false);
  const [counterPrice, setCounterPrice] = useState('');
  const [busy, setBusy] = useState(false);

  // Persisté (pas un simple state local) : empêche un vendeur d'envoyer plusieurs offres,
  // et permet d'afficher l'état de négociation (cahier §9).
  const { data: offersForRequest, refetch: refetchOffers } = useOffersForRequest(request.id);
  const myOffer = offersForRequest.find((o) => o.sellerId === sellerId);
  const sent = !!myOffer;

  const handleSend = async () => {
    if (!price) return;
    setSending(true);
    await addOffer({
      requestId: request.id,
      sellerId,
      sellerName,
      sellerBadge: sellerBadge as any,
      sellerScore,
      partName: request.partName,
      quality,
      price: Number(price),
      currency: 'FCFA',
      availability,
      deliveryType,
      deliveryTime: DELIVERY_OPTIONS.find((d) => d.type === deliveryType)?.timeframe ?? '',
    });
    setSending(false);
    await refetchOffers();
    onSubmitted();
  };

  const handleAccept = async () => {
    if (!myOffer) return;
    setBusy(true);
    await acceptOffer(myOffer.id, request.id);
    await refetchOffers();
    setBusy(false);
  };
  const handleReject = async () => {
    if (!myOffer) return;
    setBusy(true);
    await rejectOffer(myOffer.id);
    await refetchOffers();
    setBusy(false);
  };
  const handleCounter = async () => {
    if (!myOffer) return;
    const newPrice = parseInt(counterPrice, 10);
    if (!newPrice) return;
    setBusy(true);
    const result = await counterOffer(myOffer, newPrice, 'seller');
    if (result.success) { setCountering(false); setCounterPrice(''); await refetchOffers(); }
    setBusy(false);
  };

  return (
    <Card>
      <View style={styles.header}>
        {request.photo ? (
          <Image source={{ uri: request.photo }} style={styles.photo} />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.part}>{requestTitleLine(request)}</Text>
          <Text style={styles.meta}>{[requestSubtitleLine(request), request.location].filter(Boolean).join(' · ')}</Text>
          {request.oemReference ? <Text style={styles.oem}>Réf. OEM : {request.oemReference}</Text> : null}
        </View>
      </View>
      {request.description ? <Text style={styles.description}>{request.description}</Text> : null}
      {request.budgetIndicative ? <Text style={styles.budget}>Budget indicatif : {request.budgetIndicative.toLocaleString('fr-FR')} FCFA</Text> : null}

      {!open && !sent && (
        <Button label="Proposer une offre" variant="outline" onPress={onToggle} />
      )}

      {myOffer && myOffer.status === 'accepted' && <Badge label="Offre acceptée 🎉" tone="success" />}
      {myOffer && myOffer.status === 'rejected' && <Badge label="Offre refusée" tone="warning" />}
      {myOffer && myOffer.status === 'pending' && <Badge label="Offre envoyée ✓ — en attente de l'acheteur" tone="success" />}
      {myOffer && myOffer.status === 'countered' && myOffer.lastActor === 'seller' && (
        <Badge label="Contre-offre envoyée — en attente de l'acheteur" tone="success" />
      )}
      {myOffer && myOffer.status === 'countered' && myOffer.lastActor === 'buyer' && (
        <View style={{ gap: 8 }}>
          <Badge label={`L'acheteur propose ${myOffer.price.toLocaleString('fr-FR')} FCFA`} tone="warning" />
          {!countering ? (
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <View style={{ flex: 1 }}><Button label="Accepter" variant="success" onPress={handleAccept} loading={busy} /></View>
              <View style={{ flex: 1 }}><Button label="Contre-offre" variant="outline" disabled={busy || myOffer.round >= 3} onPress={() => { setCountering(true); setCounterPrice(String(myOffer.price)); }} /></View>
              <View style={{ flex: 1 }}><Button label="Refuser" variant="secondary" onPress={handleReject} loading={busy} /></View>
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              <Input value={counterPrice} onChangeText={setCounterPrice} keyboardType="number-pad" />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}><Button label="Envoyer" onPress={handleCounter} loading={busy} /></View>
                <View style={{ flex: 1 }}><Button label="Annuler" variant="secondary" onPress={() => setCountering(false)} /></View>
              </View>
            </View>
          )}
        </View>
      )}

      {open && !sent && (
        <View style={{ gap: 10, marginTop: 10 }}>
          <Input label="Prix (FCFA)" placeholder="Ex: 35000" value={price} onChangeText={setPrice} keyboardType="number-pad" />
          <View style={{ gap: 6 }}>
            <Text style={styles.label}>Qualité</Text>
            <View style={styles.chips}>
              {QUALITY_LEVELS.map((q) => (
                <Chip key={q.value} label={q.label} active={quality === q.value} onPress={() => setQuality(q.value)} />
              ))}
            </View>
          </View>
          <View style={{ gap: 6 }}>
            <Text style={styles.label}>Disponibilité</Text>
            <View style={styles.chips}>
              {AVAILABILITY_OPTIONS.map((a) => (
                <Chip key={a.value} label={a.label} active={availability === a.value} onPress={() => setAvailability(a.value)} />
              ))}
            </View>
          </View>
          <View style={{ gap: 6 }}>
            <Text style={styles.label}>Livraison</Text>
            <View style={styles.chips}>
              {DELIVERY_OPTIONS.map((d) => (
                <Chip key={d.type} label={d.label} active={deliveryType === d.type} onPress={() => setDeliveryType(d.type)} />
              ))}
            </View>
          </View>
          <Button label="Envoyer" onPress={handleSend} loading={sending} disabled={!price} />
        </View>
      )}
    </Card>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Text onPress={onPress} style={[styles.chip, active && styles.chipActive]}>{label}</Text>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 16, paddingBottom: 60 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  header: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  photo: { width: 56, height: 56, borderRadius: 10 },
  part: { fontSize: 14, fontWeight: '700', color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  oem: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  description: { fontSize: 12, color: colors.textMuted, marginBottom: 6 },
  budget: { fontSize: 12, color: colors.primary, fontWeight: '600', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '600', color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    fontSize: 11, fontWeight: '600', color: colors.textMuted, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  chipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary, color: colors.primary },
});
