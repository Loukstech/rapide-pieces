import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BuyerStackParamList } from '../../navigation/types';
import { useAuth } from '../../lib/auth';
import { useRequestDrafts, publishRequestDraft, deleteRequest, usePendingPayments, cancelAcceptedOffer } from '../../lib/store';
import { requestTitleLine, requestSubtitleLine } from '../../lib/types';
import { Badge, Button, Card, EmptyState, ScreenContainer } from '../../components/ui';
import { colors } from '../../theme';

// Cahier section 8 : panier acheteur — demandes préparées mais pas encore envoyées,
// et indicateur des paiements en attente (offre acceptée non encore payée).
export default function CartScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();
  const { user } = useAuth();
  const { data: drafts, loading, refetch } = useRequestDrafts(user?.id);
  const { data: pendingPayments, refetch: refetchPending } = usePendingPayments(user?.id);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleSend = async (id: string) => {
    setBusyId(id);
    await publishRequestDraft(id);
    await refetch();
    setBusyId(null);
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    await deleteRequest(id);
    await refetch();
    setBusyId(null);
  };

  const handleCancelPending = async (requestId: string, offerId: string) => {
    if (!user) return;
    setBusyId(offerId);
    await cancelAcceptedOffer(user.id, requestId, offerId);
    await refetchPending();
    setBusyId(null);
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        <Text style={styles.title}>Panier</Text>

        {pendingPayments.length > 0 && (
          <View style={{ gap: 8 }}>
            <Badge label="Paiement en attente" tone="warning" />
            {pendingPayments.map(({ request, offer }) => (
              <Card key={offer.id} style={{ gap: 8, borderColor: colors.primary }}>
                <Text style={styles.part}>{requestTitleLine(request)}</Text>
                <Text style={styles.meta}>Offre acceptée : {offer.price.toLocaleString('fr-FR')} FCFA</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Button label="Payer maintenant" onPress={() => navigation.navigate('Checkout', { offerId: offer.id, requestId: request.id })} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button label="Annuler" variant="secondary" onPress={() => handleCancelPending(request.id, offer.id)} loading={busyId === offer.id} />
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {drafts.length === 0 ? (
          <EmptyState label="Votre panier est vide." />
        ) : (
          <View style={{ gap: 10 }}>
            {drafts.map((req) => (
              <Card key={req.id} style={{ gap: 8 }}>
                <Text style={styles.part}>{requestTitleLine(req)}</Text>
                {requestSubtitleLine(req) ? <Text style={styles.meta}>{requestSubtitleLine(req)}</Text> : null}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Button label="Envoyer" onPress={() => handleSend(req.id)} loading={busyId === req.id} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button label="Supprimer" variant="secondary" onPress={() => handleDelete(req.id)} disabled={busyId === req.id} />
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 16 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  part: { fontSize: 14, fontWeight: '700', color: colors.text },
  meta: { fontSize: 12, color: colors.textMuted },
});
