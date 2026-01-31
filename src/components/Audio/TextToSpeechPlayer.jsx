import React, { useEffect } from 'react';
import { useTTS } from '@/hooks/use-tts';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Gauge,
  Mic2,
} from 'lucide-react';
import AOS from 'aos';

const TextToSpeechPlayer = ({ content, title }) => {
  const {
    isSupported,
    isPlaying,
    isPaused,
    progress,
    currentWord,
    totalWords,
    speed,
    availableVoices,
    selectedVoice,
    estimatedTime,
    play,
    pause,
    stop,
    changeSpeed,
    changeVoice,
  } = useTTS(content);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedSpeed = localStorage.getItem('tts-speed');
    const savedVoice = localStorage.getItem('tts-voice');
    
    if (savedSpeed) {
      changeSpeed(parseFloat(savedSpeed));
    }
    
    if (savedVoice && availableVoices.length > 0) {
      const voice = availableVoices.find(v => v.name === savedVoice);
      if (voice) {
        changeVoice(voice);
      }
    }
  }, [availableVoices]);

  // Save preferences to localStorage
  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    changeSpeed(newSpeed);
    localStorage.setItem('tts-speed', newSpeed.toString());
  };

  const handleVoiceChange = (e) => {
    const voice = availableVoices.find(v => v.name === e.target.value);
    if (voice) {
      changeVoice(voice);
      localStorage.setItem('tts-voice', voice.name);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  if (!isSupported) {
    return (
      <div
        className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl"
        data-aos="fade-down"
      >
        <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
          <VolumeX className="w-6 h-6" />
          <div>
            <p className="font-semibold">Text-to-Speech Not Supported</p>
            <p className="text-sm">
              Your browser doesn't support the Web Speech API. Please try Chrome,
              Edge, or Safari.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-clip-padding"
      style={{
        borderImage: 'linear-gradient(135deg, #04642a, #15a33d) 1',
      }}
      data-aos="fade-down"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-[#04642a] to-[#15a33d] rounded-lg">
          <Volume2 className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Listen to this {title ? 'Article' : 'Content'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {totalWords} words • {estimatedTime} at {speed}x speed
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>
            {currentWord} / {totalWords} words
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-[#04642a] to-[#15a33d] transition-all duration-300 ease-out ${
              isPlaying ? 'animate-pulse' : ''
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            disabled={!content || totalWords === 0}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              isPlaying
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-gradient-to-r from-[#04642a] to-[#15a33d] hover:from-[#15a33d] hover:to-[#04642a] text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {isPaused ? 'Resume' : 'Play'}
              </>
            )}
          </button>

          <button
            onClick={stop}
            disabled={!isPlaying && !isPaused}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Square className="w-5 h-5" />
            Stop
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Gauge className="w-5 h-5 text-[#04642a]" />
            <span className="text-sm font-medium">Speed:</span>
          </div>
          <select
            value={speed}
            onChange={handleSpeedChange}
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-lg font-medium focus:border-[#04642a] focus:outline-none transition-all cursor-pointer"
          >
            <option value="0.5">0.5x (Slow)</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x (Normal)</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x (Fast)</option>
            <option value="1.75">1.75x</option>
            <option value="2">2x (Very Fast)</option>
          </select>
        </div>
      </div>

      {/* Voice Selection */}
      {availableVoices.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Mic2 className="w-5 h-5 text-[#04642a]" />
            <span className="text-sm font-medium">Voice:</span>
          </div>
          <select
            value={selectedVoice?.name || ''}
            onChange={handleVoiceChange}
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-lg font-medium focus:border-[#04642a] focus:outline-none transition-all cursor-pointer"
          >
            {availableVoices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Info Note */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Tip:</strong> Your speed and voice preferences are automatically
          saved. You can pause and resume anytime!
        </p>
      </div>

      {/* Playing Indicator */}
      {isPlaying && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-semibold animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            Speaking...
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToSpeechPlayer;
