import client from './client';
import type { Conversation, ConversationDetail } from '../types/conversation';

export async function listConversations(): Promise<Conversation[]> {
  const res = await client.get('/conversations');
  return res.data;
}

export async function createConversation(title?: string): Promise<Conversation> {
  const res = await client.post('/conversations', { title: title || 'New Conversation' });
  return res.data;
}

export async function getConversation(id: number): Promise<ConversationDetail> {
  const res = await client.get(`/conversations/${id}`);
  return res.data;
}

export async function updateConversationTitle(id: number, title: string): Promise<Conversation> {
  const res = await client.patch(`/conversations/${id}`, { title });
  return res.data;
}

export async function deleteConversation(id: number): Promise<void> {
  await client.delete(`/conversations/${id}`);
}
