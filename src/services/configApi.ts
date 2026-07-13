import { API_BASE_URL } from '@/constants/api';
import type { ApiConfigStatus, SaveApiConfigInput } from '@/types/api';

async function parseResponse(response: Response): Promise<ApiConfigStatus> {
  const data = (await response.json()) as ApiConfigStatus;

  if (!response.ok) {
    throw new Error(data.message || '请求失败，请稍后再试。');
  }

  return data;
}

export async function saveApiConfig(input: SaveApiConfigInput) {
  const response = await fetch(`${API_BASE_URL}/api/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseResponse(response);
}

export async function getApiConfigStatus(username: string) {
  const response = await fetch(`${API_BASE_URL}/api/config/${encodeURIComponent(username)}`);

  return parseResponse(response);
}

export async function deleteApiKey(username: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/config/${encodeURIComponent(username)}/key`,
    {
      method: 'DELETE',
    },
  );

  return parseResponse(response);
}
