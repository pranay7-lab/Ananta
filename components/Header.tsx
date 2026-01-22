import React from 'react';
import { RefreshCw, Flower, Book, MessageCircle, LogOut } from 'lucide-react';
import { AppView, User } from '../types';

interface HeaderProps {
  onReset: () => void;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, currentView, onViewChange, user, onLogout }) => {
  return (
    <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-sand-500">
              <Flower size={24} strokeWidth={1.5} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-serif font-medium text-sand-100 tracking-wide">Ananta</h1>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex bg-stone-900 rounded-lg p-1 ml-2 sm:ml-6 border border-stone-800">
            <button
              onClick={() => onViewChange('chat')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                currentView === 'chat'
                  ? 'bg-sand-700 text-stone-50 shadow-sm'
                  : 'text-stone-500 hover:text-sand-300'
              }`}
            >
              <MessageCircle size={16} />
              <span className="font-medium">Chat</span>
            </button>
            <button
              onClick={() => onViewChange('journal')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                currentView === 'journal'
                  ? 'bg-sand-700 text-stone-50 shadow-sm'
                  : 'text-stone-500 hover:text-sand-300'
              }`}
            >
              <Book size={16} />
              <span className="font-medium">Journal</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden md:flex flex-col items-end mr-2">
             <span className="text-xs text-stone-500 uppercase tracking-widest">Welcome</span>
             <span className="text-sm text-sand-200 font-medium">{user.username}</span>
           </div>

          {currentView === 'chat' && (
            <button 
              onClick={onReset}
              className="p-2 text-stone-500 hover:text-sand-400 hover:bg-stone-900 rounded-full transition-colors duration-200"
              title="Start New Session"
            >
              <RefreshCw size={18} />
            </button>
          )}
          
          <button 
            onClick={onLogout}
            className="p-2 text-stone-500 hover:text-red-400 hover:bg-stone-900 rounded-full transition-colors duration-200"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;