import React, { useState } from 'react';

interface ApiKeyModalProps {
    onSubmit: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit }) => {
    const [key, setKey] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!key.trim()) {
            setError('Please enter a valid API Key');
            return;
        }
        if (!key.startsWith('AIza')) {
            // Warning but not blocking, in case format changes, but good hint
            setError('That doesn\'t look like a standard Google API Key (usually starts with AIza)');
            // We let them proceed if they insist? No, let's just warn.
            // For now, let's just pass it if length is reasonable.
        }
        if (key.length < 20) {
            setError('Key looks too short');
            return;
        }
        onSubmit(key);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-key text-amber-500 text-xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">Enter API Key</h2>
                    <p className="text-slate-400 text-sm">
                        To use Ghostwriter's Ink, you need a Google Gemini API Key.
                        It is free to get and stored only in your browser.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={key}
                            onChange={(e) => {
                                setKey(e.target.value);
                                setError('');
                            }}
                            placeholder="Paste your API Key here (AIza...)"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                        {error && <p className="text-red-400 text-xs mt-2 pl-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-lg transition-all transform active:scale-95"
                    >
                        Start Writing
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-500/80 hover:text-amber-500 text-xs underline underline-offset-4"
                    >
                        Get a free API Key from Google AI Studio &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
};
