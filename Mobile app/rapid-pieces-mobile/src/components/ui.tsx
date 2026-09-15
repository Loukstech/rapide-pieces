import { ReactNode } from 'react';
import {
  ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle,
} from 'react-native';
import { colors } from '../theme';

export function ScreenContainer({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  label, onPress, variant = 'primary', loading = false, disabled = false, icon,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && { backgroundColor: colors.primary },
        variant === 'success' && { backgroundColor: colors.success },
        variant === 'secondary' && { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
        variant === 'outline' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
        isDisabled && { opacity: 0.6 },
        pressed && !isDisabled && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'outline' ? colors.primary : '#fff'} />
      ) : (
        <View style={styles.buttonContent}>
          {icon}
          <Text
            style={[
              styles.buttonLabel,
              (variant === 'secondary' || variant === 'outline') && { color: colors.text },
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export function Input(props: TextInputProps & { label?: string }) {
  const { label, style, ...rest } = props;
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

export function Badge({ label, tone = 'default' }: { label: string; tone?: 'default' | 'success' | 'warning' | 'primary' }) {
  const toneStyle = {
    default: { bg: colors.bg, fg: colors.textMuted, border: colors.border },
    success: { bg: colors.successSoft, fg: colors.success, border: colors.successBorder },
    warning: { bg: '#FFFBEB', fg: colors.warning, border: '#FDE68A' },
    primary: { bg: colors.primarySoft, fg: colors.primary, border: colors.primaryBorder },
  }[tone];
  return (
    <View style={[styles.badge, { backgroundColor: toneStyle.bg, borderColor: toneStyle.border }]}>
      <Text style={[styles.badgeLabel, { color: toneStyle.fg }]}>{label}</Text>
    </View>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonLabel: { color: '#fff', fontWeight: '700', fontSize: 15 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    backgroundColor: '#fff',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeLabel: { fontSize: 12, fontWeight: '700' },
  empty: { padding: 24, alignItems: 'center' },
  emptyLabel: { color: colors.textMuted, fontSize: 14, textAlign: 'center' },
});
