"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.1);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Set initial volume
    audio.volume = volume;

    const tryPlay = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.log("Autoplay prevented:", error);
          setIsPlaying(false);
        });
    };

    tryPlay();
    
    const handleInteraction = () => {
      if (audio.paused) {
        tryPlay();
      }
      document.removeEventListener("click", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
    };
  }, []); // Run once on mount

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume > 0 ? volume : 0.1;
        setVolume(volume > 0 ? volume : 0.1);
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/shiv_kailash_k_vasi.mp3" loop />
      <div 
        className="fixed bottom-4 left-4 z-50 flex items-center gap-3 p-3 bg-[#0b0c10]/90 backdrop-blur-md rounded-full text-[#f3f4f6] shadow-2xl border border-white/20 transition-all duration-300"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <button
          onClick={togglePlay}
          className="hover:text-orange-500 transition-colors focus:outline-none flex items-center justify-center w-6 h-6"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        
        {isExpanded && (
          <div className="flex items-center gap-3 pr-2 animate-in fade-in slide-in-from-left-4 duration-300">
            <button onClick={toggleMute} className="hover:text-orange-500 transition-colors focus:outline-none flex items-center">
               {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
        )}
      </div>
    </>
  );
}
