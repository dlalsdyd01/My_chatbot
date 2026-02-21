import { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { getConversation } from '../api/conversations';
import { ChatWindow } from '../components/chat/ChatWindow';
import { useChat } from '../hooks/useChat';
import { useDocuments } from '../hooks/useDocuments';

export function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { refreshConversations, updateConversationTitle } = useOutletContext<{
    refreshConversations: () => void;
    updateConversationTitle: (id: number, title: string) => void;
  }>();
  const id = conversationId ? Number(conversationId) : null;
  const { messages, setMessages, isStreaming, sendMessage, stopStreaming } = useChat(
    id,
    (newTitle) => { if (id) updateConversationTitle(id, newTitle); },
  );
  const { documents, isUploading, upload, remove } = useDocuments(id);

  useEffect(() => {
    if (!id) {
      setMessages([]);
      return;
    }
    getConversation(id)
      .then((data) => setMessages(data.messages))
      .catch(() => navigate('/app'));
  }, [id, setMessages, navigate]);

  const handleSend = async (content: string) => {
    await sendMessage(content);
    refreshConversations();
  };

  const handleFileUpload = async (file: File) => {
    try {
      await upload(file);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  if (!id) {
    return (
      <div className="no-chat-selected">
        <div className="empty-chat-icon">
          <Sparkles size={24} />
        </div>
        <h2>Welcome back</h2>
        <p>Start a new conversation from the sidebar to begin.</p>
      </div>
    );
  }

  return (
    <ChatWindow
      messages={messages}
      isStreaming={isStreaming}
      onSend={handleSend}
      onStop={stopStreaming}
      onFileUpload={handleFileUpload}
      documents={documents}
      isUploading={isUploading}
      onRemoveDocument={remove}
      disabled={false}
    />
  );
}
