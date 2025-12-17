import { MoreVertical, Phone, Video } from 'lucide-react';

/**
 * ChatHeader Component
 * Shows conversation name, avatar, and action buttons
 */
const ChatHeader = ({ conversation }) => {
  const { name, avatar, type } = conversation;

  return (
    <div className="h-16 border-b border-border flex items-center justify-between px-6">
      {/* Left: User Info */}
      <div className="flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">
              {name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{name || 'Unknown'}</h3>
          <p className="text-xs text-muted-foreground">
            {type === 'group' ? 'Group Chat' : 'Online'}
          </p>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title="Voice Call"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title="Video Call"
        >
          <Video className="w-5 h-5" />
        </button>
        <button
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title="More Options"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
