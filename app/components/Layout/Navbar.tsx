'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

type AgeGroup = '1' | '2' | '3';
type DifficultyLevel = 1 | 2 | 3;

const Navbar: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  const loadQuizSettings = (): { ageGroup: AgeGroup | null; level: DifficultyLevel | null } => {
    if (typeof window !== 'undefined') {
      try {
        const settings = localStorage.getItem('recyclingQuizSettings');
        if (settings) {
          const { ageGroup, level } = JSON.parse(settings);
          if (['1', '2', '3'].includes(ageGroup) && [1, 2, 3].includes(level)) {
            return { ageGroup, level };
          }
        }
      } catch (error) {
        console.error('Error loading quiz settings from localStorage:', error);
      }
    }
    return { ageGroup: null, level: null };
  };

  useEffect(() => {
    // const storedRole = localStorage.getItem('authToken');
    // setRole(storedRole);

    const role = localStorage.getItem('role');
    setRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userid');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('recyclingQuizSettings');
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  console.log(role)

  return (
    <nav className="bg-white py-4 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <Link href="/" className="text-2xl font-bold text-gray-800">EcoKids</Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-500 transition-colors">Home</Link>
          {
            role === 'PARENT' && (
              <Link href="/story" className="text-gray-700 hover:text-blue-500 transition-colors">
                Eco Story
              </Link>
            )
          }

          {
            role === 'STUDENT' && (loadQuizSettings().ageGroup === '1' || loadQuizSettings().ageGroup === null) && (
              <Link href="/story/animation/5" className="text-gray-700 hover:text-blue-500 transition-colors">
                Eco Story
              </Link>
            )
          }

          {
            role === 'STUDENT' && loadQuizSettings().ageGroup === '2' && (
              <Link href="/story/animation/5" className="text-gray-700 hover:text-blue-500 transition-colors">
                Eco Story
              </Link>
            )
          }

          {
            role === 'STUDENT' && loadQuizSettings().ageGroup === '3' && (
              <Link href="/story/animation/9" className="text-gray-700 hover:text-blue-500 transition-colors">
                Eco Story
              </Link>
            )
          }
          {/* {role === 'STUDENT' && (
            <Link href="/learn" className="text-gray-700 hover:text-blue-500 transition-colors">Learn</Link>
          )} */}
          {role === 'STUDENT' && (
            <Link href="/day1" className="text-gray-700 hover:text-blue-500 transition-colors">Course</Link>
          )}
          <Link href="/paths/eco-bot" className="text-gray-700 hover:text-blue-500 transition-colors">Eco Hero</Link>
          {role === 'PARENT' && (
            <Link href="/parent-tools" className="text-gray-700 hover:text-blue-500 transition-colors">Parent Tools</Link>
          )}
          {/* <Link href="/about" className="text-gray-700 hover:text-blue-500 transition-colors">About</Link> */}
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
