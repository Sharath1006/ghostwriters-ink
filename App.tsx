
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ImageUploader } from './components/ImageUploader';
import { StoryPanel } from './components/StoryPanel';
import { ChatBot } from './components/ChatBot';
import { ApiKeyModal } from './components/ApiKeyModal';
import { StoryState } from './types';
import { analyzeImageAndWrite } from './services/geminiService';

const App: React.FC = () => {
  // Initialize with env var if available (for dev convenience), otherwise empty
  const [apiKey, setApiKey] = useState<string>(process.env.GEMINI_API_KEY || '');

  const [state, setState] = useState<StoryState>({
    image: null,
    analysis: null,
    openingParagraph: null,
    loading: false,
    error: null,
  });

  const handleImageSelect = async (base64: string) => {
    setState({ ...state, image: base64, loading: true, error: null, analysis: null, openingParagraph: null });

    try {
      const result = await analyzeImageAndWrite(base64, apiKey);
      setState({
        image: base64,
        analysis: {
          mood: result.mood,
          setting: result.setting,
          keyDetails: result.keyDetails,
        },
        openingParagraph: result.paragraph,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error(err);
      setState({
        ...state,
        loading: false,
        error: "The muse is silent today. Please check your connection or try another image.",
      });
    }
  };

  const handleReset = () => {
    setState({
      image: null,
      analysis: null,
      openingParagraph: null,
      loading: false,
      error: null,
    });
  };

  return (
    <Layout>
      {!apiKey && <ApiKeyModal onSubmit={setApiKey} />}

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {!state.image && !state.loading ? (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-100 tracking-tight serif-font italic">
                Every picture has a story <br />
                <span className="text-amber-500 not-italic">waiting to be told.</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Upload a scene and let our AI ghostwriter conjure the perfect opening for your next masterpiece.
              </p>
            </div>

            <ImageUploader onImageSelect={handleImageSelect} disabled={state.loading} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
              <button
                className="text-center p-4 rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-900/30 transition-all group"
                onClick={() => alert("Visual Analysis is active by default!")}
              >
                <div className="text-amber-500 mb-2 group-hover:scale-110 transition-transform"><i className="fa-solid fa-wand-sparkles text-2xl"></i></div>
                <h3 className="text-slate-200 font-semibold mb-1">Visual Analysis</h3>
                <p className="text-slate-500 text-xs">Deep scene and mood recognition</p>
                <div className="mt-2 text-[10px] text-amber-500 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Active</div>
              </button>

              <button
                className="text-center p-4 rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-900/30 transition-all group"
                onClick={() => alert("Atmospheric Writing is active by default!")}
              >
                <div className="text-amber-500 mb-2 group-hover:scale-110 transition-transform"><i className="fa-solid fa-pen-nib text-2xl"></i></div>
                <h3 className="text-slate-200 font-semibold mb-1">Atmospheric Writing</h3>
                <p className="text-slate-500 text-xs">Professional literary openings</p>
                <div className="mt-2 text-[10px] text-amber-500 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Active</div>
              </button>

              <button
                className="text-center p-4 rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-900/30 transition-all group"
                onClick={() => alert("Vocal Narration is available after generation!")}
              >
                <div className="text-amber-500 mb-2 group-hover:scale-110 transition-transform"><i className="fa-solid fa-microphone-lines text-2xl"></i></div>
                <h3 className="text-slate-200 font-semibold mb-1">Vocal Narration</h3>
                <p className="text-slate-500 text-xs">Expressive character voices</p>
                <div className="mt-2 text-[10px] text-amber-500 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Active</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handleReset}
                  className="text-slate-400 hover:text-amber-500 text-sm flex items-center space-x-2 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>Start New Story</span>
                </button>
                {state.loading && (
                  <span className="text-amber-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                    Writing...
                  </span>
                )}
              </div>

              {state.error && (
                <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-xl text-red-400 text-sm flex items-center space-x-3">
                  <i className="fa-solid fa-circle-exclamation text-lg"></i>
                  <span>{state.error}</span>
                </div>
              )}

              <StoryPanel state={state} apiKey={apiKey} />
            </div>

            <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
              <ChatBot storyState={state} apiKey={apiKey} />

              <div className="mt-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800 text-center">
                <p className="text-slate-400 text-sm italic">
                  "Writing is the only way to explain things to yourself."
                </p>
                <span className="text-slate-600 text-[10px] uppercase tracking-widest mt-2 block">— Alice Walker</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
