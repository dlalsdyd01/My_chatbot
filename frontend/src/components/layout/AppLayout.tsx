import { useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useConversations } from '../../hooks/useConversations';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { conversations, create, remove, refresh, updateTitle } = useConversations();
  const navigate = useNavigate();

  const handleNewChat = useCallback(async () => {
    try {
      const conv = await create();
      navigate(`/app/c/${conv.id}`);
      setSidebarOpen(false);
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  }, [create, navigate]);

  const handleDelete = useCallback(
    async (id: number) => {
      await remove(id);
      navigate('/app');
    },
    [remove, navigate],
  );

  return (
    <div className="app-layout">
      <Sidebar
        conversations={conversations}
        onNewChat={handleNewChat}
        onDelete={handleDelete}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content">
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <Outlet context={{ refreshConversations: refresh, updateConversationTitle: updateTitle }} />
      </div>
    </div>
  );
}
