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

const VideoCallPage = () => {
  const { callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  // ✅ Prevent double initialization (React 18 StrictMode runs effects twice in dev)
  const hasInitializedRef = useRef(false);
  const clientRef = useRef(null);
  const callRef = useRef(null);

  const { user } = useAuthStore();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!user,
  });

  useEffect(() => {
    // Skip if already initialized
    if (hasInitializedRef.current) {
      console.log('⏭️ Already initialized, skipping...');
      return;
    }

    if (!tokenData?.token || !user || !callId) {
      console.log('⚠️ Missing required data');
      return;
    }

    hasInitializedRef.current = true;
    console.log('🚀 Starting video call initialization...');
    console.log('📋 User ID:', user._id);
    console.log('📋 Call ID:', callId);

    const initCall = async () => {
      try {
        console.log('🔧 Creating StreamVideoClient...');
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
        console.log('✅ StreamVideoClient created');

        // Store in ref to prevent re-creation
        clientRef.current = videoClient;

        console.log('📞 Creating call instance for:', callId);
        const callInstance = videoClient.call('default', callId);
        callRef.current = callInstance;

        console.log('🔗 Joining call...');
        await callInstance.join({ create: true });
        console.log('✅ Successfully joined call!');

        // Set state AFTER everything is ready
        setClient(videoClient);
        setCall(callInstance);

        // Monitor participants
        callInstance.state.participants$.subscribe((participants) => {
          console.log('👥 Participants changed:', participants.length);
          participants.forEach((p, index) => {
            console.log(
              `   ${index + 1}. ${p.name || p.userId} (${p.userId})`,
              {
                isLocalParticipant: p.isLocalParticipant,
                sessionId: p.sessionId,
              }
            );
          });
        });

        setIsConnecting(false);
      } catch (error) {
        console.error('❌ Error joining call:', error);
        toast.error('Could not join the call. Please try again.');
        hasInitializedRef.current = false;
        setIsConnecting(false);
      }
    };

    initCall();

    // Cleanup function - ONLY runs on unmount
    return () => {
      console.log('🧹 Cleanup: Component unmounting...');

      // Leave the call
      if (callRef.current) {
        console.log('📴 Leaving call...');
        callRef.current
          .leave()
          .then(() => console.log('✅ Left call'))
          .catch((err) => console.error('❌ Error leaving:', err));
      }

      // Disconnect the client
      if (clientRef.current) {
        console.log('🔌 Disconnecting client...');
        clientRef.current
          .disconnectUser()
          .then(() => {
            console.log('✅ Disconnected');
            clientRef.current = null;
            callRef.current = null;
          })
          .catch((err) => console.error('❌ Error disconnecting:', err));
      }

      hasInitializedRef.current = false;
    };
  }, [tokenData?.token, user?._id, callId]); // Only re-run if these actually change

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
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
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
    console.log('👋 User left the call, navigating back...');
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
