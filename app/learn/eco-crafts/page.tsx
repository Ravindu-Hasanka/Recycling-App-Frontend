'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const EcoCraftsPage = () => {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">🎨 Eco Crafts Adventure!</h1>
        <p className="text-lg text-gray-700 mb-6">Let’s turn trash into treasure. Ready to craft something cool?</p>

        <img
          src="/images/eco-crafts.jpg"
          alt="Eco Crafts"
          className="rounded-lg shadow-xl mx-auto mb-8 w-full max-w-lg border-4 border-white"
        />

        <div className="bg-white rounded-xl shadow p-6 text-left mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">🧺 What You’ll Need</h2>
          <ul className="space-y-2 text-gray-800 text-lg">
            <li>📰 Old newspaper or colored paper</li>
            <li>🫙 Empty jars or plastic bottles</li>
            <li>✂️ Scissors (with an adult's help!)</li>
            <li>🎨 Crayons, glue, stickers, and your imagination!</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-xl shadow p-6 text-left mb-6 border border-yellow-200">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-700">👣 Let’s Do It!</h2>
          <ol className="space-y-3 text-gray-700 text-lg">
            <li><span className="font-bold">Step 1:</span> Grab your old jar or bottle 🫙</li>
            <li><span className="font-bold">Step 2:</span> Decorate with paper, glue, and crayons 🎨</li>
            <li><span className="font-bold">Step 3:</span> Add googly eyes or stickers to make it fun! 👀✨</li>
            <li><span className="font-bold">Step 4:</span> Show it off to your friends and family! 📸</li>
          </ol>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowTip(!showTip)}
            className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition"
          >
            🌟 Tap for a Crafty Tip!
          </button>

          {showTip && (
            <div className="mt-4 bg-white text-green-700 text-lg p-4 rounded shadow-lg max-w-md mx-auto">
              🧠 <strong>Fun Tip:</strong> Turn bottle caps into robot eyes or wheels for a toy car!
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link href="/learn">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition">
              ⬅️ Back to Activities
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EcoCraftsPage;
