import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VoiceMessage = ({ voiceUrl, duration, transcription, isSender }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex flex-col gap-1 min-w-[200px] rounded-lg p-2 ${
      isSender ? 'bg-primary text-primary-foreground' : 'bg-sidebar-accent'
    }`}>
      {/* Audio Player Row */}
      <div className="flex items-center gap-2">
        <audio ref={audioRef} src={voiceUrl} preload="metadata" />
        
        <Button
          size="icon"
          variant="ghost"
          onClick={togglePlay}
          className="size-8 rounded-full shrink-0 hover:bg-current/10"
        >
          {isPlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4 ml-0.5" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="relative h-8 flex items-center">
            <div className="w-full h-1 bg-current/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-current transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <span className="text-xs shrink-0 opacity-70">
          {formatTime(isPlaying ? currentTime : duration)}
        </span>
      </div>

      {/* Transcription Toggle & Text */}
      {transcription && (
        <div className="border-t border-current/10 pt-1 mt-1">
          {!showTranscript ? (
            <button 
              onClick={() => setShowTranscript(true)}
              className="text-[10px] font-medium opacity-70 hover:opacity-100 flex items-center gap-1 w-full"
            >
              <span className="bg-current/10 px-1.5 py-0.5 rounded">Aa</span>
              Show Transcript
            </button>
          ) : (
            <div className="text-xs space-y-1 animate-in fade-in slide-in-from-top-1">
              <p className="opacity-90 leading-relaxed">{transcription}</p>
              <button 
                onClick={() => setShowTranscript(false)}
                className="text-[10px] opacity-60 hover:opacity-100"
              >
                Hide
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceMessage;
