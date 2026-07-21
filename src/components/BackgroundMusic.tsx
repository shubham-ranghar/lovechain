import { useState } from 'react';
import { Music, X, ChevronUp, ChevronDown } from 'lucide-react';

const DEFAULT_SPOTIFY_TRACK_ID = '1GnZH0wek1fkGCQnUsK6D0'; // Aarzu by Asim Azhar, Noor, Khan & Madhurxo

interface BackgroundMusicProps {
  show?: boolean;
  trackId?: string;
}

export function BackgroundMusic({ show = true, trackId = DEFAULT_SPOTIFY_TRACK_ID }: BackgroundMusicProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!show) return null;

  const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&autoplay=1`;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed state - just music icon */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="grid h-12 w-12 place-items-center rounded-full bg-card/80 backdrop-blur shadow-soft border border-border hover:scale-105 transition-transform"
          aria-label="Open music player"
        >
          <Music className="h-5 w-5 text-soft-red" />
        </button>
      ) : (
        /* Expanded state - Spotify embed widget */
        <div className="bg-card/90 backdrop-blur rounded-2xl shadow-soft border border-border overflow-hidden transition-all duration-300">
          {/* Header with collapse controls */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-soft-red" />
              <span className="text-xs font-medium text-foreground">Now Playing</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded hover:bg-blush/40 transition-colors"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded hover:bg-blush/40 transition-colors"
                aria-label="Minimize"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Spotify iframe */}
          {isExpanded && (
            <div className="w-80">
              <iframe
                style={{ borderRadius: '0 0 12px 12px' }}
                src={spotifyEmbedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                data-spotify-track-id={trackId}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
