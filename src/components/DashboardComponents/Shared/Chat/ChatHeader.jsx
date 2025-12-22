import React, { useEffect, useState } from 'react';
import { getOtherUserAndGroup } from '@/lib/helper';
import { ArrowLeft, Video } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import AvatarWithBadge from './AvatarWithBadge';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '@/lib/token';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';

const ChatHeader = ({ chat, currentUserId }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { id: chatId } = useParams();

  const { name, subheading, avatar, isOnline, isGroup } = getOtherUserAndGroup(
    chat,
    currentUserId
  );

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get the other user from the chat participants
  const otherUser = chat?.participants?.find((p) => p._id !== currentUserId);

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!user,
  });

  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !user || !otherUser) return;

      try {
        console.log('Initializing stream chat client...');

        const client = StreamChat.getInstance(STREAM_API_KEY);

        // ✅ Connect current user
        await client.connectUser(
          {
            id: user._id,
            name: user.name || user.fullName,
            image: user.avatar || user.profilePic,
          },
          tokenData.token
        );

        console.log('User connected to Stream');

        // ❌ REMOVED: Frontend cannot upsert users - users are registered on backend during login/signup
        // Both users should already be registered in Stream from the backend

        // Create channel ID (sorted to ensure consistency)
        const channelId = [user._id, otherUser._id].sort().join('-');

        console.log('Creating channel with ID:', channelId);
        console.log('Members:', [user._id, otherUser._id]);

        // Create or get the channel
        const currChannel = client.channel('messaging', channelId, {
          members: [user._id, otherUser._id],
          name: `${user.name} and ${otherUser.name}`,
        });

        await currChannel.watch();

        console.log('Channel created successfully');

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast.error('Could not connect to video chat. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initChat();

    // Cleanup function
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [tokenData, user, otherUser?._id, STREAM_API_KEY]);

  const handleVideoCall = () => {
    if (!channel) {
      toast.error('Video call not ready. Please wait...');
      return;
    }

    // ✅ FIXED: Use the CHAT ID as the call ID so both users join the same call
    // Don't use Date.now() - that creates a different call each time!
    const callId = chatId; // Use the chat ID from params
    const callUrl = `${window.location.origin}/call/${callId}`;

    // Send the call invitation message
    channel.sendMessage({
      text: `🎥 Video call invitation: ${callUrl}`,
      attachments: [
        {
          type: 'video_call',
          call_url: callUrl,
        },
      ],
    });

    toast.success('Video call invitation sent!');

    // Navigate to the call page
    navigate(`/call/${callId}`);
  };

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
      <div className="flex gap-20 items-center justify-between">
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
        {!isGroup && (
          <Video
            onClick={handleVideoCall}
            size={30}
            className={`hover:cursor-pointer ${
              loading || !channel ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={loading ? 'Setting up video call...' : 'Start video call'}
          />
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
