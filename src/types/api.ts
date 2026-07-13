export type ApiConfigStatus = {
  ok: boolean;
  username: string;
  hasApiKey: boolean;
  message?: string;
};

export type SaveApiConfigInput = {
  username: string;
  apiKey: string;
};

export type ChatMessageRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
};

export type SendChatInput = {
  username: string;
  message: string;
};

export type SendChatResponse = {
  ok: boolean;
  answer: string;
  message?: string;
};
