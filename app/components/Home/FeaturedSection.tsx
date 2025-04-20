'use client'

import React from 'react';
import { Button } from '../ui/button';
import Link from "next/link";

const FeaturedSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className='flex flex-col gap-3'>
          <div className="bg-blue-500 text-white p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Explore EcoKids Today</h2>
            <p className="mb-6">
              Discover an app designed to inspire young minds with engaging educational content, eco-friendly activities, and fun challenges. Empower your kids to learn while caring for the planet.
            </p>
            <Button 
              className="bg-white text-blue-500 hover:bg-gray-100" 
              asChild
            >
              <Link href="/signup">Join for Free</Link>
            </Button>
          </div>
          <div className="bg-green-500 text-white p-12 rounded-lg">
  <h2 className="text-3xl font-bold mb-4">Interactive Learning & Rewards</h2>
  <p className="mb-6">
    Make learning fun with EcoKids! Kids earn badges and rewards as they complete eco-missions, quizzes, and creative challenges. Designed to spark curiosity and a love for sustainability through play.
  </p>
  <Button 
    className="bg-white text-green-500 hover:bg-gray-100" 
    asChild
  >
    <Link href="/features">See Features</Link>
  </Button>
</div>

          </div>
          <div className="placeholder-img rounded-lg min-h-[300px]">
            <img src="/images/front-view-group-kids-posing-recycle-together.jpg" alt="EcoKids Featured" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
