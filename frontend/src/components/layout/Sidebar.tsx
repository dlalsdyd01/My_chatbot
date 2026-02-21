import { useState } from 'react';
import { Plus, Trash2, X, MessageCircle, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Conversation } from '../../types/conversation';
import { formatDate } from '../../utils/formatDate';

interface SidebarProps {
  conversations: Conversation[];
  onNewChat: () => void;
  onDelete: (id: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ conversations, onNewChat, onDelete, isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const activeId = conversationId ? Number(conversationId) : null;
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? conversations.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    : conversations;

  const handleSelect = (id: number) => {
    navigate(`/app/c/${id}`);
    onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={onNewChat}>
            <Plus size={16} />
            New conversation
          </button>
          <button className="icon-btn close-sidebar" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="sidebar-search">
          <Search size={13} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>
              <X size={12} />
            </button>
          )}
        </div>
        <nav className="conversation-list">
          {filtered.length === 0 && (
            <div className="sidebar-empty">
              {query ? 'No results found' : 'No conversations yet'}
            </div>
          )}
          {filtered.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${activeId === conv.id ? 'active' : ''}`}
              onClick={() => handleSelect(conv.id)}
            >
              <MessageCircle size={14} className="conversation-icon" />
              <div className="conversation-info">
                <span className="conversation-title">{conv.title}</span>
                <span className="conversation-date">{formatDate(conv.updated_at)}</span>
              </div>
              <button
                className="icon-btn delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
