
import React, { useState, useRef, useEffect } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { TranscriptPanel } from './TranscriptPanel';
import { ControlPanel } from './ControlPanel';
import { TranscriptLine } from '../types';
import InitialTranscript from '../transcript.json';

const YOUTUBE_VIDEO_ID = 'gtaqT73B83E';

export const Player: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const playerRef = useRef<any>(null);
  const timeUpdateInterval = useRef<number | null>(null);

  const [videoIdInput, setVideoIdInput] = useState(YOUTUBE_VIDEO_ID);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);

  const [videoId, setVideoId] = useState(YOUTUBE_VIDEO_ID);
  const [transcript, setTranscript] = useState<TranscriptLine[]>(InitialTranscript);
  const [isEditing, setIsEditing] = useState(false);

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
    }
    timeUpdateInterval.current = window.setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const time = playerRef.current.getCurrentTime();
        if (time !== undefined) {
          setCurrentTime(time);
        }
      }
    }, 250);
  };

  const handleLineClick = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
      playerRef.current.playVideo();
    }
  };

  const handleLoad = () => {
    setVideoId(videoIdInput);

    if (transcriptFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            let parsedTranscript = JSON.parse(content);
            if (!Array.isArray(parsedTranscript)) {
              parsedTranscript = [parsedTranscript];
            }
            setTranscript(parsedTranscript);
          }
        } catch (error) {
          console.error("Error parsing transcript file", error);
        }
      };
      reader.readAsText(transcriptFile);
    }
  };

  const handleToggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveTranscript = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transcript, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transcript.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleTranscriptChange = (newTranscript: TranscriptLine[]) => {
    setTranscript(newTranscript);
  };

  useEffect(() => {
    return () => {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
    };
  }, []);

  return (
    <div>
      <header className="mb-4">
        <ControlPanel
          onVideoChange={setVideoIdInput}
          onTranscriptChange={setTranscriptFile}
          onLoad={handleLoad}
          onToggleEditMode={handleToggleEditMode}
          onSaveTranscript={handleSaveTranscript}
          isEditing={isEditing}
        />
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
          <div className="relative aspect-video">
            <VideoPlayer
              videoId={videoId}
              onReady={handlePlayerReady}
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <TranscriptPanel
            transcript={transcript}
            currentTime={currentTime}
            onLineClick={handleLineClick}
            isEditing={isEditing}
            onTranscriptChange={handleTranscriptChange}
          />
        </div>
      </main>
    </div>
  );
};
