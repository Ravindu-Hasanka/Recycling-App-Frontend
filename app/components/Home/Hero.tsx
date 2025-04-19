'use client'

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); 

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    const current = videoRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const toggleVideo = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted); 
  };

  return (
    <section className="py-12 md:py-20 text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to EcoKids!</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Explore Fun Learning for Your Little Ones!
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Button size="lg" className="bg-blue-500 hover:bg-blue-600" asChild>
          <Link href="/signup">Join us now</Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-blue-500 text-blue-500 hover:bg-blue-50"
          asChild
        >
          <Link href="/demo">Request demo</Link>
        </Button>
      </div>

      <div className="relative max-w-4xl mx-auto aspect-video bg-gray-200 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg"
          loop
          autoPlay
          playsInline
          preload="auto"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleVideo}
          className="rounded-full bg-white w-16 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-blue-500" />
          ) : (
            <Play className="h-8 w-8 text-blue-500" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleMute}
          className="rounded-full bg-white w-12 h-12 absolute top-4 right-4 shadow-md"
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6 text-blue-500" />
          ) : (
            <Volume2 className="h-6 w-6 text-blue-500" />
          )}
        </Button>
      </div>
    </section>
  );
};

export default Hero;
