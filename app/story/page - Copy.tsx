// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Volume2, VolumeX, Play } from "lucide-react";

export default function Home() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    playNatureSounds();
  }, []);

  function playNatureSounds() {
    console.log("Nature sounds playing... 🎵");
  }

  function stopNatureSounds() {
    console.log("Nature sounds muted 🔇");
  }

  function toggleSound() {
    if (soundEnabled) {
      stopNatureSounds();
    } else {
      playNatureSounds();
    }
    setSoundEnabled(!soundEnabled);
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-sky-950 to-cyan-600 text-white">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* Floating background elements */}
      <motion.div
        className="absolute bottom-0 left-[10%] w-24 h-56 bg-green-900 opacity-70"
        style={{ clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />
      <motion.div
        className="absolute bottom-0 right-[15%] w-24 h-48 bg-green-700 opacity-70"
        style={{ clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)" }}
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />

      {/* Clouds */}
      <motion.div
        className="absolute top-[20%] left-5 w-24 h-10 bg-white/40 rounded-full"
        animate={{ x: ["-100px", "110vw"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      />
      <motion.div
        className="absolute top-[30%] right-5 w-40 h-12 bg-white/40 rounded-full"
        animate={{ x: ["-100px", "110vw"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear", delay: 5 }}
      />

      {/* Birds */}
      <motion.div
        className="absolute text-2xl"
        animate={{ x: ["-100px", "110vw"], y: [0, -20, 0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      >
        🐦
      </motion.div>
      <motion.div
        className="absolute text-2xl top-[40%]"
        animate={{ x: ["-100px", "110vw"], y: [0, 20, -10, 20, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear", delay: 5 }}
      >
        🦜
      </motion.div>

      {/* Sound Toggle */}
      <button
        onClick={toggleSound}
        className="fixed top-5 right-5 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
        aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
      >
        {soundEnabled ? (
          <Volume2 size={24} />
        ) : (
          <VolumeX size={24} />
        )}
      </button>

      {/* Title */}
      <motion.h1
        className="text-5xl md:text-6xl font-bold text-center mb-6 drop-shadow-lg"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
      >
        EcoHero Adventure Quest
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-2xl text-center max-w-2xl mb-10 drop-shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Join me on an amazing adventure to save our planet! 🌍
      </motion.p>

      {/* Character + Chat */}
      <div className="relative w-72 h-72 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <Image
            src="/assets/ecohero-character.jpg"
            alt="EcoHero character"
            width={300}
            height={300}
            className="rounded-full shadow-2xl object-cover"
            priority
          />
        </motion.div>

        {/* Chat Bubble */}
        <motion.div
          className="absolute top-10 left-80 bg-white text-sky-900 px-6 py-4 rounded-2xl shadow-xl max-w-md hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          Welcome to our imaginary world! I&apos;m EcoHero, guardian of our
          planet! Our beautiful Earth needs your help to fight pollution and
          climate change. Are you ready to join me on this important adventure?
        </motion.div>
      </div>

      {/* Mobile Chat Bubble */}
      <motion.div
        className="bg-white text-sky-900 px-6 py-4 rounded-2xl shadow-xl max-w-md mt-6 md:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        Welcome to our imaginary world! I&apos;m EcoHero, guardian of our
        planet! Our beautiful Earth needs your help to fight pollution and
        climate change. Are you ready to join me on this important adventure?
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex flex-wrap gap-4 justify-center mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 4 }}
      >
        <button
          onClick={() =>
            alert("Adventure started! Navigating to the first adventure screen...")
          }
          className="px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-green-700 font-semibold shadow-lg hover:scale-105 transition-transform flex items-center"
        >
          <Play className="mr-2" size={20} />
          Start Adventure!
        </button>
        <button className="px-6 py-3 rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-md font-semibold shadow-md hover:scale-105 transition-transform flex items-center">
          <span className="mr-2">🎵</span> Meet the Characters
        </button>
      </motion.div>
    </div>
  );
}