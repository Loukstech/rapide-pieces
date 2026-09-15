import { useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BuyerStackParamList } from '../../navigation/types';
import { useRequests, useSellers } from '../../lib/store';
import { requestTitleLine, requestSubtitleLine } from '../../lib/types';
import { Badge, Button, Card, EmptyState, ScreenContainer } from '../../components/ui';
import { colors } from '../../theme';

const REQUEST_STATUS_LABEL: Record<string, string> = {
  open: 'En cours',
  matched: 'Pièce trouvée',
  ordered: 'Pièce trouvée',
  completed: 'Pièce trouvée',
  expired: 'Expirée',
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BuyerStackParamList>>();
  const { data: requests, loading: requestsLoading, refetch: refetchRequests } = useRequests();
  const { data: sellers, loading: sellersLoading, refetch: refetchSellers } = useSellers();

  const onRefresh = useCallback(() => {
    refetchRequests();
    refetchSellers();
  }, [refetchRequests, refetchSellers]);

  const recentRequests = requests
    .filter((r) => r.status !== 'draft') // brouillons du panier (cahier §8), pas encore envoyés
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const topSellers = [...sellers].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={requestsLoading || sellersLoading} onRefresh={onRefresh} />}
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Vos pièces auto livrées{'\n'}rapidement partout en Afrique</Text>
          <Text style={styles.heroSubtitle}>Décrivez la pièce recherchée. Les vendeurs vous répondent rapidement avec leur meilleure offre.</Text>
          <Button label="Demander une pièce" onPress={() => navigation.navigate('RequestNew')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes demandes récentes</Text>
          {recentRequests.length === 0 ? (
            <EmptyState label="Aucune demande pour l'instant. Publiez-en une pour recevoir des offres." />
          ) : (
            <View style={{ gap: 10 }}>
              {recentRequests.map((r) => (
                <Card key={r.id} style={styles.requestCard}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.requestPart}>{requestTitleLine(r)}</Text>
                    <Text style={styles.requestMeta}>{[requestSubtitleLine(r), r.location].filter(Boolean).join(' · ')}</Text>
                    <Text
                      style={styles.link}
                      onPress={() => navigation.navigate('Offers', { requestId: r.id })}
                    >
                      Voir les offres ({r.responsesCount}) →
                    </Text>
                  </View>
                  <Badge label={REQUEST_STATUS_LABEL[r.status] ?? r.status} tone={r.status === 'open' ? 'warning' : 'success'} />
                </Card>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Vendeurs</Text>
          {topSellers.length === 0 ? (
            <EmptyState label="Pas encore de vendeur inscrit." />
          ) : (
            <View style={{ gap: 10 }}>
              {topSellers.map((s) => (
                <Card key={s.id} style={styles.sellerCard}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.requestPart}>{s.name}</Text>
                    <Text style={styles.requestMeta}>{s.specialties[0] ?? s.categories[0] ?? 'Pièces auto'} · {s.location}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={styles.rating}>★ {s.rating.toFixed(1)}</Text>
                    <Badge label={s.badge} tone="primary" />
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 28, paddingBottom: 40 },
  hero: {
    backgroundColor: colors.primarySoft, borderRadius: 20, padding: 22, gap: 14, borderWidth: 1, borderColor: colors.primaryBorder,
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: colors.text, lineHeight: 30 },
  heroSubtitle: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  requestCard: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  sellerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  requestPart: { fontSize: 14, fontWeight: '700', color: colors.text },
  requestMeta: { fontSize: 12, color: colors.textMuted },
  link: { fontSize: 12, color: colors.primary, fontWeight: '700', marginTop: 4 },
  rating: { fontSize: 13, fontWeight: '700', color: colors.warning },
});
