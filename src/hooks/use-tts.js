import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for Text-to-Speech functionality using Web Speech API
 * @param {string} content - The content to be read (markdown supported)
 * @returns {object} TTS controls and state
 */
export const useTTS = (content) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState('0:00');

  const utteranceRef = useRef(null);
  const chunksRef = useRef([]);
  const currentChunkIndexRef = useRef(0);
  const plainTextRef = useRef('');

  // Check browser support
  useEffect(() => {
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);

    if (supported) {
      loadVoices();
      // Voices might load asynchronously
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Load available voices
  const loadVoices = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    // Filter for English voices
    const englishVoices = voices.filter((voice) => 
      voice.lang.startsWith('en')
    );
    setAvailableVoices(englishVoices.length > 0 ? englishVoices : voices);
    
    // Set default voice (prefer Google US English)
    const defaultVoice = 
      englishVoices.find((v) => v.name.includes('Google') && v.lang === 'en-US') ||
      englishVoices.find((v) => v.lang === 'en-US') ||
      englishVoices[0] ||
      voices[0];
    
    if (defaultVoice) {
      setSelectedVoice(defaultVoice);
    }
  }, []);

  // Strip markdown from content
  const stripMarkdown = useCallback((markdown) => {
    if (!markdown) return '';
    
    return markdown
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/_(.+?)_/g, '$1') // Remove italic underscore
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links, keep text
      .replace(/!\[.*?\]\(.+?\)/g, '') // Remove images
      .replace(/`{3}[\s\S]*?`{3}/g, '') // Remove code blocks
      .replace(/`(.+?)`/g, '$1') // Remove inline code
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered lists
      .replace(/^\s*>\s+/gm, '') // Remove blockquotes
      .replace(/---/g, '') // Remove horizontal rules
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }, []);

  // Chunk text into manageable pieces (Web Speech API has limits)
  const chunkText = useCallback((text, maxLength = 200) => {
    if (!text) return [];
    
    // Split by sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = '';

    sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim();
      if ((currentChunk + ' ' + trimmedSentence).length > maxLength && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = trimmedSentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
      }
    });

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }, []);

  // Calculate estimated time
  const calculateEstimatedTime = useCallback((text, wordsPerMinute = 150) => {
    const words = text.split(/\s+/).length;
    const minutes = words / wordsPerMinute / speed;
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [speed]);

  // Process content when it changes
  useEffect(() => {
    if (content) {
      const plainText = stripMarkdown(content);
      plainTextRef.current = plainText;
      chunksRef.current = chunkText(plainText);
      
      const words = plainText.split(/\s+/).filter(w => w.length > 0);
      setTotalWords(words.length);
      setEstimatedTime(calculateEstimatedTime(plainText));
    }
  }, [content, stripMarkdown, chunkText, calculateEstimatedTime]);

  // Speak a single chunk
  const speakChunk = useCallback((chunkIndex) => {
    if (!isSupported || !chunksRef.current[chunkIndex]) return;

    const chunk = chunksRef.current[chunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunk);
    
    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      // Move to next chunk
      if (chunkIndex < chunksRef.current.length - 1) {
        currentChunkIndexRef.current = chunkIndex + 1;
        speakChunk(chunkIndex + 1);
      } else {
        // All chunks completed
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
        setCurrentWord(totalWords);
        currentChunkIndexRef.current = 0;
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Update progress
        const wordsSpoken = plainTextRef.current
          .substring(0, event.charIndex)
          .split(/\s+/)
          .filter(w => w.length > 0).length;
        
        setCurrentWord(wordsSpoken);
        const progressPercent = (wordsSpoken / totalWords) * 100;
        setProgress(Math.min(progressPercent, 100));
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, speed, selectedVoice, totalWords]);

  // Play function
  const play = useCallback(() => {
    if (!isSupported) {
      console.warn('Speech Synthesis not supported');
      return;
    }

    if (isPaused) {
      // Resume
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else if (!isPlaying) {
      // Start from beginning or current chunk
      window.speechSynthesis.cancel();
      speakChunk(currentChunkIndexRef.current);
    }
  }, [isSupported, isPaused, isPlaying, speakChunk]);

  // Pause function
  const pause = useCallback(() => {
    if (isSupported && isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  }, [isSupported, isPlaying]);

  // Stop function
  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(0);
      setCurrentWord(0);
      currentChunkIndexRef.current = 0;
    }
  }, [isSupported]);

  // Change speed
  const changeSpeed = useCallback((newSpeed) => {
    setSpeed(newSpeed);
    setEstimatedTime(calculateEstimatedTime(plainTextRef.current));
    
    // If currently playing, restart with new speed
    if (isPlaying || isPaused) {
      const wasPlaying = isPlaying;
      window.speechSynthesis.cancel();
      if (wasPlaying) {
        setTimeout(() => speakChunk(currentChunkIndexRef.current), 100);
      }
    }
  }, [isPlaying, isPaused, speakChunk, calculateEstimatedTime]);

  // Change voice
  const changeVoice = useCallback((voice) => {
    setSelectedVoice(voice);
    
    // If currently playing, restart with new voice
    if (isPlaying || isPaused) {
      const wasPlaying = isPlaying;
      window.speechSynthesis.cancel();
      if (wasPlaying) {
        setTimeout(() => speakChunk(currentChunkIndexRef.current), 100);
      }
    }
  }, [isPlaying, isPaused, speakChunk]);

  return {
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
  };
};
