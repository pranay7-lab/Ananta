import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { Flower, ArrowRight } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (isRegistering) {
      const result = authService.register(username, password);
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.message || 'Registration failed');
      }
    } else {
      const result = authService.login(username, password);
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.message || 'Login failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-stone-900 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-stone-800 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md bg-stone-900/50 backdrop-blur-md border border-stone-800 p-8 rounded-2xl shadow-2xl relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="text-sand-500 mb-3">
            <Flower size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-serif font-medium text-sand-100 tracking-wide">Ananta</h1>
          <p className="text-sm text-stone-500 font-sans tracking-wider uppercase mt-1">Wisdom Guide</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-sand-100 focus:outline-none focus:border-sand-700 focus:ring-1 focus:ring-sand-700/50 transition-all placeholder-stone-700"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-sand-100 focus:outline-none focus:border-sand-700 focus:ring-1 focus:ring-sand-700/50 transition-all placeholder-stone-700"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-950/30 border border-red-900/50 p-2 rounded text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-sand-700 hover:bg-sand-600 text-stone-50 font-medium py-3 rounded-lg transition-all shadow-lg hover:shadow-sand-900/20 flex items-center justify-center gap-2 mt-2"
          >
            {isRegistering ? 'Create Account' : 'Begin Journey'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-stone-500 text-sm">
            {isRegistering ? 'Already have an account?' : 'First time here?'}
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="ml-2 text-sand-500 hover:text-sand-400 font-medium underline-offset-4 hover:underline transition-colors"
            >
              {isRegistering ? 'Login' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;