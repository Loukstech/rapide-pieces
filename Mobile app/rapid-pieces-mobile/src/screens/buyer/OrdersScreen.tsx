import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useOrders } from '../../lib/store';
import { Badge, Card, EmptyState, ScreenContainer } from '../../components/ui';
import { colors } from '../../theme';
import { Order } from '../../lib/types';

const STATUS_LABEL: Record<Order['status'], string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  in_transit: 'En transit',
  delivered: 'Livrée',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

const ESCROW_LABEL: Record<Order['escrowStatus'], string> = {
  held: 'Escrow actif',
  released: 'Libéré',
  refunded: 'Remboursé',
};

export default function OrdersScreen() {
  const { data: orders, loading, refetch } = useOrders();

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        <Text style={styles.title}>Mes commandes</Text>
        {orders.length === 0 ? (
          <EmptyState label="Aucune commande pour l'instant." />
        ) : (
          <View style={{ gap: 12 }}>
            {orders.map((order) => (
              <Card key={order.id}>
                <View style={styles.top}>
                  <Text style={styles.part}>{order.partName}</Text>
                  <Badge label={ESCROW_LABEL[order.escrowStatus]} tone={order.escrowStatus === 'held' ? 'warning' : 'success'} />
                </View>
                <Text style={styles.meta}>{order.vehicle.brand} {order.vehicle.model} {order.vehicle.year} · Vendeur : {order.sellerName}</Text>
                <View style={styles.bottom}>
                  <Text style={styles.price}>{order.price.toLocaleString('fr-FR')} FCFA</Text>
                  <Badge label={STATUS_LABEL[order.status]} />
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
  scroll: { padding: 20, gap: 16, paddingBottom: 60 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 },
  part: { fontSize: 14, fontWeight: '700', color: colors.text, flex: 1 },
  meta: { fontSize: 12, color: colors.textMuted, marginBottom: 10 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 16, fontWeight: '800', color: colors.text },
});
