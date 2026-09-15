import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClipboardList, Package, User } from 'lucide-react-native';
import type { SellerTabParamList } from './types';
import SellerRequestsScreen from '../screens/seller/SellerRequestsScreen';
import SellerOrdersScreen from '../screens/seller/SellerOrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator<SellerTabParamList>();

export default function SellerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen name="SellerRequests" component={SellerRequestsScreen} options={{
        title: 'Demandes', tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
      }} />
      <Tab.Screen name="SellerOrders" component={SellerOrdersScreen} options={{
        title: 'Ventes', tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        title: 'Profil', tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
      }} />
    </Tab.Navigator>
  );
}
