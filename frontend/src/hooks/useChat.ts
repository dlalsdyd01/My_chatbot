import { useCallback, useRef, useState } from 'react';
import { streamChat } from '../api/chat';
import type { Message } from '../types/conversation';

export function useChat(
  conversationId: number | null,
  onTitleGenerated?: (title: string) => void,
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || isStreaming) return;

      const userMessage: Message = {
        id: Date.now(),
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      const assistantTempId = Date.now() + 1;
      setMessages((prev) => [
        ...prev,
        { id: assistantTempId, role: 'assistant', content: '', created_at: new Date().toISOString() },
      ]);

      setIsStreaming(true);
      abortRef.current = new AbortController();

      try {
        await streamChat(
          conversationId,
          content,
          (token) => {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = { ...last, content: last.content + token };
              return updated;
            });
          },
          (doneData) => {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                id: doneData.message_id,
                ...(doneData.sources && { sources: doneData.sources }),
              };
              return updated;
            });
            if (doneData.new_title) {
              onTitleGenerated?.(doneData.new_title);
            }
            setIsStreaming(false);
          },
          (error) => {
            console.error('Stream error:', error);
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: `Error: ${error}`,
              };
              return updated;
            });
            setIsStreaming(false);
          },
          abortRef.current.signal,
        );
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setIsStreaming(false);
        }
      }
    },
    [conversationId, isStreaming, onTitleGenerated],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { messages, setMessages, isStreaming, sendMessage, stopStreaming };
}
