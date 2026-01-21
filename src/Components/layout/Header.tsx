import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-purple-600 text-white shadow-lg" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center py-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">
            URL Shortener Service
          </h1>
          <nav role="navigation" aria-label="Main navigation">
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/" 
                  className="text-white hover:text-purple-200 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded px-2 py-1"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/bulk" 
                  className="text-white hover:text-purple-200 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded px-2 py-1"
                >
                  Bulk Shortener
                </Link>
              </li>
              <li>
                <Link 
                  to="/history" 
                  className="text-white hover:text-purple-200 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded px-2 py-1"
                >
                  History
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
