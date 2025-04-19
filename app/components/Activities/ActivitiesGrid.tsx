import React from 'react';
import ActivityCard from './ActivityCard';

const ActivitiesGrid = () => {
  const activities = [
    {
      title: "Eco Crafts",
      description: "Create fun items with old jars and paper.",
      imageUrl: "/images/eco-crafts.jpg"
    },
    {
      title: "Tree Planting",
      description: "Learn how planting trees helps reduce waste.",
      imageUrl: "/images/tree-planting.jpg"
    },
    {
      title: "Bird Feeder",
      description: "Make a bird feeder using old plastic bottles.",
      imageUrl: "/images/bird-feeder.jpg"
    },
    {
      title: "Sorting Game",
      description: "Learn to sort waste into the right bins.",
      imageUrl: "/images/sorting-game.jpg"
    },
    {
      title: "Cardboard Art",
      description: "Turn old cardboard into creative artwork.",
      imageUrl: "/images/cardboard-art.jpg"
    },
    {
      title: "DIY Compost",
      description: "Build a miniature bin and learn composting.",
      imageUrl: "/images/diy-compost.jpg"
    }
  ];

  return (
    <section className="eco-section py-16 px-4">
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
