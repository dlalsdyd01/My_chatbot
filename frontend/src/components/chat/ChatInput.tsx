import { ArrowUp, Paperclip, Square } from 'lucide-react';
import { useCallback, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  onFileUpload?: (file: File) => void;
  isStreaming: boolean;
  disabled: boolean;
}

export function ChatInput({ onSend, onStop, onFileUpload, isStreaming, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || disabled) return;
      onSend(trimmed);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    },
    [input, disabled, onSend],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {onFileUpload && (
        <button
          type="button"
          className="icon-btn attach-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Attach a file (PDF or TXT)"
        >
          <Paperclip size={18} />
        </button>
      )}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Send a message..."
        rows={1}
        disabled={disabled}
      />
      {isStreaming ? (
        <button type="button" className="send-btn stop-btn" onClick={onStop}>
          <Square size={16} />
        </button>
      ) : (
        <button type="submit" className="send-btn" disabled={!input.trim() || disabled}>
          <ArrowUp size={18} strokeWidth={2.5} />
        </button>
      )}
    </form>
  );
}
