import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Package, User, ShoppingCart } from 'lucide-react-native';
import type { BuyerStackParamList, BuyerTabParamList } from './types';
import HomeScreen from '../screens/buyer/HomeScreen';
import OrdersScreen from '../screens/buyer/OrdersScreen';
import CartScreen from '../screens/buyer/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RequestNewScreen from '../screens/buyer/RequestNewScreen';
import OffersScreen from '../screens/buyer/OffersScreen';
import CheckoutScreen from '../screens/buyer/CheckoutScreen';
import { useAuth } from '../lib/auth';
import { useRequestDrafts, usePendingPayments, expireStaleRequests } from '../lib/store';
import { colors } from '../theme';

const Tab = createBottomTabNavigator<BuyerTabParamList>();
const Stack = createNativeStackNavigator<BuyerStackParamList>();

function BuyerTabs() {
  const { user } = useAuth();
  // Cahier §8 : badge du panier = nombre de demandes préparées mais pas encore envoyées ;
  // s'il y a un paiement en attente, priorité à l'alerte "!".
  const { data: drafts } = useRequestDrafts(user?.id);
  const { data: pendingPayments } = usePendingPayments(user?.id);
  const cartBadge = pendingPayments.length > 0 ? '!' : (drafts.length > 0 ? String(drafts.length) : undefined);

  // Cahier §10 : une demande ouverte depuis plus de 24h sans offre acceptée expire —
  // balayage au mieux (best-effort) à l'ouverture de l'espace acheteur.
  useEffect(() => {
    if (user?.id) expireStaleRequests(user.id);
  }, [user?.id]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{
        title: 'Accueil', tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
      }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{
        title: 'Panier', tabBarIcon: ({ color, size }) => <ShoppingCart color={color} size={size} />,
        tabBarBadge: cartBadge,
      }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{
        title: 'Commandes', tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        title: 'Profil', tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
      }} />
    </Tab.Navigator>
  );
}

export default function BuyerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.primary }}>
      <Stack.Screen name="BuyerTabs" component={BuyerTabs} options={{ headerShown: false }} />
      <Stack.Screen name="RequestNew" component={RequestNewScreen} options={{ title: 'Nouvelle demande' }} />
      <Stack.Screen name="Offers" component={OffersScreen} options={{ title: 'Offres reçues' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Commande' }} />
    </Stack.Navigator>
  );
}
