import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '@/lib/token';

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const VideoCallPage = () => {
  const { callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { user } = useAuthStore();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!user,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !user || !callId) return;

      try {
        console.log('Initializing Stream video client...');

        const streamUser = {
          id: user._id,
          name: user.name,
          image: user.avatar,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: streamUser,
          token: tokenData.token,
        });

        const callInstance = videoClient.call('default', callId);

        await callInstance.join({ create: true });

        console.log('Joined call successfully');

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error('Error joining call:', error);
        toast.error('Could not join the call. Please try again.');
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, user, callId]);

  // Inject CSS to fix Stream components
  useEffect(() => {
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      /* Fix Stream Video controls */
      .str-video__call-controls {
        position: fixed !important;
        bottom: 20px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 9999 !important;
        display: flex !important;
        gap: 12px !important;
        padding: 16px !important;
        background: rgba(0, 0, 0, 0.7) !important;
        border-radius: 12px !important;
      }

      .str-video__call-controls button {
        all: revert !important;
        width: 48px !important;
        height: 48px !important;
        min-width: 48px !important;
        min-height: 48px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: rgba(255, 255, 255, 0.1) !important;
        border: none !important;
        cursor: pointer !important;
        transition: all 0.2s !important;
      }

      .str-video__call-controls button:hover {
        background: rgba(255, 255, 255, 0.2) !important;
      }

      .str-video__call-controls button svg {
        width: 24px !important;
        height: 24px !important;
        fill: white !important;
        stroke: white !important;
      }

      .str-video__speaker-layout {
        width: 100% !important;
        height: 100% !important;
      }

      .str-video__participant-view {
        all: revert !important;
      }
    `;

    document.head.appendChild(styleEl);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  if (isConnecting) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#1a1a1a',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Spinner className="w-12 h-12 mx-auto mb-4" />
          <p style={{ color: 'white', fontSize: '18px' }}>
            Connecting to call...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <p style={{ color: 'white' }}>
              Could not initialize call. Please refresh or try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) {
    navigate('/dashboard/chat');
    return null;
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default VideoCallPage;
