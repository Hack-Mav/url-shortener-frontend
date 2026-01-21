import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-purple-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} URL Shortener Service. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
