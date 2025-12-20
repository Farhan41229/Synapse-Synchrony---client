import ConversationItem from './ConversationItem';

/**
 * ConversationList Component
 * Displays list of conversations
 */
const ConversationList = ({
  conversations = [],
  selectedConversationId,
  onSelectConversation,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">No conversations yet</p>
          <p className="text-sm">Start a new chat to begin messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === selectedConversationId}
          onClick={() => onSelectConversation(conversation)}
        />
      ))}
    </div>
  );
};

export default ConversationList;
