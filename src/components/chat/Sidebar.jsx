import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import SearchBar from './SearchBar';
import ConversationList from './ConversationList';
import NewChatModal from './NewChatModal';

const Sidebar = ({ conversations, selectedConversationId, onSelectConversation, onConversationCreated }) => {
  const { logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [newChatOpen, setNewChatOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/auth/login';
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNewChatOpen(true)}
            className="text-sm px-3 py-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            type="button"
          >
            New chat
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-md hover:bg-secondary"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <SearchBar onSearch={setSearchQuery} placeholder="Search conversations..." />
      </div>

      {/* Conversation List */}
      <ConversationList
        conversations={filteredConversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={onSelectConversation}
      />

      {/* New chat modal */}
      <NewChatModal
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        onCreated={(conv) => onConversationCreated?.(conv)}
      />
    </aside>
  );
};

export default Sidebar;
