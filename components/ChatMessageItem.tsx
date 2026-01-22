import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { User, Sparkles } from 'lucide-react';

interface ChatMessageItemProps {
  message: Message;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
          isUser ? 'bg-sand-600 text-stone-950' : 'bg-stone-800 text-sand-400 border border-stone-700'
        }`}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3 rounded-2xl shadow-sm leading-relaxed font-serif text-[0.95rem] md:text-[1.05rem] tracking-wide ${
            isUser 
              ? 'bg-sand-700 text-stone-50 rounded-tr-none' 
              : 'bg-stone-850 text-sand-100 border border-stone-800 rounded-tl-none'
          }`}>
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                strong: ({node, ...props}) => <span className={`font-bold ${isUser ? 'text-white' : 'text-sand-50'}`} {...props} />,
                em: ({node, ...props}) => <span className="italic opacity-90" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-3 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-3 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-sand-500 pl-3 italic my-3 opacity-80" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-md font-bold mb-1 mt-2" {...props} />,
                code: ({node, ...props}) => <code className="bg-stone-950/50 px-1 py-0.5 rounded text-sm font-sans" {...props} />
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
          <span className="text-xs text-stone-600 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

      </div>
    </div>
  );
};

export default ChatMessageItem;