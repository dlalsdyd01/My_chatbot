import { useCallback, useEffect, useState } from 'react';
import {
  createConversation as apiCreate,
  deleteConversation as apiDelete,
  listConversations,
} from '../api/conversations';
import type { Conversation } from '../types/conversation';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async () => {
    const conv = await apiCreate();
    setConversations((prev) => [conv, ...prev]);
    return conv;
  }, []);

  const remove = useCallback(async (id: number) => {
    await apiDelete(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateTitle = useCallback((id: number, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c)),
    );
  }, []);

  return { conversations, isLoading, refresh, create, remove, updateTitle };
}
