import { StyleSheet, Text, TextInput, View } from 'react-native';
import { callingCodeForCountry } from '../lib/types';
import { colors } from '../theme';

interface PhoneInputProps {
  label: string;
  country: string;
  value: string;
  onChangeText: (fullValue: string) => void;
  placeholder?: string;
}

// Cahier section 1 : l'indicatif du pays doit s'afficher automatiquement selon le pays
// sélectionné (ex: Bénin -> +229). La valeur applicative reste une chaîne unique
// "+229 XX XX XX XX" (compatible avec RegisterInput.phone: string), reconstruite ici.
export function PhoneInput({ label, country, value, onChangeText, placeholder }: PhoneInputProps) {
  const code = callingCodeForCountry(country) ?? '+…';
  const localValue = value.startsWith(code) ? value.slice(code.length).trimStart() : value;

  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>{code}</Text>
        </View>
        <TextInput
          placeholder={placeholder ?? 'XX XX XX XX'}
          placeholderTextColor={colors.textMuted}
          value={localValue}
          onChangeText={(t) => onChangeText(t ? `${code} ${t}` : '')}
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  codeBadge: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 12, backgroundColor: colors.bg,
  },
  codeText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  input: {
    flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.text, backgroundColor: '#fff',
  },
});
