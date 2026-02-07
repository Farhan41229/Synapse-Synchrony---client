import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Send, Trash2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceRecorder } from '@/hooks/use-voice-recorder';
import { useChat } from '@/hooks/use-chat';
import { useAuthStore } from '@/store/authStore';

const VoiceRecorder = ({ chatId, replyTo, onCancel }) => {
  const {
    isRecording,
    recordingTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
  } = useVoiceRecorder();

  const { sendVoiceMessage } = useChat();
  const { user } = useAuthStore();
  
  // Preview player state
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const previewAudioRef = useRef(null);
  
  // Waveform animation state
  const [waveformHeights, setWaveformHeights] = useState(
    Array(30).fill(0).map(() => 20 + Math.random() * 60)
  );

  // Auto-start recording when component mounts
  useEffect(() => {
    startRecording();
  }, []);

  // Animate waveform bars while recording
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setWaveformHeights(prev => 
        prev.map(() => 20 + Math.random() * 60)
      );
    }, 150); // Update every 150ms for smooth animation

    return () => clearInterval(interval);
  }, [isRecording]);

  // Track preview playback progress
  useEffect(() => {
    const audio = previewAudioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setPreviewProgress(progress);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, [audioUrl]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = async () => {
    if (!audioBlob) return;

    await sendVoiceMessage({
      chatId,
      audioBlob,
      duration: recordingTime,
      replyTo,
      user,
    });

    resetRecording();
    onCancel();
  };

  const handleCancel = () => {
    cancelRecording();
    onCancel();
  };

  const handleDelete = () => {
    resetRecording();
    // Restart recording immediately after delete
    setTimeout(() => {
      startRecording();
    }, 100);
  };

  const togglePreviewPlay = () => {
    if (!previewAudioRef.current) return;

    if (isPreviewPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      previewAudioRef.current.play();
      setIsPreviewPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-sidebar-accent rounded-lg">
      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="size-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
        </div>
      )}

      {/* Preview (after recording) - Custom player */}
      {!isRecording && audioUrl && (
        <>
          <audio 
            ref={previewAudioRef} 
            src={audioUrl} 
            onEnded={() => {
              setIsPreviewPlaying(false);
              setPreviewProgress(0);
            }}
            className="hidden"
          />
          
          <div className="flex items-center gap-2 flex-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={togglePreviewPlay}
              className="size-8 rounded-full shrink-0 hover:bg-sidebar-muted/20"
            >
              {isPreviewPlaying ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4 ml-0.5" />
              )}
            </Button>
            
            <div className="flex-1 h-1 bg-sidebar-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-100" 
                style={{ width: `${previewProgress}%` }}
              />
            </div>
            
            <span className="text-xs text-sidebar-muted">{formatTime(recordingTime)}</span>
          </div>
        </>
      )}

      {/* Recording in progress - WhatsApp-style waveform animation */}
      {isRecording && (
        <div className="flex-1 flex items-center justify-center gap-[3px] h-10">
          {waveformHeights.map((height, i) => (
            <div
              key={i}
              className="w-[3px] bg-primary rounded-full transition-all duration-150"
              style={{
                height: `${height}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {isRecording && (
          <Button
            size="icon"
            variant="ghost"
            onClick={stopRecording}
            className="size-10 rounded-full bg-red-500 hover:bg-red-600"
          >
            <div className="size-3 bg-white rounded-sm" />
          </Button>
        )}

        {!isRecording && audioUrl && (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              className="size-10 rounded-full hover:bg-destructive/10"
            >
              <Trash2 className="size-5 text-destructive" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSend}
              className="size-10 rounded-full bg-primary hover:bg-primary/90"
            >
              <Send className="size-5 text-primary-foreground" />
            </Button>
          </>
        )}

        <Button
          size="icon"
          variant="ghost"
          onClick={handleCancel}
          className="size-10 rounded-full hover:bg-destructive/10"
        >
          <X className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export default VoiceRecorder;
