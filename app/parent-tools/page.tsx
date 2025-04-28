'use client'

import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Leaf, Recycle, Clock, Trophy, Zap, Calendar, Info } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const progressData = [
  { week: 'Week 1', points: 40 },
  { week: 'Week 2', points: 65 },
  { week: 'Week 3', points: 85 },
  { week: 'Week 4', points: 120 },
];

const wasteTypeData = [
  { name: 'Plastic', value: 45 },
  { name: 'Paper', value: 30 },
  { name: 'Glass', value: 15 },
  { name: 'Metal', value: 10 },
];

const colors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c'];

const completedActivities = [
  {
    name: 'Plastic Sorting Game',
    date: 'Oct 15, 2023',
    accuracy: '92%',
    points: 50,
    image: '/images/sort-trash.jpg'
  },
  {
    name: 'Recycle Quiz',
    date: 'Oct 14, 2023',
    accuracy: '85%',
    points: 30,
    image: '/images/recycling-quiz.jpg'
  },
  {
    name: 'Trash or Not',
    date: 'Oct 13, 2023',
    accuracy: '100%',
    points: 20,
    image: '/images/trash-or-not.jpg'
  },
];

const upcomingActivities = [
  { name: 'Composting Tutorial', date: 'Oct 16, 2023' },
  { name: 'Community Challenge', date: 'Oct 17, 2023' },
  { name: 'Waste Audit', date: 'Oct 18, 2023' },
];

const recyclingTips = [
  {
    title: 'Plastic Recycling',
    icon: <Recycle className="text-ecoblue-500 w-6 h-6" />,
    tips: ['Sort by resin codes', 'Rinse containers first', 'Remove non-recyclable parts'],
    image: '/images/plastic-tips.jpg'
  },
  {
    title: 'Paper Waste',
    icon: <Leaf className="text-ecoblue-500 w-6 h-6" />,
    tips: ['Flatten boxes', 'Remove staples', 'Keep dry and clean'],
    image: '/images/paper-tips.jpg'
  },
  {
    title: 'Composting',
    icon: <Zap className="text-ecoblue-500 w-6 h-6" />,
    tips: ['Balance greens/browns', 'Turn weekly', 'Avoid meats/dairy'],
    image: '/images/compost-tips.jpg'
  },
];

const ParentTools = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-black">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Recycling Progress Dashboard</h1>

          {/* Progress Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Trophy className="text-emerald-600 w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Points</p>
                  <p className="text-3xl font-bold text-gray-800">1,240</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Leaf className="text-blue-600 w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Items Recycled</p>
                  <p className="text-3xl font-bold text-gray-800">356</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Calendar className="text-amber-600 w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Day Streak</p>
                  <p className="text-3xl font-bold text-gray-800">14 Days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Charts Section */}
          <section className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Recycle className="text-ecoblue-500" /> Weekly Progress
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="points" 
                      stroke="#2ecc71" 
                      strokeWidth={2}
                      dot={{ fill: '#2ecc71' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Leaf className="text-ecoblue-500" /> Waste Type Distribution
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={wasteTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {wasteTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Completed Activities */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Achievements</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {completedActivities.map((activity) => (
                <div key={activity.name} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <img src={activity.image} alt={activity.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-800">{activity.name}</h3>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Accuracy: {activity.accuracy}</span>
                      <span>{activity.points} pts</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Completed: {activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Activities & Tips */}
          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Upcoming Challenges</h2>
              <div className="bg-white rounded-xl shadow-sm p-6">
                {upcomingActivities.map((activity, index) => (
                  <div key={index} className="py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-4">
                      <Clock className="text-gray-400 w-5 h-5" />
                      <div>
                        <p className="font-medium text-gray-800">{activity.name}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Recycling Tips</h2>
              <div className="grid gap-4">
                {recyclingTips.map((tip, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <div className="flex items-start gap-4">
                      {tip.icon}
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">{tip.title}</h3>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                          {tip.tips.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ParentTools;