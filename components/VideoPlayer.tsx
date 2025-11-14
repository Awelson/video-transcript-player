
import React from 'react';
import YouTube from 'react-youtube';

interface VideoPlayerProps {
  videoId: string;
  onReady: (player: any) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onReady }) => {
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
    },
  };

  const handleReady = (event: { target: any }) => {
    onReady(event.target);
  };

  return (
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        className="h-full"
      />  
  );
};
