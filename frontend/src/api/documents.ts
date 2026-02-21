import client from './client';
import type { Document } from '../types/conversation';

export async function uploadDocument(
  conversationId: number,
  file: File,
): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await client.post(`/documents/${conversationId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function listDocuments(conversationId: number): Promise<Document[]> {
  const res = await client.get(`/documents/${conversationId}`);
  return res.data;
}

export async function deleteDocument(documentId: number): Promise<void> {
  await client.delete(`/documents/${documentId}`);
}
