'use client'

import React from 'react';
import Link from 'next/link';;
import { Play } from 'lucide-react';
import {Button} from "@/app/components/ui/button";

const Hero = () => {
  return (
    <section className="py-12 md:py-20 text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to EcoKids!</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Explore Fun Learning for Your Little Ones!
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Button
          size="lg"
          className="bg-ecoblue-500 hover:bg-ecoblue-600"
          asChild
        >
          <Link href="/signup">Join us now</Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-ecoblue-500 text-ecoblue-500 hover:bg-ecoblue-50"
          asChild
        >
          <Link href="/demo">Request demo</Link>
        </Button>
      </div>

      <div className="relative max-w-4xl mx-auto aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <Button variant="outline" size="icon" className="rounded-full bg-white w-16 h-16 absolute">
          <Play className="h-8 w-8 text-ecoblue-500" />
        </Button>
      </div>
    </section>
  );
};

export default Hero;
