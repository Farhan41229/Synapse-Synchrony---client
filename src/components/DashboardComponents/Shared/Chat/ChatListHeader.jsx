import { Bot, Search } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { NewChatPopover } from './NewChatPopover';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/use-chat';
import { useNavigate } from 'react-router';
import { Spinner } from '@/components/ui/spinner';

const ChatListHeader = ({ onSearch }) => {
  const navigate = useNavigate();
  const { fetchAIChat, isAIChatLoading } = useChat();

  const handleAIChat = async () => {
    const aiChat = await fetchAIChat();
    if (aiChat) {
      navigate(`/dashboard/chat/${aiChat._id}`);
    }
  };

  return (
    <div className="px-3 py-3 border-b border-border">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold">Chat</h1>
        <div className="flex items-center gap-2">
          {/* AI Chat Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleAIChat}
            disabled={isAIChatLoading}
            title="Chat with AI"
          >
            {isAIChatLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Bot className="h-5! w-5! stroke-1! text-purple-600" />
            )}
          </Button>

          {/* NewChatPopover */}
          <NewChatPopover />
        </div>
      </div>
      <div>
        <InputGroup className="bg-background text-sm">
          <InputGroupInput
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatListHeader;
