import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ActionButton } from '@/components/ui/ActionButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Notice } from '@/components/ui/Notice';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { submitLead } from '@/lib/centers';
import { useCenters } from '@/lib/centers-store';

type Status = 'editing' | 'sending' | 'sent' | 'failed';

export default function AddCenterScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const { isDemo } = useCenters();

  const [centerName, setCenterName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<Status>('editing');
  const [showValidation, setShowValidation] = useState(false);

  const isValid =
    centerName.trim().length > 0 && contactName.trim().length > 0 && phone.trim().length > 0;

  async function handleSubmit() {
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    setStatus('sending');
    const result = await submitLead({
      center_name: centerName.trim(),
      contact_name: contactName.trim(),
      phone: phone.trim(),
      city: city.trim() || 'Toshkent',
      note: note.trim() || null,
    });
    setStatus(result.ok ? 'sent' : 'failed');
  }

  if (status === 'sent') {
    return (
      <ThemedView style={styles.flex}>
        <EmptyState
          icon="checkmark-circle-outline"
          title={t('leadSuccessTitle')}
          body={t('leadSuccessBody')}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedText variant="body" themeColor="textSecondary">
            {t('leadIntro')}
          </ThemedText>

          {/* Demo rejimda ariza yuboriladigan baza yo'q — buni oldindan aytamiz. */}
          {isDemo ? (
            <Notice icon="information-circle" tone="warning" text={t('settingsDataDemo')} />
          ) : null}

          {status === 'failed' ? (
            <Notice icon="alert-circle" tone="warning" text={t('errorHint')} />
          ) : null}

          <Field
            label={t('leadCenterName')}
            value={centerName}
            onChangeText={setCenterName}
            required
            invalid={showValidation && centerName.trim().length === 0}
          />
          <Field
            label={t('leadContactName')}
            value={contactName}
            onChangeText={setContactName}
            required
            invalid={showValidation && contactName.trim().length === 0}
          />
          <Field
            label={t('leadPhone')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+998 __ ___ __ __"
            required
            invalid={showValidation && phone.trim().length === 0}
          />
          <Field label={t('leadCity')} value={city} onChangeText={setCity} placeholder="Toshkent" />
          <Field label={t('leadNote')} value={note} onChangeText={setNote} multiline />

          {showValidation && !isValid ? (
            <ThemedText variant="small" style={{ color: theme.danger }}>
              {t('leadRequired')}
            </ThemedText>
          ) : null}

          <ActionButton
            label={t('leadSubmit')}
            icon="send"
            onPress={() => void handleSubmit()}
            disabled={status === 'sending' || isDemo}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad';
  multiline?: boolean;
  required?: boolean;
  invalid?: boolean;
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  required = false,
  invalid = false,
}: FieldProps) {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <ThemedText variant="small" weight="600" themeColor="textSecondary">
        {label}
        {required ? ' *' : ''}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          {
            color: theme.text,
            backgroundColor: theme.card,
            borderColor: invalid ? theme.danger : theme.border,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  field: { gap: Spacing.xs },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 46,
    fontSize: 15,
  },
  inputMultiline: { minHeight: 96, paddingTop: Spacing.md, textAlignVertical: 'top' },
});
