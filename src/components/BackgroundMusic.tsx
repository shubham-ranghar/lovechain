import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const DEFAULT_YOUTUBE_VIDEO_ID = '6hV1jnQssj0'; // Aarzu by Asim Azhar & Noor Khan

interface BackgroundMusicProps {
  show?: boolean;
  videoId?: string;
}

export function BackgroundMusic({ show = true, videoId = DEFAULT_YOUTUBE_VIDEO_ID }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      if (playerRef.current) return;

      playerRef.current = new (window as any).YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: videoId,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(30);
            event.target.mute(); // Start muted to avoid autoplay blocking
            event.target.playVideo();
            setIsPlaying(true);
            setIsMuted(true);
          },
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const toggleMute = () => {
    if (!playerRef.current) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Hidden YouTube iframe - off-screen wrapper */}
      <div 
        id="youtube-player" 
        className="fixed -left-[9999px] top-0 w-1 h-0 pointer-events-none"
        data-youtube-video-id={videoId}
      />

      {/* Floating mute/unmute button - bottom-right */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute music" : "Mute music"}
        className={`fixed bottom-4 right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-card/80 backdrop-blur shadow-soft border border-border hover:scale-105 transition-transform ${
          isMuted ? 'animate-pulse' : ''
        }`}
        data-music-state={isMuted ? 'muted' : 'playing'}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-soft-red" />
        ) : (
          <Volume2 className="h-5 w-5 text-soft-red" />
        )}
      </button>
    </>
  );
}
