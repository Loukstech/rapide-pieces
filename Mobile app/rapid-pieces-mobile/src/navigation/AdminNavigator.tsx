import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClipboardList, ShieldCheck, User } from 'lucide-react-native';
import type { AdminTabParamList } from './types';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminRequestsScreen from '../screens/admin/AdminRequestsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen name="AdminOrders" component={AdminOrdersScreen} options={{
        title: 'Commandes', tabBarIcon: ({ color, size }) => <ShieldCheck color={color} size={size} />,
      }} />
      <Tab.Screen name="AdminRequests" component={AdminRequestsScreen} options={{
        title: 'Demandes', tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        title: 'Profil', tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
      }} />
    </Tab.Navigator>
  );
}
