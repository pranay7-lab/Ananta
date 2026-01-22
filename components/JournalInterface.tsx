import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { Plus, Save, Trash2, ChevronLeft, PenLine } from 'lucide-react';

interface JournalInterfaceProps {
  userId: string;
}

const JournalInterface: React.FC<JournalInterfaceProps> = ({ userId }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Storage key specific to user
  const getStorageKey = () => `ananta_journal_${userId}`;

  // Load entries on mount or user change
  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp)
        }));
        // Sort by date desc
        parsed.sort((a: JournalEntry, b: JournalEntry) => b.timestamp.getTime() - a.timestamp.getTime());
        setEntries(parsed);
      } catch (e) {
        console.error("Failed to load journal entries", e);
        setEntries([]);
      }
    } else {
      setEntries([]);
    }
    // Reset editor state on user change
    setActiveEntryId(null);
    setEditorContent('');
  }, [userId]);

  // Save entry
  const handleSave = () => {
    if (!editorContent.trim() && !activeEntryId) return;

    let updatedEntries;
    const now = new Date();

    if (activeEntryId) {
      // Update existing
      updatedEntries = entries.map(e => 
        e.id === activeEntryId 
          ? { ...e, content: editorContent, timestamp: now } // Update timestamp on edit
          : e
      );
    } else {
      // Create new
      const newId = Date.now().toString();
      const newEntry: JournalEntry = {
        id: newId,
        content: editorContent,
        timestamp: now
      };
      updatedEntries = [newEntry, ...entries];
      setActiveEntryId(newId);
    }
    
    // Sort again
    updatedEntries.sort((a: JournalEntry, b: JournalEntry) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setEntries(updatedEntries);
    localStorage.setItem(getStorageKey(), JSON.stringify(updatedEntries));
    
    // Show toast
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const updated = entries.filter(entry => entry.id !== id);
      setEntries(updated);
      localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      if (activeEntryId === id) {
        setActiveEntryId(null);
        setEditorContent('');
      }
    }
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setActiveEntryId(entry.id);
    setEditorContent(entry.content);
  };

  const handleNewEntry = () => {
    setActiveEntryId(null);
    setEditorContent('');
  };

  // Helper to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeEntry = entries.find(e => e.id === activeEntryId);

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden animate-fade-in">
      
      {/* Sidebar / List - Hidden on mobile if editing */}
      <div className={`w-full md:w-80 border-r border-stone-800 bg-stone-900/50 flex flex-col ${activeEntryId !== null ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-stone-800 flex justify-between items-center">
          <h2 className="text-sand-100 font-serif font-medium">Your Reflections</h2>
          <button 
            onClick={handleNewEntry}
            className="p-2 bg-sand-700 hover:bg-sand-600 text-stone-50 rounded-full transition-colors shadow-md"
            title="New Entry"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {entries.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <PenLine className="mx-auto mb-2 text-stone-600" size={32} />
              <p className="text-sm text-stone-500">No entries yet.</p>
              <button onClick={handleNewEntry} className="text-sm text-sand-500 underline mt-2">Start writing</button>
            </div>
          ) : (
            entries.map(entry => (
              <div 
                key={entry.id}
                onClick={() => handleSelectEntry(entry)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  activeEntryId === entry.id 
                    ? 'bg-stone-800 border-sand-700/50 shadow-md' 
                    : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-sand-500 font-medium uppercase tracking-wider">
                    {formatDate(entry.timestamp)}
                  </span>
                  <button 
                    onClick={(e) => handleDelete(entry.id, e)}
                    className="text-stone-600 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-sm text-stone-300 line-clamp-2 font-serif">
                  {entry.content || <span className="italic opacity-50">Empty entry...</span>}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor Area - Hidden on mobile if list is showing (and no active entry) */}
      <div className={`flex-1 flex flex-col bg-stone-950 relative ${activeEntryId === null ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Mobile Header for Editor */}
        <div className="md:hidden p-3 border-b border-stone-800 flex items-center gap-3">
          <button onClick={() => setActiveEntryId(null)} className="text-stone-400">
            <ChevronLeft size={24} />
          </button>
          <span className="text-sm text-stone-500 uppercase tracking-widest flex-1 text-center">
            {activeEntryId ? 'Editing Entry' : 'New Entry'}
          </span>
          <div className="w-6"></div> {/* Spacer */}
        </div>

        <div className="flex-1 p-4 md:p-8 flex flex-col max-w-3xl mx-auto w-full">
          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="What is in your heart today? Let your thoughts flow..."
            className="flex-1 w-full bg-transparent border-none resize-none focus:ring-0 text-lg md:text-xl font-serif text-sand-100 placeholder-stone-700 leading-relaxed"
          />
        </div>

        {/* Toolbar */}
        <div className="p-4 md:p-6 border-t border-stone-800 bg-stone-950/80 backdrop-blur-sm flex justify-between items-center max-w-3xl mx-auto w-full">
           <div className="text-xs text-stone-600 font-sans hidden md:block">
             {activeEntryId ? `Last edited: ${formatDate(activeEntry?.timestamp || new Date())}` : 'New Unsaved Entry'}
           </div>
           
           <div className="flex items-center gap-4 ml-auto">
             {showSavedToast && (
               <span className="text-sm text-green-500/80 animate-fade-in px-2">Saved</span>
             )}
             <button
               onClick={handleSave}
               className="flex items-center gap-2 bg-sand-700 hover:bg-sand-600 text-stone-50 px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-sand-900/20"
             >
               <Save size={18} />
               <span>Save Reflection</span>
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default JournalInterface;