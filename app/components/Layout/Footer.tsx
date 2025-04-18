
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Linkedin, Youtube } from 'lucide-react';
import NewsletterSignup from '../Common/NewsletterSignup';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <NewsletterSignup />
        
        <div className="mt-10 flex flex-col md:flex-row justify-between items-start">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-8 w-8 text-ecoblue-400" />
              <span className="text-2xl font-bold">EcoKids</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 w-full md:w-auto">
            <div>
              <Link to="/pricing" className="block mb-2 hover:text-ecoblue-300">Pricing</Link>
            </div>
            <div>
              <Link to="/about" className="block mb-2 hover:text-ecoblue-300">About us</Link>
            </div>
            <div>
              <Link to="/features" className="block mb-2 hover:text-ecoblue-300">Features</Link>
            </div>
            <div>
              <Link to="/help" className="block mb-2 hover:text-ecoblue-300">Help Center</Link>
            </div>
            <div>
              <Link to="/contact" className="block mb-2 hover:text-ecoblue-300">Contact us</Link>
              <Link to="/faqs" className="block mb-2 hover:text-ecoblue-300">FAQs</Link>
              <Link to="/careers" className="block mb-2 hover:text-ecoblue-300">Careers</Link>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <select className="bg-gray-800 text-white py-2 px-4 rounded border border-gray-700">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-400">
            © 2024 Brand, Inc. • <Link to="/privacy" className="hover:text-ecoblue-300">Privacy</Link> • 
            <Link to="/terms" className="hover:text-ecoblue-300"> Terms</Link> • 
            <Link to="/sitemap" className="hover:text-ecoblue-300"> Sitemap</Link>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-ecoblue-300">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-ecoblue-300">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-ecoblue-300">
              <Linkedin size={20} />
            </a>
            <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-ecoblue-300">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
