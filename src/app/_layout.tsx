import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'AI 学习助手' }} />
        <Stack.Screen name="settings" options={{ title: 'API 配置' }} />
      </Stack>
    </ThemeProvider>
  );
}
