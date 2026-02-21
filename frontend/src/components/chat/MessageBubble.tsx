import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Sparkles, UserRound } from 'lucide-react';
import type { Message } from '../../types/conversation';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
}

export function MessageBubble({ message, isTyping = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const hasSources = !isUser && message.sources && message.sources.length > 0;

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="message-avatar">
        {isUser ? <UserRound size={15} /> : <Sparkles size={15} />}
      </div>
      <div className="message-body">
        <span className="message-role">{isUser ? 'You' : 'My'}</span>
        <div className="message-content">
          {isUser ? (
            <p>{message.content}</p>
          ) : isTyping ? (
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
        {hasSources && (
          <div className="message-sources">
            <button
              className="sources-toggle"
              onClick={() => setSourcesOpen((prev) => !prev)}
            >
              <FileText size={13} />
              {message.sources!.length}개 문서 참고
              {sourcesOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {sourcesOpen && (
              <ul className="sources-list">
                {message.sources!.map((src, i) => (
                  <li key={i} className="source-item">
                    <span className="source-filename">
                      {src.filename}
                      {src.chunk_index > 0 ? ` · 청크 ${src.chunk_index + 1}` : ''}
                    </span>
                    <p className="source-preview">{src.preview}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
