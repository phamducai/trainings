"use client";
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useSession } from "next-auth/react";
import axios from "axios";

// Define the types we need explicitly
interface VideoJsPlayerOptions {
  autoplay?: boolean;
  controls?: boolean;
  responsive?: boolean;
  fluid?: boolean;
  sources?: {
    src: string;
    type: string;
    id: number;
    couseId: number;
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
  pause(): void;
  play(): void;
  currentTime(): number;
  currentTime(seconds: number): void;
  el(): HTMLElement;
}

interface VideoJSProps {
  options: VideoJsPlayerOptions;
  onReady?: (player: VideoJsPlayer) => void;
  onEnded?: () => void;
}

const VideoJS: React.FC<VideoJSProps> = ({ options, onReady, onEnded }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const { data: session } = useSession();
  const currentTimeRef = useRef(0);
  useEffect(() => {
    const initializePlayer = () => {
      if (!playerRef.current) {
        const videoElement = document.createElement("video-js");
        videoElement.classList.add(
          "video-js",
          "vjs-big-play-centered",
          "custom-video-border"
        );
        videoElement.style.width = "100%";
        videoElement.style.height = "100%";
        videoElement.setAttribute("controlsList", "nodownload");

        videoRef.current?.appendChild(videoElement);

        const player = (playerRef.current = videojs(
          videoElement,
          options,
          function () {
            videojs.log("player is ready");
            if (onReady) {
              onReady(player);
            }

            // Add watermark
            const watermarkDiv = document.createElement("div");
            watermarkDiv.innerText = `${session?.user?.full_name || ""} (${
              session?.user?.name || ""
            }) `;
            watermarkDiv.style.position = "absolute";
            watermarkDiv.style.top = "10px";
            watermarkDiv.style.right = "10px";
            watermarkDiv.style.color = "white";
            watermarkDiv.style.fontSize = "18px";
            watermarkDiv.style.padding = "5px";
            watermarkDiv.style.zIndex = "10";
            watermarkDiv.style.opacity = "0.7";

            player.el().appendChild(watermarkDiv);

            // Ensure watermark stays in position in fullscreen
            const updateWatermarkPosition = () => {
              if (document.fullscreenElement) {
                watermarkDiv.style.position = "fixed";
              } else {
                watermarkDiv.style.position = "absolute";
              }
            };

            document.addEventListener(
              "fullscreenchange",
              updateWatermarkPosition
            );
            player.on("dispose", () => {
              document.removeEventListener(
                "fullscreenchange",
                updateWatermarkPosition
              );
            });

            updateWatermarkPosition();

            // Listen for the ended event
            player.on("ended", async () => {
              if (onEnded) {
                onEnded();
              }
            });

            // Save current time when visibility changes
            const handleVisibilityChange = () => {
              if (document.hidden) {
                currentTimeRef.current = player.currentTime();
                player.pause();
              } else {
                player.currentTime(currentTimeRef.current);
                player.play();
              }
            };

            document.addEventListener(
              "visibilitychange",
              handleVisibilityChange
            );

            player.on("dispose", () => {
              document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
              );
            });
            player.on("play",async () => {
              if (session && session.user) {
                try {
                  await axios.post("/api/markVideoWatched", {
                    userId: session.user.use_id ?? 0,
                    videoId: options.sources?.[0].id ?? 0,
                    courseId: options.sources?.[0].couseId ?? 0,
                  });
                } catch (error) {
                  console.error("Error marking video as watched:", error);
                }
              }
            });
          }
        ) as unknown as VideoJsPlayer);
      } else {
        const player = playerRef.current;
        player.autoplay(options.autoplay ?? false);
        player.src(options.sources ?? []);
      }
    };

    initializePlayer();

    return () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onEnded, onReady]);

  return (
    <div data-vjs-player style={{ width: "75%", height: "auto" }}>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
