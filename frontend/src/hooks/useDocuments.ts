import { useCallback, useEffect, useState } from 'react';
import {
  uploadDocument as apiUpload,
  listDocuments as apiList,
  deleteDocument as apiDelete,
} from '../api/documents';
import type { Document } from '../types/conversation';

export function useDocuments(conversationId: number | null) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const refresh = useCallback(async () => {
    if (!conversationId) {
      setDocuments([]);
      return;
    }
    try {
      const docs = await apiList(conversationId);
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  }, [conversationId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (file: File) => {
      if (!conversationId) return;
      setIsUploading(true);
      try {
        const doc = await apiUpload(conversationId, file);
        setDocuments((prev) => [...prev, doc]);
        return doc;
      } finally {
        setIsUploading(false);
      }
    },
    [conversationId],
  );

  const remove = useCallback(async (documentId: number) => {
    await apiDelete(documentId);
    setDocuments((prev) => prev.filter((d) => d.id !== documentId));
  }, []);

  return { documents, isUploading, upload, remove, refresh };
}
