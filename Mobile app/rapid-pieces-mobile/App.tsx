import { useEffect } from 'react';
import * as Updates from 'expo-updates';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/lib/auth';
import RootNavigator from './src/navigation/RootNavigator';

// Applique automatiquement une mise à jour EAS Update dès qu'elle est détectée,
// sans attendre un second lancement de l'app (comportement par défaut d'expo-updates :
// vérifie au lancement, mais n'applique qu'au lancement suivant).
function useAutoApplyUpdate() {
  useEffect(() => {
    if (__DEV__) return;
    (async () => {
      try {
        const result = await Updates.checkForUpdateAsync();
        if (result.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch {
        // Pas de connexion, ou lancé hors contexte de build EAS Update (ex: Expo Go) — on ignore.
      }
    })();
  }, []);
}

export default function App() {
  useAutoApplyUpdate();
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
