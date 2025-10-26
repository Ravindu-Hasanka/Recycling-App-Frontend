'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('authToken');
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userid');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <nav className="bg-white py-4 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <Link href="/" className="text-2xl font-bold text-gray-800">EcoKids</Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-500 transition-colors">Home</Link>
          <Link href="/story" className="text-gray-700 hover:text-blue-500 transition-colors">Eco Story</Link>
          {role === 'STUDENT' && (
            <Link href="/learn" className="text-gray-700 hover:text-blue-500 transition-colors">Learn</Link>
          )}
          <Link href="/paths" className="text-gray-700 hover:text-blue-500 transition-colors">Paths</Link>
          {role === 'PARENT' && (
            <Link href="/parent-tools" className="text-gray-700 hover:text-blue-500 transition-colors">Parent Tools</Link>
          )}
          <Link href="/about" className="text-gray-700 hover:text-blue-500 transition-colors">About</Link>
        </div>

        <div className="flex items-center">
          <Button className="bg-blue-500 hover:bg-blue-600">
            <span className="mr-2">?</span> Help
          </Button>

          {role ? (
            <Button
              className="bg-red-500 hover:bg-red-600 text-white ml-4"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              className="bg-green-500 hover:bg-green-600 text-white ml-4"
              onClick={handleLogin}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
