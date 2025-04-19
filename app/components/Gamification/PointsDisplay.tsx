
import React from 'react';

type PointsCardProps = {
  points: number;
  description: string;
  imageUrl?: string; 
};

const PointsCard = ({ points, description, imageUrl }: PointsCardProps) => {
  return (
    <div className="text-center group">
      <div className="h-24 w-24 mx-auto mb-4 rounded-lg overflow-hidden group-hover:shadow-md transition-all duration-300">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={`${points} points badge`} 
            className="w-full h-full object-contain" 
          />
        )}
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
      description: "Awesome! Earn 200 points by completing activities on EcoQuest!",
      imageUrl: "/images/points-200.png"
    },
    {
      points: 500,
      description: "Great! Earn 500 points for more fun on EcoQuest!",
      imageUrl: "/images/points-500.png"
    },
    {
      points: 1000,
      description: "Super! 1000 points have been reached. Explore more adventures!",
      imageUrl: "/images/points-1000.png"
    },
    {
      points: 2000,
      description: "Fantastic! 2000 points unlocked – you're a true eco-hero!",
      imageUrl: "/images/points-2000.png"
    }
  ];
  

  return (
    <section className="eco-section py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Gamification Elements</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {pointLevels.map((level, index) => (
          <PointsCard
            key={index}
            points={level.points}
            description={level.description}
            imageUrl={level.imageUrl} 
          />
        ))}
      </div>
    </section>
  );
};

export default PointsDisplay;
