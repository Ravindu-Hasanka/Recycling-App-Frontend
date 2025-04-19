import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { MessageSquare } from 'lucide-react';
import NewsletterSignup from '../Common/NewsletterSignup';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <NewsletterSignup />

        <div className="mt-10 flex flex-col md:flex-row justify-between items-start">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">EcoKids</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 w-full md:w-auto">
            <div>
              <Link href="/pricing" className="block mb-2 hover:text-blue-300">Pricing</Link>
            </div>
            <div>
              <Link href="/about" className="block mb-2 hover:text-blue-300">About us</Link>
            </div>
            <div>
              <Link href="/features" className="block mb-2 hover:text-blue-300">Features</Link>
            </div>
            <div>
              <Link href="/help" className="block mb-2 hover:text-blue-300">Help Center</Link>
            </div>
            <div>
              <Link href="/contact" className="block mb-2 hover:text-blue-300">Contact us</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">

          <div className="text-sm text-gray-400">
            © 2024 Brand, Inc. • <Link href="/privacy" className="hover:text-blue-300">Privacy</Link> • 
            <Link href="/terms" className="hover:text-blue-300"> Terms</Link> • 
            <Link href="/sitemap" className="hover:text-blue-300"> Sitemap</Link>
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-blue-300">
              <FaInstagram size={20} />
            </a>
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-300">
              <FaFacebookF size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-300">
              <FaLinkedinIn size={20} />
            </a>
            <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-blue-300">
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
