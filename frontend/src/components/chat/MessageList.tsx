import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import type { Message } from '../../types/conversation';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  isStreaming?: boolean;
}

export function MessageList({ messages, isStreaming = false }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="empty-chat">
        <div className="empty-chat-icon">
          <Sparkles size={24} />
        </div>
        <h2>안녕하세요, 저는 My예요</h2>
        <p>문서를 업로드하고 질문하거나, 무엇이든 자유롭게 대화해보세요.</p>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((msg, i) => {
        const isLast = i === messages.length - 1;
        const isTyping = isStreaming && isLast && msg.role === 'assistant' && msg.content === '';
        return <MessageBubble key={msg.id} message={msg} isTyping={isTyping} />;
      })}
      <div ref={bottomRef} />
    </div>
  );
}
