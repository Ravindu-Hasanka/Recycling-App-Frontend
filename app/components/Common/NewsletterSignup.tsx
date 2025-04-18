'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Please enter your email",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would send this to an API
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });
    
    setEmail('');
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-4">Subscribe to our newsletter</h3>
      <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
        <div className="relative flex-grow">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="email"
            placeholder="Input your email"
            className="pl-10 bg-gray-800 border-gray-700 rounded-l-full rounded-r-none focus:ring-ecoblue-500 focus:border-ecoblue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button 
          type="submit"
          className="bg-ecoblue-500 hover:bg-ecoblue-600 rounded-r-full rounded-l-none"
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
