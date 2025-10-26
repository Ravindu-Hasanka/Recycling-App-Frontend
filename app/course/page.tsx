"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const COURSE = [
  {
    id: "day1",
    title: "Day 1 — Introduction to Recycling",
    description: "Discover why recycling matters and how small actions can make a big difference.",
    link: "/learn/day1",
    image: "/images/day1.jpg",
    status: "COMPLETED",
  },
  {
    id: "day2",
    title: "Day 2 — Sorting Waste Correctly",
    description: "Learn how to identify and sort recyclable materials to reduce waste effectively.",
    link: "/learn/day2",
    image: "/images/day2.jpg",
    status: "IN_PROGRESS",
  },
  {
    id: "day3",
    title: "Day 3 — Taking Action in Your Community",
    description: "Apply your knowledge by participating in a cleanup activity and inspiring others!",
    link: "/learn/day3",
    image: "/images/day3.jpg",
    status: "NOT_STARTED",
  },
] as const;

export default function LearnThreeDayCourse() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("role") !== "STUDENT") router.push("/");
  }, [router]);

  const [startingId, setStartingId] = useState<string | null>(null);
  const courseIds = useMemo(() => COURSE.map((c) => c.id), []);

  const getStatus = (id: string) => COURSE.find((c) => c.id === id)?.status || "NOT_STARTED";
  const isUnlocked = (idx: number) => (idx === 0 ? true : getStatus(COURSE[idx - 1].id) === "COMPLETED");

  const handleStart = (storyId: string, link: string) => {
    setStartingId(storyId);
    setTimeout(() => {
      router.push(link);
      setStartingId(null);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-blue-600">
            EcoKids 3-Day Recycling Challenge
          </h1>
          <p className="text-xl text-center text-gray-700 mb-12">
            Complete each day’s mission to become a certified EcoHero! Each task builds your recycling superpowers step by step.
          </p>

          <section>
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Course Progress</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {COURSE.map((act, idx) => {
                const unlocked = isUnlocked(idx);
                const done = act.status === "COMPLETED";
                const inProgress = act.status === "IN_PROGRESS";
                const disabled = !unlocked || done || startingId === act.id;

                return (
                  <div key={act.id} className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                    {!unlocked && (
                      <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                        <div className="px-3 py-1 rounded bg-white text-gray-800 text-sm font-semibold">Locked — complete the previous day</div>
                      </div>
                    )}

                    <div className="h-48 bg-gray-100">
                      <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="p-6">
                      <h3 className="font-semibold text-xl mb-1 text-gray-800">{act.title}</h3>
                      <p className="text-gray-600 mb-4">{act.description}</p>

                      <button
                        onClick={() => handleStart(act.id, act.link)}
                        disabled={disabled}
                        className={`w-full py-2 rounded transition ${disabled ? "bg-gray-300 cursor-not-allowed text-gray-700" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                      >
                        {done
                          ? "Completed"
                          : startingId === act.id
                          ? "Starting…"
                          : unlocked && inProgress
                          ? "Continue"
                          : unlocked
                          ? "Start"
                          : "Locked"}
                      </button>

                      {done && (
                        <p className="text-green-600 text-sm font-medium mt-2">Excellent! You've finished this day's challenge.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}