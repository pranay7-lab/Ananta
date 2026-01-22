import React, { useState, useEffect, useCallback } from 'react';
import { Message, ChatStatus, AppView, User } from './types';
import { sendMessageStream, resetSession, initializeChatSession } from './services/geminiService';
import { WELCOME_MESSAGE } from './constants';
import ChatInterface from './components/ChatInterface';
import JournalInterface from './components/JournalInterface';
import Header from './components/Header';
import AuthScreen from './components/AuthScreen';
import { ArrowUp } from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [view, setView] = useState<AppView>('chat');

  // Load user from local session storage (simple persistence)
  useEffect(() => {
    const savedUser = localStorage.getItem('ananta_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Initialize session when user is logged in
  useEffect(() => {
    if (user) {
      try {
        initializeChatSession();
        loadChatHistory(user.id);
      } catch (e) {
        console.error("Failed to init session", e);
      }
    }
  }, [user]);

  const loadChatHistory = (userId: string) => {
    const key = `ananta_chat_${userId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved).map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }));
      setMessages(parsed);
    } else {
      setMessages([{
        id: 'welcome',
        role: 'model',
        text: WELCOME_MESSAGE,
        timestamp: new Date()
      }]);
    }
  };

  const saveChatHistory = (userId: string, msgs: Message[]) => {
    localStorage.setItem(`ananta_chat_${userId}`, JSON.stringify(msgs));
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('ananta_current_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    localStorage.removeItem('ananta_current_user');
    resetSession();
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || status !== 'idle' || !user) return;

    const userMessageId = Date.now().toString();
    const newUserMessage: Message = {
      id: userMessageId,
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    saveChatHistory(user.id, updatedMessages); // Save immediately
    
    setInputValue('');
    setStatus('waiting');

    try {
      const streamResult = await sendMessageStream(text);
      
      setStatus('streaming');
      const modelMessageId = (Date.now() + 1).toString();
      let fullResponseText = "";
      
      // Create a placeholder message for the model
      setMessages(prev => [
        ...prev, 
        {
          id: modelMessageId,
          role: 'model',
          text: "",
          timestamp: new Date(),
          isStreaming: true
        }
      ]);

      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text || "";
        fullResponseText += chunkText;
        
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId 
            ? { ...msg, text: fullResponseText }
            : msg
        ));
      }

      // Finalize the message
      setMessages(prev => {
        const finalMessages = prev.map(msg => 
          msg.id === modelMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        );
        saveChatHistory(user.id, finalMessages); // Save final state
        return finalMessages;
      });
      
      setStatus('idle');

    } catch (error) {
      console.error("Chat error:", error);
      setStatus('error');
      setMessages(prev => {
         const newMsgs: Message[] = [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'model',
            text: "I sense a disturbance in our connection. Please forgive me, but could you repeat that?",
            timestamp: new Date()
          }
        ];
        saveChatHistory(user.id, newMsgs);
        return newMsgs;
      });
      setStatus('idle');
    }
  }, [status, messages, user]);

  const handleReset = () => {
    if (!user) return;
    resetSession();
    const newMessages: Message[] = [{
      id: Date.now().toString(),
      role: 'model',
      text: WELCOME_MESSAGE,
      timestamp: new Date()
    }];
    setMessages(newMessages);
    saveChatHistory(user.id, newMessages);
    setInputValue('');
    setStatus('idle');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-stone-950 text-sand-100 font-sans selection:bg-sand-800 selection:text-sand-100">
      
      <Header 
        onReset={handleReset} 
        currentView={view} 
        onViewChange={setView} 
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-stone-900 rounded-full blur-[100px] opacity-30"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-stone-800 rounded-full blur-[120px] opacity-20"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col h-full">
           
           {/* Chat View */}
           {view === 'chat' && (
             <>
               <ChatInterface 
                  messages={messages} 
                  status={status} 
                  onSendMessage={handleSendMessage}
               />

               {/* Input Area */}
               <div className="p-4 md:p-6 bg-stone-950/80 backdrop-blur-sm">
                 <div className="max-w-3xl mx-auto relative">
                   <div className="relative flex items-end gap-2 bg-stone-900/50 border border-stone-800 rounded-2xl p-2 focus-within:ring-1 focus-within:ring-sand-700/50 focus-within:border-sand-800 transition-all shadow-lg">
                     <textarea
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       onKeyDown={handleKeyDown}
                       placeholder="Share your thoughts..."
                       className="w-full bg-transparent border-none text-sand-100 placeholder-stone-600 focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 px-3 text-base font-sans"
                       rows={1}
                       style={{ height: 'auto', minHeight: '44px' }}
                       disabled={status !== 'idle'}
                     />
                     <button
                       onClick={() => handleSendMessage(inputValue)}
                       disabled={!inputValue.trim() || status !== 'idle'}
                       className={`mb-1 p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${
                         inputValue.trim() && status === 'idle'
                           ? 'bg-sand-700 text-stone-50 hover:bg-sand-600 shadow-md'
                           : 'bg-stone-800 text-stone-600 cursor-not-allowed'
                       }`}
                     >
                       <ArrowUp size={20} strokeWidth={2.5} />
                     </button>
                   </div>
                   <p className="text-center text-[10px] text-stone-700 mt-3 font-sans tracking-wide">
                     Ananta offers guidance, not medical advice. Breathe deeply.
                   </p>
                 </div>
               </div>
             </>
           )}

           {/* Journal View */}
           {view === 'journal' && user && (
             <JournalInterface userId={user.id} />
           )}

        </div>
      </main>
    </div>
  );
}

export default App;