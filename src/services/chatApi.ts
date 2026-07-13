import { API_BASE_URL } from '@/constants/api';
import type { SendChatInput, SendChatResponse } from '@/types/api';

export async function sendChatMessage(input: SendChatInput) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as SendChatResponse;

  if (!response.ok) {
    throw new Error(data.message || '请求失败，请稍后再试。');
  }

  return data;
}
