
import React, { useState } from 'react';
import { StoryState } from '../types';
import { generateSpeech } from '../services/geminiService';

interface Props {
  state: StoryState;
  apiKey: string;
}

export const StoryPanel: React.FC<Props> = ({ state, apiKey }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const handleReadAloud = async () => {
    if (!state.openingParagraph || isPlaying) return;

    try {
      setIsPlaying(true);
      let buffer = audioBuffer;
      if (!buffer) {
        buffer = await generateSpeech(state.openingParagraph, apiKey);
        setAudioBuffer(buffer);
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsPlaying(false);
      source.start(0);
    } catch (err) {
      console.error("Audio playback error:", err);
      setIsPlaying(false);
    }
  };

  if (!state.image && !state.loading) return null;

  return (
    <div className="space-y-6">
      {/* Image Preview */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center">
        {state.loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
            <p className="text-slate-400 animate-pulse">Consulting the muse...</p>
          </div>
        ) : (
          <img src={state.image!} alt="Inspiration" className="w-full h-full object-cover" />
        )}
      </div>

      {state.analysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Mood</h4>
            <p className="text-slate-200 capitalize">{state.analysis.mood}</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Setting</h4>
            <p className="text-slate-200">{state.analysis.setting}</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Key Details</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {state.analysis.keyDetails.map((detail, idx) => (
                <span key={idx} className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded-md uppercase tracking-tighter">
                  {detail}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {state.openingParagraph && (
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 relative group">
          <button
            onClick={handleReadAloud}
            disabled={isPlaying}
            className={`absolute top-4 right-4 p-3 rounded-full transition-all ${isPlaying ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-400 hover:bg-amber-500 hover:text-slate-950'
              }`}
            title="Read Aloud"
          >
            <i className={`fa-solid ${isPlaying ? 'fa-volume-high' : 'fa-play'}`}></i>
          </button>

          <div className="serif-font text-2xl md:text-3xl italic text-slate-100 leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-amber-500">
            {state.openingParagraph}
          </div>
        </div>
      )}
    </div>
  );
};
