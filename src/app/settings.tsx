import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { deleteApiKey, saveApiConfig } from '@/services/configApi';

export default function SettingsScreen() {
  const params = useLocalSearchParams<{ username?: string }>();
  const initialUsername = typeof params.username === 'string' ? params.username : '';
  const [username, setUsername] = useState(initialUsername);
  const [apiKey, setApiKey] = useState('');
  const [statusMessage, setStatusMessage] = useState('还没有保存配置。');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    setStatusMessage('正在保存配置...');

    try {
      await saveApiConfig({ username, apiKey });
      setApiKey('');
      setStatusMessage('配置已保存，可以返回聊天页开始提问。');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : '保存失败，请稍后再试。');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setStatusMessage('正在删除 Key...');

    try {
      await deleteApiKey(username);
      setApiKey('');
      setStatusMessage('已删除保存的 Key。再次聊天前需要重新保存。');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : '删除失败，请稍后再试。');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedView style={styles.header}>
            <ThemedView style={styles.titleBlock}>
              <ThemedText type="smallBold" style={styles.title}>
                配置
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.description}>
                DeepSeek Key
              </ThemedText>
            </ThemedView>

            <Link href="/" asChild>
              <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
                <ThemedText type="smallBold" style={styles.backButtonText}>
                  返回
                </ThemedText>
              </Pressable>
            </Link>
          </ThemedView>

          <ThemedView style={styles.form}>
            <ThemedView style={styles.field}>
              <ThemedText type="smallBold">用户名</ThemedText>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setUsername}
                placeholder="例如：student01"
                placeholderTextColor="#80848c"
                style={styles.input}
                value={username}
              />
            </ThemedView>

            <ThemedView style={styles.field}>
              <ThemedText type="smallBold">DeepSeek API Key</ThemedText>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setApiKey}
                placeholder="请输入 DeepSeek API Key"
                placeholderTextColor="#80848c"
                secureTextEntry
                style={styles.input}
                value={apiKey}
              />
              <ThemedText type="small" themeColor="textSecondary">
                Key 会以隐藏形式输入，删除后需要重新保存。
              </ThemedText>
            </ThemedView>

            <Pressable
              disabled={isSaving}
              onPress={handleSave}
              style={({ pressed }) => [
                styles.primaryButton,
                (pressed || isSaving) && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={styles.primaryButtonText}>
                {isSaving ? '保存中...' : '保存配置'}
              </ThemedText>
            </Pressable>

            <Pressable
              disabled={isDeleting}
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.dangerButton,
                (pressed || isDeleting) && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={styles.dangerButtonText}>
                {isDeleting ? '删除中...' : '删除已保存 Key'}
              </ThemedText>
            </Pressable>
          </ThemedView>

          <ThemedView style={styles.note}>
            <ThemedText type="smallBold">当前状态</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {statusMessage}
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    gap: Spacing.three,
    paddingTop: 0,
    paddingBottom: Spacing.three,
  },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  titleBlock: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  backButton: {
    minHeight: 36,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    paddingHorizontal: Spacing.two,
  },
  backButtonText: {
    color: '#ffffff',
  },
  form: {
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    backgroundColor: '#ffffff',
  },
  field: {
    gap: Spacing.two,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    paddingHorizontal: Spacing.three,
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  dangerButton: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: Spacing.three,
  },
  dangerButtonText: {
    color: '#dc2626',
  },
  pressed: {
    opacity: 0.75,
  },
  note: {
    gap: Spacing.one,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    backgroundColor: '#ffffff',
  },
});
