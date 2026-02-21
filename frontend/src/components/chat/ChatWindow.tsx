import type { Document, Message } from '../../types/conversation';
import { ChatInput } from './ChatInput';
import { DocumentBar } from './DocumentBar';
import { MessageList } from './MessageList';

interface ChatWindowProps {
  messages: Message[];
  isStreaming: boolean;
  onSend: (message: string) => void;
  onStop: () => void;
  onFileUpload?: (file: File) => void;
  documents?: Document[];
  isUploading?: boolean;
  onRemoveDocument?: (id: number) => void;
  disabled: boolean;
}

export function ChatWindow({
  messages,
  isStreaming,
  onSend,
  onStop,
  onFileUpload,
  documents = [],
  isUploading = false,
  onRemoveDocument,
  disabled,
}: ChatWindowProps) {
  return (
    <div className="chat-window">
      <MessageList messages={messages} isStreaming={isStreaming} />
      <DocumentBar
        documents={documents}
        isUploading={isUploading}
        onRemove={onRemoveDocument || (() => {})}
      />
      <ChatInput
        onSend={onSend}
        onStop={onStop}
        onFileUpload={onFileUpload}
        isStreaming={isStreaming}
        disabled={disabled}
      />
    </div>
  );
}
