import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User as UserIcon, Store, ChevronRight } from 'lucide-react-native';
import type { AuthStackParamList } from '../navigation/types';
import { ScreenContainer } from '../components/ui';
import { colors } from '../theme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

// Cahier section 3 : nouvel écran de démarrage — plus de switch Acheteur/Vendeur,
// deux grands blocs de choix ; le rôle choisi ici pilote ensuite l'écran Login.
export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo-wordmark.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.subtitle}>Qui êtes-vous ?</Text>
        </View>

        <View style={styles.cards}>
          <RoleCard
            icon={<UserIcon size={24} color={colors.primary} />}
            title="Acheteur"
            subtitle="Trouvez la pièce qu'il vous faut"
            onPress={() => navigation.navigate('Login', { role: 'buyer' })}
          />
          <RoleCard
            icon={<Store size={24} color={colors.primary} />}
            title="Vendeur"
            subtitle="Enregistrez votre boutique et vendez"
            onPress={() => navigation.navigate('Login', { role: 'seller' })}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

function RoleCard({ icon, title, subtitle, onPress }: { icon: React.ReactNode; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
      <View style={styles.cardIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={20} color={colors.border} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 32 },
  header: { alignItems: 'center', gap: 8 },
  logo: { width: 260, height: 56 },
  subtitle: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  cards: { gap: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: 16, padding: 18,
  },
  cardIcon: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
