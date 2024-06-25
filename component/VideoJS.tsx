'use client';
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useSession } from "next-auth/react";

// Define the types we need explicitly
interface VideoJsPlayerOptions {
  autoplay?: boolean;
  controls?: boolean;
  responsive?: boolean;
  fluid?: boolean;
  sources?: {
    src: string;
    type: string;
  }[];
  poster?: string;
}

interface VideoJsPlayer {
  autoplay(value?: boolean): void;
  src(source: { src: string; type: string }[]): void;
  dispose(): void;
  isDisposed(): boolean;
  on(event: string, callback: () => void): void;
  off(event: string, callback: () => void): void;
  el(): HTMLElement;
}

interface VideoJSProps {
  options: VideoJsPlayerOptions;
  onReady?: (player: VideoJsPlayer) => void;
}

const VideoJS: React.FC<VideoJSProps> = ({ options, onReady }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('video-js', 'vjs-big-play-centered','custom-video-border');
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.setAttribute('controlsList', 'nodownload');
      // videoElement.setAttribute('disablePictureInPicture', 'true');

      videoRef.current?.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, function() {
        videojs.log('player is ready');
        if (onReady) {
          onReady(player);
        }
      }) as unknown as VideoJsPlayer;

      // Add watermark
      const watermarkDiv = document.createElement('div');
      // watermarkDiv.className = 'vjs-watermark';
      watermarkDiv.innerText =`${session?.user?.use_id || ""} - ${session?.user?.full_name || ""}`;
      watermarkDiv.style.position = 'absolute';
      watermarkDiv.style.top = '10px';
      watermarkDiv.style.right = '10px';
      watermarkDiv.style.color = 'white';
      watermarkDiv.style.fontSize = '18px';
      watermarkDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      watermarkDiv.style.padding = '5px';
      watermarkDiv.style.zIndex = '10';

      player.el().appendChild(watermarkDiv);

      // Ensure watermark stays in position in fullscreen
      const updateWatermarkPosition = () => {
        if (document.fullscreenElement) {
          watermarkDiv.style.position = 'fixed';
        } else {
          watermarkDiv.style.position = 'absolute';
        }
      };

      document.addEventListener('fullscreenchange', updateWatermarkPosition);
      player.on('dispose', () => {
        document.removeEventListener('fullscreenchange', updateWatermarkPosition);
      });

      updateWatermarkPosition();

    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay ?? false);
      player.src(options.sources ?? []);
    }
  }, [options, onReady]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player style={{ width: '75%', height: 'auto' }}>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
