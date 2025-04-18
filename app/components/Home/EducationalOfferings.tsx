'use client'

import React from 'react';

type OfferingCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
};

const OfferingCard = ({ title, description, imageUrl }: OfferingCardProps) => {
  return (
    <div className="group">
      <div className="placeholder-img h-48 mb-4 overflow-hidden rounded-lg group-hover:shadow-md transition-all duration-300">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : null}
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

const EducationalOfferings = () => {
  const offerings = [
    {
      title: "Nature Walks",
      description: "Discover the wonders of nature through guided exploration."
    },
    {
      title: "Science Explorers",
      description: "Engage in hands-on experiments to spark curiosity."
    },
    {
      title: "Green Gardening",
      description: "Learn the art of gardening and the importance of green spaces."
    },
    {
      title: "Storytime Adventures",
      description: "Foster a love for reading with our curated book sessions."
    },
    {
      title: "Creative Arts",
      description: "Express creativity through art and craft workshops."
    },
    {
      title: "Mindful Yoga",
      description: "Promote mindfulness and health with our yoga sessions.",
      imageUrl: "/lovable-uploads/a1fffe79-b912-48ee-a9d8-0683c05da6ad.png"
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Educational Offerings</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {offerings.map((offering, index) => (
            <OfferingCard 
              key={index}
              title={offering.title}
              description={offering.description}
              imageUrl={offering.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationalOfferings;
