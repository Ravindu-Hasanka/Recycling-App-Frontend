'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Volume2, VolumeX, SkipForward } from 'lucide-react';

export default function VideoIntroPage() {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  // Show skip button after 3 seconds
  useEffect(() => {
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 3000);
    
    return () => clearTimeout(skipTimer);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoPlaying(!videoPlaying);
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setSoundEnabled(!videoRef.current.muted);
    }
  };

  const skipVideo = () => {
    router.push('/story/game/10');
  };

  const handleVideoEnd = () => {
    router.push('/story/game/10');
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnd}
        onPlay={() => setVideoPlaying(true)}
        onPause={() => setVideoPlaying(false)}
        autoPlay
        muted={!soundEnabled}
      >
        <source src="/assets/animations/Chapter01.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end items-center p-8">
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 text-center">
          Chapter 10
        </h1>

        {/* Control buttons */}
        <div className="flex gap-4 mb-8">
          {/* Play/Pause button */}
          <button
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-4 transition-all duration-200"
          >
            {videoPlaying ? (
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="h-6 w-2 bg-white mx-0.5"></div>
                <div className="h-6 w-2 bg-white mx-0.5"></div>
              </div>
            ) : (
              <Play className="h-6 w-6 text-white fill-white" />
            )}
          </button>

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-4 transition-all duration-200"
          >
            {soundEnabled ? (
              <Volume2 className="h-6 w-6 text-white" />
            ) : (
              <VolumeX className="h-6 w-6 text-white" />
            )}
          </button>

          {/* Skip button */}
          {showSkip && (
            <button
              onClick={skipVideo}
              className="bg-green-600 hover:bg-green-700 rounded-full px-6 py-4 text-white font-semibold flex items-center gap-2 transition-all duration-200"
            >
              <SkipForward className="h-5 w-5" />
              Skip Intro
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-2xl bg-white/20 rounded-full h-2 mb-4">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: videoRef.current ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` : '0%' }}
          ></div>
        </div>
      </div>
    </div>
  );
}