import React from 'react';
import { getOtherUserAndGroup } from '@/lib/helper';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import AvatarWithBadge from './AvatarWithBadge';

const ChatHeader = ({ chat, currentUserId }) => {
  const navigate = useNavigate();
  const { name, subheading, avatar, isOnline, isGroup } = getOtherUserAndGroup(
    chat,
    currentUserId
  );

  console.log(
    `The name is ${name}. The subheading is: ${subheading}. The avatar is : ${avatar}`
  );

  return (
    <div
      className="sticky top-0
    flex items-center gap-5 border-b border-border
    bg-card px-2 z-50
    "
    >
      <div className="h-14 px-4 flex items-center">
        <div>
          <ArrowLeft
            className="w-5 h-5 inline-block lg:hidden
          text-muted-foreground cursor-pointer
          mr-2
          "
            onClick={() => navigate('/dashboard/chat')}
          />
        </div>
        <AvatarWithBadge
          name={name}
          src={avatar}
          isGroup={isGroup}
          isOnline={isOnline}
        />
        <div className="ml-2">
          <h5 className="font-semibold">{name}</h5>
          <p
            className={`text-sm ${
              isOnline ? 'text-green-500' : 'text-muted-foreground'
            }`}
          >
            {subheading}
          </p>
        </div>
      </div>
      <div>
        <div
          className={`flex-1
            text-center
            py-4 h-full
            border-b-2
            border-primary
            font-medium
            text-primary`}
        >
          Chat
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
