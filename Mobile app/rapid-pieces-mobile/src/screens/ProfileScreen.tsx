import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../lib/auth';
import { useVehicles, useRapidPoints, useOrders, addVehicle } from '../lib/store';
import { Badge, Button, Card, EmptyState, Input, ScreenContainer } from '../components/ui';
import { colors } from '../theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const isBuyer = user?.role === 'buyer';
  // Cahier §8 : l'enregistrement de véhicules est réservé aux particuliers.
  const canHaveVehicles = !user?.buyerType || user.buyerType === 'individual';

  const handleLogout = () => {
    logout();
    // La navigation est gérée automatiquement par RootNavigator qui écoute useAuth().user
  };

  const { data: vehicles, refetch: refetchVehicles } = useVehicles(isBuyer ? user?.id : undefined);
  const { data: rapidPoints } = useRapidPoints(isBuyer ? user?.id : undefined);
  const { data: orders } = useOrders();

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [adding, setAdding] = useState(false);

  if (!user) return null;

  const handleAddVehicle = async () => {
    if (!brand || !model || !year) return;
    setAdding(true);
    await addVehicle(user.id, { brand, model, year: Number(year), engine: '' });
    await refetchVehicles();
    setAdding(false);
    setBrand(''); setModel(''); setYear('');
    setShowAddVehicle(false);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          {user.location ? <Text style={styles.email}>{user.location}</Text> : <Text style={styles.email}>{user.email}</Text>}
          <Badge label={user.role === 'admin' ? 'Administrateur' : user.role === 'seller' ? 'Vendeur' : 'Acheteur'} tone="primary" />
        </Card>

        {isBuyer && (
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{rapidPoints}</Text>
              <Text style={styles.statLabel}>Points Rapid</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{orders.length}</Text>
              <Text style={styles.statLabel}>Commandes</Text>
            </Card>
          </View>
        )}

        {isBuyer && canHaveVehicles && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mes véhicules</Text>
              <Text style={styles.addLink} onPress={() => setShowAddVehicle(!showAddVehicle)}>
                {showAddVehicle ? 'Annuler' : '+ Ajouter'}
              </Text>
            </View>

            {showAddVehicle && (
              <Card style={{ gap: 10 }}>
                <Input placeholder="Marque" value={brand} onChangeText={setBrand} />
                <Input placeholder="Modèle" value={model} onChangeText={setModel} />
                <Input placeholder="Année" value={year} onChangeText={setYear} keyboardType="number-pad" />
                <Button label="Ajouter" onPress={handleAddVehicle} loading={adding} />
              </Card>
            )}

            {vehicles.length === 0 ? (
              <EmptyState label="Aucun véhicule enregistré." />
            ) : (
              <View style={{ gap: 8 }}>
                {vehicles.map((v, i) => (
                  <Card key={i} style={styles.vehicleCard}>
                    <Text style={styles.vehicleText}>{v.brand} {v.model} {v.year}</Text>
                  </Card>
                ))}
              </View>
            )}
          </View>
        )}

        <Button label="Se déconnecter" variant="secondary" onPress={handleLogout} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 20, paddingBottom: 60 },
  identity: { alignItems: 'center', gap: 6, paddingVertical: 24 },
  avatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  avatarLetter: { color: '#fff', fontSize: 22, fontWeight: '800' },
  name: { fontSize: 17, fontWeight: '800', color: colors.text },
  email: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 11, color: colors.textMuted },
  section: { gap: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  addLink: { fontSize: 13, color: colors.primary, fontWeight: '700' },
  vehicleCard: { paddingVertical: 12 },
  vehicleText: { fontSize: 13, fontWeight: '600', color: colors.text },
});
