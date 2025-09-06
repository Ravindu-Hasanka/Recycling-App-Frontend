'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

interface Activity {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  numberOfStages: number;
  active: boolean;
}

export interface ProgressResponse {
  id: string;
  userId: string;
  storyId: string;
  currentStage: number;
  marks: number[];
  status: string;
  lastPlayed: string;
}

const Learn = () => {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem('role') !== 'STUDENT') {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-blue-600">
            Start Your Recycling Adventure!
          </h1>
          <p className="text-xl text-center text-gray-700 mb-12">
            Join EcoKids and make recycling fun and impactful!
          </p>

          <ActivitiesGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ActivitiesGrid = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startingActivity, setStartingActivity] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:8085/api/stories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          // Token is invalid, redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('userid');
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }

        const data: Activity[] = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [router]);

  const handleStartLearning = async (activityId: string, activityLink: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    setStartingActivity(activityId);

    try {
      // First request: Start the activity
      const startResponse = await fetch(`http://localhost:8085/api/progress/start/${activityId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (startResponse.status === 401) {
        // Token is invalid, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('userid');
        router.push('/login');
        return;
      }

      if (!startResponse.ok) {
        throw new Error('Failed to start activity');
      }

      const progressData: ProgressResponse = await startResponse.json();
      console.log('Activity started:', progressData);

      // Second request: Update progress with hardcoded score
      const updateResponse = await fetch('http://localhost:8085/api/progress/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          storyId: activityId,
          score: 10 // Hardcoded score
        })
      });

      if (updateResponse.status === 401) {
        // Token is invalid, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('userid');
        router.push('/login');
        return;
      }

      if (!updateResponse.ok) {
        throw new Error('Failed to update activity progress');
      }

      const updatedProgressData: ProgressResponse = await updateResponse.json();
      console.log('Activity progress updated:', updatedProgressData);

      // Navigate to the activity page
      router.push(activityLink);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error starting/updating activity:', err);
    } finally {
      setStartingActivity(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading activities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Learning Activities
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
          >
            <div className="h-48 bg-gray-100">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-xl mb-2 text-gray-800">
                {activity.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {activity.description || 'Learn about recycling through fun, interactive lessons and hands-on activities.'}
              </p>
              <button
                onClick={() => handleStartLearning(activity.id, activity.link)}
                disabled={startingActivity === activity.id}
                className={`w-full py-2 rounded transition ${startingActivity === activity.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
              >
                {startingActivity === activity.id ? 'Starting...' : 'Start Learning'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Learn;