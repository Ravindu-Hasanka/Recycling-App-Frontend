'use client';

import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import Link from 'next/link';

const Learn = () => {
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
    const activities = [
      {
        title: "Clean The Park",
        imageUrl: "/images/clean-the-park.jpg",
        link: "/learn/clean-the-park",
      },
      {
        title: "Recycling Quiz",
        imageUrl: "/images/recycling-quiz.jpg",
        link: "/learn/recycling-quiz",
      },
      {
        title: "Trash Or Not",
        imageUrl: "/images/trash-or-not.jpg",
        link: "/learn/trash-or-not",
      },
      {
        title: "Sort Trash",
        imageUrl: "/images/sort-trash.jpg",
        link: "/learn/sort-trash",
      },
    ];
  
    return (
      <section>
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Learning Activities
        </h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-48 bg-gray-100">
                <img
                  src={activity.imageUrl}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              </div>
  
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2 text-gray-800">
                  {activity.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn about recycling through fun, interactive lessons and hands-on activities.
                </p>
                <Link href={activity.link}>
                  <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                    Start Learning
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

export default Learn;
