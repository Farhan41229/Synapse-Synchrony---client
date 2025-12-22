import { useEffect, useState, useRef } from 'react';
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

// ✅ CRITICAL FIX: Store client globally to prevent duplicates
let globalVideoClient = null;
let globalUserId = null;

const VideoCallPage = () => {
  const { callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const hasJoinedRef = useRef(false); // Prevent double joins

  const { user } = useAuthStore();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!user,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !user || !callId) return;
      if (hasJoinedRef.current) return; // Prevent double joins

      try {
        console.log('Initializing Stream video client...');
        hasJoinedRef.current = true;

        // ✅ CRITICAL FIX: Reuse existing client if same user
        let videoClient;

        if (globalVideoClient && globalUserId === user._id) {
          console.log('Reusing existing video client');
          videoClient = globalVideoClient;
        } else {
          // Disconnect old client if different user
          if (globalVideoClient) {
            console.log('Disconnecting old client (different user)');
            try {
              await globalVideoClient.disconnectUser();
            } catch (e) {
              console.error('Error disconnecting old client:', e);
            }
          }

          console.log('Creating new video client');
          const streamUser = {
            id: user._id,
            name: user.name,
            image: user.avatar,
          };

          videoClient = new StreamVideoClient({
            apiKey: STREAM_API_KEY,
            user: streamUser,
            token: tokenData.token,
          });

          globalVideoClient = videoClient;
          globalUserId = user._id;
        }

        // Join the call
        const callInstance = videoClient.call('default', callId);

        console.log('Joining call:', callId);
        await callInstance.join({ create: true });

        console.log('Joined call successfully');

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error('Error joining call:', error);
        toast.error('Could not join the call. Please try again.');
        hasJoinedRef.current = false;
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    // ✅ Cleanup: Leave call but DON'T disconnect client (we'll reuse it)
    return () => {
      console.log('Component unmounting, leaving call...');
      if (call) {
        call
          .leave()
          .then(() => console.log('Left call successfully'))
          .catch((err) => console.error('Error leaving call:', err));
      }
      // DON'T disconnect the client here - we'll reuse it
      hasJoinedRef.current = false;
    };
  }, [tokenData, user, callId]);

  // Inject CSS to fix Stream components
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
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
