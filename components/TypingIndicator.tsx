import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1 items-center p-2 h-6">
      <div className="w-2 h-2 bg-sand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-sand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-sand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

export default TypingIndicator;