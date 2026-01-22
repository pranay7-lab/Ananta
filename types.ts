export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
}

export interface ChatSessionConfig {
  systemInstruction: string;
}

export type ChatStatus = 'idle' | 'waiting' | 'streaming' | 'error';
export type AppView = 'chat' | 'journal';