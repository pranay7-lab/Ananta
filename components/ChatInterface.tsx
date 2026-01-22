import React, { useRef, useEffect } from 'react';
import { Message, ChatStatus } from '../types';
import ChatMessageItem from './ChatMessageItem';
import TypingIndicator from './TypingIndicator';
import { SUGGESTED_PROMPTS } from '../constants';

interface ChatInterfaceProps {
  messages: Message[];
  status: ChatStatus;
  onSendMessage: (text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, status, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-2 scroll-smooth">
      <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-start">
        
        {messages.length === 0 && (
           <div className="flex-1 flex flex-col items-center justify-center opacity-80 mt-10 md:mt-0">
             <div className="text-sand-500 mb-6">
                <SparklesIconLarge />
             </div>
             <p className="text-center text-sand-300 font-serif italic mb-8 max-w-md">
               "Your heart knows the way. Run in that direction." <br/> <span className="text-sm not-italic mt-2 block text-sand-500">— Rumi</span>
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(prompt)}
                    className="p-3 text-sm text-left bg-stone-900 border border-stone-800 hover:border-sand-600 hover:bg-stone-800 text-sand-200 rounded-lg transition-all duration-300"
                  >
                    {prompt}
                  </button>
                ))}
             </div>
           </div>
        )}

        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}

        {status === 'waiting' && (
          <div className="flex w-full mb-6 justify-start animate-fade-in">
             <div className="flex max-w-[75%] gap-4 flex-row">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-800 text-sand-400 border border-stone-700 flex items-center justify-center mt-1">
                 <SparklesIconSmall />
               </div>
               <div className="bg-stone-850 border border-stone-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center">
                  <TypingIndicator />
               </div>
             </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

// Simple icons for local usage
const SparklesIconLarge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const SparklesIconSmall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

export default ChatInterface;