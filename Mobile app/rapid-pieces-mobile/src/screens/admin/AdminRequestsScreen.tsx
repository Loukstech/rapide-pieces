import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRequests } from '../../lib/store';
import { requestTitleLine, requestSubtitleLine } from '../../lib/types';
import { Badge, Card, EmptyState, ScreenContainer } from '../../components/ui';
import { colors } from '../../theme';

const STATUS_LABEL: Record<string, string> = {
  open: 'Ouverte',
  matched: 'Pièce trouvée',
  ordered: 'Commandée',
  completed: 'Terminée',
  expired: 'Expirée',
};

export default function AdminRequestsScreen() {
  const { data: requests, loading, refetch } = useRequests();

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        <Text style={styles.title}>Toutes les demandes</Text>
        {requests.length === 0 ? (
          <EmptyState label="Aucune demande." />
        ) : (
          <View style={{ gap: 12 }}>
            {requests.map((r) => (
              <Card key={r.id}>
                <View style={styles.top}>
                  <Text style={styles.part}>{requestTitleLine(r)}</Text>
                  <Badge label={STATUS_LABEL[r.status] ?? r.status} tone={r.status === 'open' ? 'warning' : 'success'} />
                </View>
                <Text style={styles.meta}>
                  {[requestSubtitleLine(r), r.location, `${r.responsesCount} offre(s)`].filter(Boolean).join(' · ')}
                </Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 16, paddingBottom: 60 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 },
  part: { fontSize: 14, fontWeight: '700', color: colors.text, flex: 1 },
  meta: { fontSize: 12, color: colors.textMuted },
});
