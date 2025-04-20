'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';

const Navbar = () => {
  return (
      <nav className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <Link href="/" className="text-2xl font-bold text-gray-800">EcoKids</Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-500 transition-colors">Home</Link>
            <Link href="/learn" className="text-gray-700 hover:text-blue-500 transition-colors">Learn</Link>
            <Link href="/paths" className="text-gray-700 hover:text-blue-500 transition-colors">Paths</Link>
            <Link href="/parent-tools" className="text-gray-700 hover:text-blue-500 transition-colors">Parent Tools</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-500 transition-colors">About</Link>
          </div>

          <div>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <span className="mr-2">?</span> Help
            </Button>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;
