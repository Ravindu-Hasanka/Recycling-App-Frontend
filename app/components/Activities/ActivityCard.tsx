
import React from 'react';
import { Button } from '../ui/button';

type ActivityCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
};

const ActivityCard = ({ title, description, imageUrl }: ActivityCardProps) => {
  return (
    <div className="activity-card">
      <div className="placeholder-img h-40">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Button className="w-full bg-ecoblue-500 hover:bg-ecoblue-600">
          Start Activity
        </Button>
      </div>
    </div>
  );
};

export default ActivityCard;
