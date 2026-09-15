import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useOrders, updateOrderEscrow } from '../../lib/store';
import { Badge, Button, Card, EmptyState, ScreenContainer } from '../../components/ui';
import { colors } from '../../theme';
import { Order } from '../../lib/types';

const ESCROW_LABEL: Record<Order['escrowStatus'], string> = {
  held: 'Escrow actif',
  released: 'Libéré',
  refunded: 'Remboursé',
};

export default function AdminOrdersScreen() {
  const { data: orders, loading, refetch } = useOrders();
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleAction = async (orderId: string, status: Order['escrowStatus']) => {
    setBusyId(orderId);
    await updateOrderEscrow(orderId, status);
    await refetch();
    setBusyId(null);
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        <Text style={styles.title}>Commandes & escrow</Text>
        {orders.length === 0 ? (
          <EmptyState label="Aucune commande." />
        ) : (
          <View style={{ gap: 12 }}>
            {orders.map((order) => (
              <Card key={order.id}>
                <View style={styles.top}>
                  <Text style={styles.part}>{order.partName}</Text>
                  <Badge label={ESCROW_LABEL[order.escrowStatus]} tone={order.escrowStatus === 'held' ? 'warning' : 'success'} />
                </View>
                <Text style={styles.meta}>
                  {order.vehicle.brand} {order.vehicle.model} {order.vehicle.year} · Vendeur : {order.sellerName}
                </Text>
                <Text style={styles.price}>{order.price.toLocaleString('fr-FR')} FCFA</Text>

                {order.escrowStatus === 'held' && (
                  <View style={styles.actions}>
                    <View style={{ flex: 1 }}>
                      <Button
                        label="Libérer"
                        variant="success"
                        loading={busyId === order.id}
                        onPress={() => handleAction(order.id, 'released')}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button
                        label="Rembourser"
                        variant="outline"
                        loading={busyId === order.id}
                        onPress={() => handleAction(order.id, 'refunded')}
                      />
                    </View>
                  </View>
                )}
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
  meta: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10 },
  actions: { flexDirection: 'row', gap: 10 },
});
