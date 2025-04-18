
import React from 'react';

type PointsCardProps = {
  points: number;
  description: string;
};

const PointsCard = ({ points, description }: PointsCardProps) => {
  return (
    <div className="text-center group">
      <div className="placeholder-img h-24 w-24 mx-auto mb-4 rounded-lg group-hover:shadow-md transition-all duration-300">
        {/* This would be replaced with gamification badges/icons */}
      </div>
      <div className="font-bold text-xl mb-1">{points} points</div>
      <p className="text-gray-600 text-sm px-4">{description}</p>
    </div>
  );
};

const PointsDisplay = () => {
  const pointLevels = [
    {
      points: 200,
      description: "Awesome! Earn 200 points by completing activities on EcoQuest!"
    },
    {
      points: 500,
      description: "Great! Earn 500 points for more fun on EcoQuest!"
    },
    {
      points: 1000,
      description: "Super! 1000 points have been reached. Kids in a culture prefer the kids in the woods."
    },
    {
      points: 2000,
      description: "Fantastic! 2000 points are on the way. Kids in a culture prefer the kids in the woods."
    }
  ];

  return (
    <section className="eco-section bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12">Gamification Elements</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {pointLevels.map((level, index) => (
          <PointsCard
            key={index}
            points={level.points}
            description={level.description}
          />
        ))}
      </div>
    </section>
  );
};

export default PointsDisplay;
