import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface CopyButtonProps {
  text: string;
  className?: string;
  children: React.ReactNode;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, className = '', children }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (): Promise<void> => {
    if (copied) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('URL copied to clipboard!', {
        icon: '📋',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy URL');
      setCopied(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCopy();
    }
  };

  return (
    <button
      onClick={handleCopy}
      onKeyDown={handleKeyDown}
      disabled={copied}
      aria-label={copied ? 'URL copied to clipboard' : 'Copy URL to clipboard'}
      aria-live="polite"
      className={`${className} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        copied 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      } disabled:opacity-75 disabled:cursor-not-allowed`}
    >
      {copied ? (
        <span className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default CopyButton;
