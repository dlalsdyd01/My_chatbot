import type { MessageSource } from '../types/conversation';

export async function streamChat(
  conversationId: number,
  message: string,
  onToken: (content: string) => void,
  onDone: (data: { message_id: number; conversation_id: number; new_title?: string; sources?: MessageSource[] }) => void,
  onError: (error: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`/api/chat/${conversationId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
    signal,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Request failed' }));
    onError(err.detail || 'Request failed');
    return;
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    let currentEvent = '';
    for (const line of lines) {
      if (line.startsWith('event: ')) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          switch (currentEvent) {
            case 'token':
              onToken(data.content);
              break;
            case 'done':
              onDone(data);
              break;
            case 'error':
              onError(data.detail);
              break;
          }
        } catch {
          // skip malformed JSON
        }
        currentEvent = '';
      }
    }
  }
}
