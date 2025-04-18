'use client'

import React from 'react';
import { Button } from '../ui/button';
import Link from "next/link";

const FeaturedSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-ecoblue-500 text-white p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Explore EcoKids Today</h2>
            <p className="mb-6">
              Discover an app designed to inspire young minds with engaging educational content, eco-friendly activities, and fun challenges. Empower your kids to learn while caring for the planet.
            </p>
            <Button 
              className="bg-white text-ecoblue-500 hover:bg-gray-100" 
              asChild
            >
              <Link href="/signup">Join for Free</Link>
            </Button>
          </div>
          <div className="placeholder-img rounded-lg min-h-[300px]">
            {/* Placeholder for image */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
