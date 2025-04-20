import React from 'react';
import { Book, Calculator, Palette, Music, FlaskConical, Languages, CheckCircle, Clock } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const completedActivities = [
  {
    name: 'Yoga Session',
    date: 'Oct 15, 2023',
    objective: 'Improve flexibility',
    image: '/images/yoga.jpg'
  },
  {
    name: 'Read Book',
    date: 'Oct 15, 2023',
    objective: 'Enhance knowledge',
    image: '/images/book.jpg'
  },
  {
    name: '5K Run',
    date: 'Oct 15, 2023',
    objective: 'Build endurance',
    image: '/images/run.jpg'
  },
];

const tips = [
  {
    title: 'Reading Skills',
    icon: <Book className="text-ecoblue-500 w-6 h-6" />,
    tips: ['Encourage daily reading', 'Use engaging stories'],
    image: '/images/reading.jpg'
  },
  {
    title: 'Math Practice',
    icon: <Calculator className="text-ecoblue-500 w-6 h-6" />,
    tips: ['Use math games', 'Incorporate real-life tasks'],
    image: '/images/math.jpg'
  },
  {
    title: 'Creative Arts',
    icon: <Palette className="text-ecoblue-500 w-6 h-6" />,
    tips: ['Encourage daily drawing', 'Explore diverse materials'],
    image: '/images/art.jpg'
  },
  {
    title: 'Language Skills',
    icon: <Languages className="text-ecoblue-500 w-6 h-6" />,
    tips: ['Use flashcards', 'Practice word games'],
    image: '/images/language.jpg'
  },
  {
    title: 'Science Exploration',
    icon: <FlaskConical className="text-ecoblue-500 w-6 h-6" />,
    tips: ['Use simple experiments', 'Explore outdoors'],
    image: '/images/science.jpg'
  },
  {
    title: 'Music Practice',
    icon: <Music className="text-ecoblue-500 w-6 h-6" />,
    tips: ['Start with easy songs', 'Use online tutorials'],
    image: '/images/music.jpg'
  }
];

const ParentTools = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Child Progress Tracker</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><CheckCircle className="text-green-500" />Completed Activities: 6</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-100 text-green-800">#6ECF6B - Completed activities</div>
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800">#A6E8A0 - Completed learning unit</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Clock className="text-yellow-500" />Upcoming Activities: 4</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100 text-yellow-800">#FFA500 - Upcoming activities</div>
                <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-800">#FF0000 - Missed activities</div>
              </div>
            </div>
          </div>

          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Completed Activities</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {completedActivities.map((activity) => (
                <div key={activity.name} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <img src={activity.image} alt={activity.name} className="w-full h-40 object-cover" />
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-1 text-gray-800">{activity.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">Completed: {activity.date}</p>
                    <p className="text-sm text-gray-700">Objective: {activity.objective}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Tips for Reinforcement Learning at Home</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {tips.map((subject, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <img src={subject.image} alt={subject.title} className="w-full h-40 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {subject.icon}
                      <h3 className="font-bold text-lg text-gray-800">{subject.title}</h3>
                    </div>
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                      {subject.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                    <button className="mt-4 text-ecoblue-600 font-medium hover:underline">Learn More</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ParentTools;
  