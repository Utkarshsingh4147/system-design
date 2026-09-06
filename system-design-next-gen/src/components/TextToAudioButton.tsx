import React from 'react';
import { Play, Pause, Square, Loader2 } from 'lucide-react';
import { useSubtopicAudio } from '../hooks/useSubtopicAudio';

interface TextToAudioButtonProps {
  subtopicId: string;
  text: string;
  subtopicTitle?: string;
}

export function TextToAudioButton({ subtopicId, text, subtopicTitle }: TextToAudioButtonProps) {
  const { activeSubtopicId, state, isSupported, togglePlay, stop } = useSubtopicAudio();

  if (!isSupported) {
    return (
      <span className="subtopic-audio-unsupported" title="Text-to-speech is not supported in this browser">
        Audio unavailable
      </span>
    );
  }

  const isActive = activeSubtopicId === subtopicId;
  const isLoading = isActive && state === 'loading';
  const isPlaying = isActive && state === 'playing';
  const isPaused = isActive && state === 'paused';

  const labelTitle = subtopicTitle ? ` for ${subtopicTitle}` : '';

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePlay(subtopicId, text);
  };

  const handleStop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    stop();
  };

  return (
    <div className="subtopic-audio-controls">
      {!isActive ? (
        <button
          type="button"
          className="subtopic-audio-btn play-btn"
          onClick={handlePlayPause}
          aria-label={`Play audio${labelTitle}`}
          title="Listen to this subtopic"
        >
          <Play size={12} className="btn-icon" />
          <span>Play to Listen</span>
        </button>
      ) : (
        <div className="subtopic-audio-active-group">
          {isLoading ? (
            <button
              type="button"
              className="subtopic-audio-btn active-btn loading-btn"
              disabled
              aria-label={`Preparing audio${labelTitle}`}
            >
              <Loader2 size={12} className="btn-icon animate-spin" />
              <span>Loading...</span>
            </button>
          ) : isPlaying ? (
            <button
              type="button"
              className="subtopic-audio-btn active-btn pause-btn"
              onClick={handlePlayPause}
              aria-label={`Pause audio${labelTitle}`}
              title="Pause audio"
            >
              <Pause size={12} className="btn-icon" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              type="button"
              className="subtopic-audio-btn active-btn resume-btn"
              onClick={handlePlayPause}
              aria-label={`Resume audio${labelTitle}`}
              title="Resume audio"
            >
              <Play size={12} className="btn-icon" />
              <span>Resume</span>
            </button>
          )}

          <button
            type="button"
            className="subtopic-audio-btn stop-btn"
            onClick={handleStop}
            aria-label={`Stop audio${labelTitle}`}
            title="Stop audio"
          >
            <Square size={12} className="btn-icon" />
            <span>Stop</span>
          </button>
        </div>
      )}
    </div>
  );
}
