export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface MessageSource {
  filename: string;
  chunk_index: number;
  preview: string;
}

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  sources?: MessageSource[];
}

export interface Document {
  id: number;
  conversation_id: number;
  filename: string;
  file_type: string;
  file_size: number;
  total_chars: number;
  chunk_count: number;
  created_at: string;
}
