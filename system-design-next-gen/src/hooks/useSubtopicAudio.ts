import { useEffect, useState, useCallback } from 'react';
import { speechManager, PlaybackState, PlaybackStatus } from '../lib/speechManager';

export function useSubtopicAudio() {
  const [status, setStatus] = useState<PlaybackStatus>(() => speechManager.getStatus());

  useEffect(() => {
    const unsubscribe = speechManager.subscribe((newStatus) => {
      setStatus(newStatus);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const play = useCallback((id: string, narrationScript: string) => {
    speechManager.play(id, narrationScript);
  }, []);

  const pause = useCallback(() => {
    speechManager.pause();
  }, []);

  const resume = useCallback(() => {
    speechManager.resume();
  }, []);

  const stop = useCallback(() => {
    speechManager.stop();
  }, []);

  const togglePlay = useCallback((id: string, narrationScript: string) => {
    if (status.activeId === id) {
      if (status.state === 'playing') {
        speechManager.pause();
      } else if (status.state === 'paused') {
        speechManager.resume();
      } else {
        speechManager.play(id, narrationScript);
      }
    } else {
      speechManager.play(id, narrationScript);
    }
  }, [status.activeId, status.state]);

  return {
    activeSubtopicId: status.activeId,
    state: status.state,
    error: status.error,
    isLoading: status.state === 'loading',
    isPlaying: status.state === 'playing',
    isPaused: status.state === 'paused',
    isSupported: speechManager.checkSupport(),
    play,
    pause,
    resume,
    stop,
    togglePlay,
  };
}
