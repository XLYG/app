import { Link } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { sendChatMessage } from '@/services/chatApi';
import { getApiConfigStatus } from '@/services/configApi';
import type { ChatMessage } from '@/types/api';

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  };
}

export default function HomeScreen() {
  const [screenMode, setScreenMode] = useState<'check' | 'chat'>('check');
  const [username, setUsername] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage('assistant', '你好。现在可以开始提问了。'),
  ]);
  const [statusMessage, setStatusMessage] = useState('准备就绪');
  const [checkMessage, setCheckMessage] = useState('输入用户名后继续');
  const [needsConfig, setNeedsConfig] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSending, setIsSending] = useState(false);

  async function handleCheckUser() {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setCheckMessage('请先输入用户名');
      setNeedsConfig(false);
      return;
    }

    setIsChecking(true);
    setNeedsConfig(false);
    setCheckMessage('正在检查配置');

    try {
      const result = await getApiConfigStatus(trimmedUsername);

      if (result.hasApiKey) {
        setScreenMode('chat');
        setStatusMessage(trimmedUsername);
        setCheckMessage('配置已找到');
        return;
      }

      setNeedsConfig(true);
      setCheckMessage('这个用户名还没有保存 Key');
    } catch (error) {
      setNeedsConfig(false);
      setCheckMessage(error instanceof Error ? error.message : '检查失败，请稍后再试');
    } finally {
      setIsChecking(false);
    }
  }

  async function handleSend() {
    const trimmedQuestion = question.trim();
    const trimmedUsername = username.trim();

    if (!trimmedQuestion) {
      setStatusMessage('请输入学习问题');
      return;
    }

    setIsSending(true);
    setQuestion('');
    setStatusMessage('正在思考');
    setMessages((current) => [...current, createMessage('user', trimmedQuestion)]);

    try {
      const result = await sendChatMessage({
        username: trimmedUsername,
        message: trimmedQuestion,
      });

      setMessages((current) => [...current, createMessage('assistant', result.answer)]);
      setStatusMessage(trimmedUsername);
    } catch (error) {
      const message = error instanceof Error ? error.message : '发送失败，请稍后再试';
      setMessages((current) => [...current, createMessage('assistant', message)]);
      setStatusMessage('请求失败');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}>
          {screenMode === 'check' ? (
            <ThemedView style={styles.entryScreen}>
              <ThemedView style={styles.topBar}>
                <ThemedText type="smallBold">学习助手</ThemedText>
                <Link
                  href={{ pathname: '/settings', params: { username: username.trim() } }}
                  asChild>
                  <Pressable style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
                    <ThemedText type="small">配置</ThemedText>
                  </Pressable>
                </Link>
              </ThemedView>

              <ThemedView style={styles.entryCenter}>
                <ThemedText type="subtitle" style={styles.entryTitle}>
                  你想学习什么？
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.entrySubtitle}>
                  先输入用户名，我会检查是否已经保存 DeepSeek Key。
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.bottomDock}>
                <ThemedView style={styles.inlineInputBar}>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(value) => {
                      setUsername(value);
                      setNeedsConfig(false);
                    }}
                    onSubmitEditing={handleCheckUser}
                    placeholder="输入用户名"
                    placeholderTextColor="#8a8f98"
                    returnKeyType="done"
                    style={styles.inlineInput}
                    value={username}
                  />
                  <Pressable
                    disabled={isChecking}
                    onPress={handleCheckUser}
                    style={({ pressed }) => [
                      styles.roundButton,
                      (pressed || isChecking) && styles.pressed,
                    ]}>
                    <ThemedText type="smallBold" style={styles.roundButtonText}>
                      {isChecking ? '…' : '→'}
                    </ThemedText>
                  </Pressable>
                </ThemedView>

                <ThemedView style={styles.entryMessageRow}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {checkMessage}
                  </ThemedText>
                  {needsConfig && (
                    <Link
                      href={{ pathname: '/settings', params: { username: username.trim() } }}
                      asChild>
                      <Pressable
                        style={({ pressed }) => [styles.configButton, pressed && styles.pressed]}>
                        <ThemedText type="smallBold" style={styles.configButtonText}>
                          去配置
                        </ThemedText>
                      </Pressable>
                    </Link>
                  )}
                </ThemedView>
              </ThemedView>
            </ThemedView>
          ) : (
            <ThemedView style={styles.chatScreen}>
              <ThemedView style={styles.topBar}>
                <ThemedView style={styles.chatTitleBlock}>
                  <ThemedText type="smallBold">学习助手</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {statusMessage}
                  </ThemedText>
                </ThemedView>
                <Link
                  href={{ pathname: '/settings', params: { username: username.trim() } }}
                  asChild>
                  <Pressable style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
                    <ThemedText type="small">配置</ThemedText>
                  </Pressable>
                </Link>
              </ThemedView>

              <ScrollView
                style={styles.messages}
                contentContainerStyle={styles.messagesContent}
                keyboardShouldPersistTaps="handled">
                {messages.map((message) => (
                  <ThemedView
                    key={message.id}
                    style={[
                      styles.messageRow,
                      message.role === 'user' ? styles.userMessageRow : styles.assistantMessageRow,
                    ]}>
                    <ThemedView
                      style={[
                        styles.messageBubble,
                        message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                      ]}>
                      <ThemedText type="small" style={styles.messageAuthor}>
                        {message.role === 'user' ? '你' : '学习助手'}
                      </ThemedText>
                      <ThemedText style={styles.messageText}>{message.content}</ThemedText>
                    </ThemedView>
                  </ThemedView>
                ))}
              </ScrollView>

              <ThemedView style={styles.bottomDock}>
                <ThemedView style={styles.inlineInputBar}>
                  <TextInput
                    editable={!isSending}
                    multiline
                    onChangeText={setQuestion}
                    onSubmitEditing={handleSend}
                    placeholder="输入你的学习问题"
                    placeholderTextColor="#8a8f98"
                    style={styles.inlineInput}
                    value={question}
                  />
                  <Pressable
                    disabled={isSending}
                    onPress={handleSend}
                    style={({ pressed }) => [
                      styles.roundButton,
                      (pressed || isSending) && styles.pressed,
                    ]}>
                    <ThemedText type="smallBold" style={styles.roundButtonText}>
                      {isSending ? '…' : '↑'}
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          )}
        </KeyboardAvoidingView>
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
  keyboard: {
    flex: 1,
  },
  entryScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  chatScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  textButton: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: Spacing.one,
  },
  chatTitleBlock: {
    backgroundColor: 'transparent',
  },
  entryCenter: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: '#ffffff',
  },
  entryTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  entrySubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  bottomDock: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
    backgroundColor: '#ffffff',
  },
  inlineInputBar: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: Spacing.two,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.one,
    paddingVertical: Spacing.one,
    backgroundColor: '#ffffff',
  },
  inlineInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingVertical: Spacing.two,
    fontSize: 16,
    lineHeight: 22,
    color: '#111827',
  },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
  },
  roundButtonText: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 22,
  },
  entryMessageRow: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    backgroundColor: '#ffffff',
  },
  configButton: {
    minHeight: 32,
    justifyContent: 'center',
    borderRadius: Spacing.two,
    backgroundColor: '#111111',
    paddingHorizontal: Spacing.two,
  },
  configButtonText: {
    color: '#ffffff',
  },
  messages: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  messagesContent: {
    gap: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  messageRow: {
    backgroundColor: 'transparent',
  },
  userMessageRow: {
    alignItems: 'flex-end',
  },
  assistantMessageRow: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '92%',
    gap: Spacing.one,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  userBubble: {
    backgroundColor: '#f1f3f5',
  },
  assistantBubble: {
    backgroundColor: '#ffffff',
  },
  messageAuthor: {
    color: '#6b7280',
  },
  messageText: {
    lineHeight: 24,
  },
  pressed: {
    opacity: 0.72,
  },
});
