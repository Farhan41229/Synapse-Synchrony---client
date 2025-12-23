import React, { useEffect, useState } from 'react';
import { getOtherUserAndGroup } from '@/lib/helper';
import { ArrowLeft, PhoneCall, Video } from 'lucide-react';
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

        await client.connectUser(
          {
            id: user._id,
            name: user.name || user.fullName,
            image: user.avatar || user.profilePic,
          },
          tokenData.token
        );

        console.log('User connected to Stream');

        const channelId = [user._id, otherUser._id].sort().join('-');

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
        toast.error('Could not connect to chat. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (chatClient) {
        console.log('Disconnecting chat client...');
        chatClient.disconnectUser();
      }
    };
  }, [tokenData, user, otherUser?._id, STREAM_API_KEY]);

  const handleVideoCall = async () => {
    if (!channel) {
      toast.error('Video call not ready. Please wait...');
      return;
    }

    try {
      const callId = chatId;
      const callUrl = `${window.location.origin}/call/${callId}`;

      await channel.sendMessage({
        text: `🎥 Video call invitation: ${callUrl}`,
        attachments: [
          {
            type: 'video_call',
            call_url: callUrl,
          },
        ],
      });

      toast.success('Starting video call...');

      if (chatClient) {
        await chatClient.disconnectUser();
        setChatClient(null);
        setChannel(null);
      }

      setTimeout(() => {
        navigate(`/call/${callId}`);
      }, 100);
    } catch (error) {
      console.error('Error starting video call:', error);
      toast.error('Could not start video call');
    }
  };

  const handleAudioCall = async () => {
    if (!channel) {
      toast.error('Audio call not ready. Please wait...');
      return;
    }

    try {
      // Use chatId directly (same as video) since it's the same conversation
      const callId = chatId;
      const callUrl = `${window.location.origin}/audio-call/${callId}`;

      await channel.sendMessage({
        text: `📞 Audio call invitation: ${callUrl}`,
        attachments: [
          {
            type: 'audio_call',
            call_url: callUrl,
          },
        ],
      });

      toast.success('Starting audio call...');

      if (chatClient) {
        await chatClient.disconnectUser();
        setChatClient(null);
        setChannel(null);
      }

      setTimeout(() => {
        navigate(`/audio-call/${callId}`);
      }, 100);
    } catch (error) {
      console.error('Error starting audio call:', error);
      toast.error('Could not start audio call');
    }
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
      <div className="flex gap-5 items-center">
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
          <div className="flex gap-4 items-center">
            <Video
              onClick={handleVideoCall}
              size={22}
              className={`hover:cursor-pointer transition-all ${
                loading || !channel
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-75 hover:scale-110'
              }`}
              title={loading ? 'Setting up video call...' : 'Start video call'}
            />
            <PhoneCall
              onClick={handleAudioCall}
              size={22}
              className={`hover:cursor-pointer transition-all ${
                loading || !channel
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-75 hover:scale-110'
              }`}
              title={loading ? 'Setting up audio call...' : 'Start audio call'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
