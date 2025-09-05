'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Leaf, Recycle, Clock, Trophy, Zap, Calendar, ChevronDown, X, Plus } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const colors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c'];

interface UpcomingActivity {
  name: string;
  date: string;
}

interface RecyclingTip {
  title: string;
  icon: React.ReactElement;
  tips: string[];
}

interface Child {
  id: string;
  name: string;
  // Add other child properties as needed
}

interface Story {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  numberOfStages: number;
  active: boolean;
}

interface ProgressItem {
  id: string;
  userId: string;
  storyId: string;
  currentStage: number;
  marks: number[];
  status: string;
  lastPlayed: string;
}

interface ProgressStats {
  totalPoints: number;
  itemsRecycled: number;
  dayStreak: number;
}

interface ProgressDataPoint {
  week: string;
  points: number;
}

interface WasteTypeDataPoint {
  name: string;
  value: number;
}

interface CompletedActivity {
  name: string;
  date: string;
  accuracy: string;
  points: number;
  image: string;
}

interface ProgressData {
  stats: ProgressStats;
  progressData: ProgressDataPoint[];
  wasteTypeData: WasteTypeDataPoint[];
  completedActivities: CompletedActivity[];
}

const upcomingActivities: UpcomingActivity[] = [
  { name: 'Composting Tutorial', date: 'Oct 16, 2023' },
  { name: 'Community Challenge', date: 'Oct 17, 2023' },
  { name: 'Waste Audit', date: 'Oct 18, 2023' },
];

const ParentTools = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [showAddChildModal, setShowAddChildModal] = useState<boolean>(false);
  const [newChildName, setNewChildName] = useState<string>('');
  const [newChildUsername, setNewChildUsername] = useState<string>('');
  const [newChildEmail, setNewChildEmail] = useState<string>('');
  const [newChildPassword, setNewChildPassword] = useState<string>('');
  const [stories, setStories] = useState<Story[]>([]);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const parentId = localStorage.getItem('userid');
    
    if (!token || !parentId) {
      router.push('/login');
    }
  }, [router]);

  const parentId = localStorage.getItem('userid');
  const token = localStorage.getItem('authToken');
  
  useEffect(() => {
    if (!token || !parentId) return;
    
    fetchChildren();
    fetchStories();
  }, [token, parentId]);

  const fetchChildren = async () => {
    try {
      const response = await fetch(
        `http://localhost:8085/api/auth/parent/children?parentId=${parentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 401) {
        // Token is invalid, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('userid');
        router.push('/login');
        return;
      }
      
      const childrenData: Child[] = await response.json();
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
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
      
      const storiesData: Story[] = await response.json();
      setStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  useEffect(() => {
    if (!selectedChild || !token || stories.length === 0) return;

    const fetchChildProgress = async () => {
      try {
        const response = await fetch(
          `http://localhost:8085/api/progress/child/${selectedChild.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.status === 401) {
          // Token is invalid, redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('userid');
          router.push('/login');
          return;
        }
        
        const progressData: ProgressItem[] = await response.json();
        
        // Map progress data to story details
        const completedActivities = progressData
          .filter(item => item.marks && item.marks.length > 0) // Only include completed activities
          .map((item, index) => {
            const story = stories.find(s => s.id === item.storyId);
            return {
              name: story ? story.title : `Activity ${index + 1}`,
              date: new Date(item.lastPlayed).toLocaleDateString(),
              accuracy: `${item.marks[item.marks.length - 1] || 0}%`,
              points: item.marks.reduce((sum, mark) => sum + mark, 0),
              image: story ? story.image : `https://placehold.co/600x400/${colors[index]}/ffffff?text=Activity`
            };
          });

        const transformedData: ProgressData = {
          stats: {
            totalPoints: progressData.reduce((total: number, item: ProgressItem) => 
              total + (item.marks?.reduce((sum, mark) => sum + mark, 0) || 0), 0),
            itemsRecycled: progressData.length * 10,
            dayStreak: Math.floor(progressData.length / 2) 
          },
          progressData: [
            { week: 'Week 1', points: progressData[0]?.marks?.reduce((sum, mark) => sum + mark, 0) || 0 },
            { week: 'Week 2', points: progressData[1]?.marks?.reduce((sum, mark) => sum + mark, 0) || 0 },
          ],
          wasteTypeData: [
            { name: 'Plastic', value: 45 },
            { name: 'Paper', value: 30 },
            { name: 'Glass', value: 15 },
            { name: 'Metal', value: 10 },
          ],
          completedActivities
        };

        setProgressData(transformedData);
      } catch (error) {
        console.error('Error fetching child progress:', error);
      }
    };

    fetchChildProgress();
  }, [selectedChild, token, router, stories]);

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8085/api/auth/parent/add-child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: newChildUsername,
          password: newChildPassword,
          name: newChildName,
          email: newChildEmail,
          role: "STUDENT",
          parentId: parentId
        })
      });

      if (response.status === 401) {
        // Token is invalid, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('userid');
        router.push('/login');
        return;
      }

      if (response.ok) {
        setNewChildName('');
        setNewChildUsername('');
        setNewChildEmail('');
        setNewChildPassword('');
        setShowAddChildModal(false);
        fetchChildren(); // Refresh the children list
      } else {
        console.error('Failed to add child');
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error adding child:', error);
    }
  };

  const recyclingTips: RecyclingTip[] = [
    {
      title: 'Plastic Recycling',
      icon: <Recycle className="text-blue-500 w-6 h-6" />,
      tips: ['Sort by resin codes', 'Rinse containers first', 'Remove non-recyclable parts'],
    },
    {
      title: 'Paper Waste',
      icon: <Leaf className="text-green-500 w-6 h-6" />,
      tips: ['Flatten boxes', 'Remove staples', 'Keep dry and clean'],
    },
    {
      title: 'Composting',
      icon: <Zap className="text-yellow-500 w-6 h-6" />,
      tips: ['Balance greens/browns', 'Turn weekly', 'Avoid meats/dairy'],
    },
  ];

  // Check if user is logged in before rendering
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    const parentId = localStorage.getItem('userid');
    
    if (!token || !parentId) {
      return null; // or a loading spinner, the useEffect will redirect
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-black">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full md:w-48 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span>{selectedChild?.name || 'Select Child'}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full md:w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <ul className="py-1">
                      {children.map((child) => (
                        <li
                          key={child.id}
                          onClick={() => {
                            setSelectedChild(child);
                            setIsDropdownOpen(false);
                          }}
                          className="px-4 py-2 text-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          {child.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowAddChildModal(true)}
                className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="w-5 h-5" />
                Add Child
              </button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">Recycling Progress Dashboard</h1>
          </div>

          {!selectedChild ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No child selected. Please add a child to view progress.</p>
            </div>
          ) : !progressData ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading progress data...</p>
            </div>
          ) : (
            <>
              {/* Progress Overview Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <Trophy className="text-emerald-600 w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Points</p>
                      <p className="text-3xl font-bold text-gray-800">{progressData.stats.totalPoints.toLocaleString()}</p>
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
                      <p className="text-3xl font-bold text-gray-800">{progressData.stats.itemsRecycled}</p>
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
                      <p className="text-3xl font-bold text-gray-800">{progressData.stats.dayStreak} Days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Charts Section */}
              <section className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
                    <Recycle className="text-green-500" /> Weekly Progress
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData.progressData}>
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
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
                    <Leaf className="text-green-500" /> Waste Type Distribution
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={progressData.wasteTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {progressData.wasteTypeData.map((entry, index) => (
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
                  {progressData.completedActivities.map((activity, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
                      <img src={activity.image} alt={activity.name} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 text-gray-800">{activity.name}</h3>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Accuracy: {activity.accuracy}</span>
                          <span className="font-semibold text-green-600">{activity.points} pts</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Completed: {activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

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
              <div className="space-y-4">
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

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Add New Child</h2>
              <button
                onClick={() => setShowAddChildModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddChild}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Child's Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={newChildUsername}
                  onChange={(e) => setNewChildUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={newChildEmail}
                  onChange={(e) => setNewChildEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={newChildPassword}
                  onChange={(e) => setNewChildPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddChildModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Child
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ParentTools;