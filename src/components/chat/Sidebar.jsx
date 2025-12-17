import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import SearchBar from './SearchBar';
import ConversationList from './ConversationList';

/**
 * Sidebar Component
 * Contains header, search, and conversation list
 */
const Sidebar = ({ conversations, selectedConversationId, onSelectConversation }) => {
  const { logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    window.location.href = '/auth/login';
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) =>
    conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        <button
          onClick={handleLogout}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-md hover:bg-secondary"
        >
          Logout
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search conversations..."
        />
      </div>

      {/* Conversation List */}
      <ConversationList
        conversations={filteredConversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={onSelectConversation}
      />
    </aside>
  );
};

export default Sidebar;
