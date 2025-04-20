import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { Button } from '../components/ui/button';

const Paths = () => {
  const topics = [
    {
      name: 'Plastic',
      img: '/images/plastic.png', 
    },
    {
      name: 'Glass',
      img: '/images/glass.png', 
    },
    {
      name: 'Paper',
      img: '/images/paper.png', 
    },
    {
      name: 'Electronics',
      img: '/images/electronics.png', 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gray-400 h-80 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Select Your Interests</h1>
            <p className="text-xl text-white mb-8">Discover fun ways to learn about recycling and make a difference!</p>
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
              Get Started
            </Button>
          </div>
        </div>

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Choose Topics</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {topics.map(({ name, img }) => (
                <div
                  key={name}
                  className="aspect-square bg-white rounded-lg shadow-md flex flex-col items-center justify-end p-4 border hover:shadow-lg transition"
                >
                  <img
                    src={img}
                    alt={name}
                    className="w-16 h-16 object-contain mb-4"
                  />
                  <p className="font-medium text-blue-600">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Personalized Path Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-black">Your Personalized Learning Path</h2>
            <p className="text-center max-w-3xl mx-auto mb-12 text-gray-500">
              By selecting topics that interest you, we can create a unique and engaging educational experience tailored to your preferences. As we build the learning path through various subjects, including Global Citizen with Gino and Julie.
            </p>

            <div className=" mx-auto bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="/images/learning-path.jpg" 
                alt="Learning Path"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Paths;
