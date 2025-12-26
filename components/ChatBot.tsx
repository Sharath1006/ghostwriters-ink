
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, StoryState } from '../types';
import { chatWithGemini } from '../services/geminiService';

interface Props {
  storyState: StoryState;
  apiKey: string;
}

export const ChatBot: React.FC<Props> = ({ storyState, apiKey }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const context = `Mood: ${storyState.analysis?.mood}, Setting: ${storyState.analysis?.setting}, Story: ${storyState.openingParagraph}`;
      const response = await chatWithGemini(input, context, messages, apiKey);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I lost my train of thought. Can we try again?" }]);
    } finally {
      setLoading(false);
    }
  };

  if (!storyState.openingParagraph) return null;

  return (
    <div className="flex flex-col h-[500px] md:h-[600px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
      <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex items-center space-x-2">
        <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
        <h3 className="font-semibold text-slate-200">The Scribe's Assistant</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-500 text-sm">Ask about the characters, the world, or what happens next...</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user'
                ? 'bg-amber-600 text-white rounded-tr-none'
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex space-x-1">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-slate-800/50 border-t border-slate-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-xl disabled:opacity-50 transition-colors"
          >
            <i className="fa-solid fa-paper-plane px-1"></i>
          </button>
        </div>
      </form>
    </div>
  );
};
