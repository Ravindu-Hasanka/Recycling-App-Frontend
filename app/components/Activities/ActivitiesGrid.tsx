
import React from 'react';
import ActivityCard from './ActivityCard';

const ActivitiesGrid = () => {
  const activities = [
    {
      title: "Eco Crafts",
      description: "Create fun items with old jars and paper.",
      imageUrl: ""
    },
    {
      title: "Tree Planting",
      description: "Learn how planting trees helps reduce waste.",
      imageUrl: ""
    },
    {
      title: "Bird Feeder",
      description: "Make a bird feeder using old plastic bottles.",
      imageUrl: ""
    },
    {
      title: "Sorting Game",
      description: "Learn to sort waste into the right bins.",
      imageUrl: ""
    },
    {
      title: "Cardboard Art",
      description: "Turn old cardboard into creative artwork.",
      imageUrl: ""
    },
    {
      title: "DIY Compost",
      description: "Build a miniature bin and learn composting.",
      imageUrl: ""
    }
  ];

  return (
    <section className="eco-section">
      <h2 className="text-3xl font-bold text-center mb-10">Choose Your Fun Activity</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {activities.map((activity, index) => (
          <ActivityCard
            key={index}
            title={activity.title}
            description={activity.description}
            imageUrl={activity.imageUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default ActivitiesGrid;
