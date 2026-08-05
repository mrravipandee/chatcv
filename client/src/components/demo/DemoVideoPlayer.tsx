"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Activity } from "lucide-react";

export default function DemoVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  // Auto-hide controls when playing and idle
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isPlaying) {
      timeoutId = setTimeout(() => {
        setControlsVisible(false);
      }, 2500);
    } else {
      setControlsVisible(true);
    }
    return () => clearTimeout(timeoutId);
  }, [isPlaying, controlsVisible]);

  const handleMouseMove = () => {
    setControlsVisible(true);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((err) => console.log("Play failed", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    if (dur > 0) {
      setProgress((current / dur) * 100);
    }
    setCurrentTime(formatTime(current));
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newProgress = parseFloat(e.target.value);
    const dur = videoRef.current.duration || 0;
    videoRef.current.currentTime = (newProgress / 100) * dur;
    setProgress(newProgress);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
    if (nextMute) {
      videoRef.current.volume = 0;
    } else {
      videoRef.current.volume = volume || 0.8;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Error attempting to enable fullscreen", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
      className="relative group w-full aspect-video rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] hover:border-[#00ff9c]/30 transition-all duration-700"
    >
      {/* Glow highlight */}
      <div className="absolute inset-0 bg-radial-to-b from-[#00ff9c]/5 via-transparent to-transparent pointer-events-none z-10" />

      {/* Actual HTML5 Video element */}
      <video
        ref={videoRef}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="w-full h-full object-cover cursor-pointer"
        playsInline
        src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34285-large.mp4"
        poster="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop"
      />

      {/* Dark tint overlay on hover/controls visibility */}
      <div 
        onClick={togglePlay}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 cursor-pointer ${
          controlsVisible || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Centered big play button when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#00ff9c] text-black rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,255,156,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 z-20 cursor-pointer"
        >
          <Play className="w-8 h-8 fill-black translate-x-0.5" />
        </button>
      )}

      {/* Top Bar - Video Title (Visible when hovered/paused) */}
      <div
        className={`absolute top-0 inset-x-0 p-6 flex items-center justify-between bg-linear-to-b from-black/80 to-transparent transition-all duration-300 z-20 ${
          controlsVisible || !isPlaying ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#00ff9c] rounded-full animate-ping" />
          <span className="text-xs uppercase tracking-widest text-zinc-300 font-mono font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#00ff9c]" /> Product Walkthrough
          </span>
        </div>
        <div className="text-[10px] font-mono bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-zinc-400">
          ChatCV v1.0 Demo
        </div>
      </div>

      {/* Bottom Bar - Custom Controls */}
      <div
        className={`absolute bottom-0 inset-x-0 p-6 bg-linear-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-4 transition-all duration-300 z-20 ${
          controlsVisible || !isPlaying ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        {/* Timeline Slider */}
        <div className="flex items-center gap-4 w-full">
          <span className="text-xs font-mono text-zinc-400 shrink-0">{currentTime}</span>
          <div className="relative flex-1 group/slider">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00ff9c] outline-hidden focus:outline-hidden"
              style={{
                background: `linear-gradient(to right, #00ff9c 0%, #00ff9c ${progress}%, #27272a ${progress}%, #27272a 100%)`
              }}
            />
          </div>
          <span className="text-xs font-mono text-zinc-400 shrink-0">{duration}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="text-zinc-200 hover:text-[#00ff9c] transition-colors focus:outline-hidden cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-zinc-200 hover:fill-[#00ff9c]" /> : <Play className="w-5 h-5 fill-zinc-200 hover:fill-[#00ff9c]" />}
            </button>

            {/* Restart Button */}
            <button
              onClick={handleRestart}
              className="text-zinc-400 hover:text-white transition-colors focus:outline-hidden cursor-pointer"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Volume control */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="text-zinc-200 hover:text-[#00ff9c] transition-colors focus:outline-hidden cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00ff9c] outline-hidden opacity-0 group-hover/volume:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to right, #00ff9c 0%, #00ff9c ${(isMuted ? 0 : volume) * 100}%, #27272a ${(isMuted ? 0 : volume) * 100}%, #27272a 100%)`
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="text-zinc-200 hover:text-[#00ff9c] transition-colors focus:outline-hidden cursor-pointer"
              title="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
