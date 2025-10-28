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
            <h2 className="text-3xl font-bold mb-4">Play the Recycling Adventure Game</h2>
            <p className="mb-6">
              Challenge yourself in our 3D recycling-themed game designed for young players. Collect, sort, and recycle items in exciting scenarios. Discover how your actions make a real-world impact on the environment.
</p>
            <Button
  className="bg-white text-green-500 hover:bg-gray-100"
  asChild
>
  <a
    href="https://drive.google.com/drive/folders/1Jw77I3eQiYCou7jdEdI2Uqif4fC4Er1N?usp=drive_link"
    download
    target="_blank"
    rel="noopener noreferrer"
  >
    Download Game (.exe)
  </a>
</Button>

          </div>
          <div className="bg-green-500 text-white p-12 rounded-lg">
  <h2 className="text-3xl font-bold mb-4">Experience Recycling in Virtual Reality</h2>
  <p className="mb-6">
    Step into a sustainable world. Explore real-life waste management scenarios, make interactive choices, and see how every small act of recycling contributes to a cleaner, greener future.
</p>
  <Button
  className="bg-white text-green-500 hover:bg-gray-100"
  asChild
>
  <a
    href="https://drive.google.com/drive/folders/1y9uPBRmLJ6R7pgAQvVu0yqBvqBUGjV0L"
    download
    target="_blank"
    rel="noopener noreferrer"
  >
    Download VR Experience (.exe)
  </a>
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
