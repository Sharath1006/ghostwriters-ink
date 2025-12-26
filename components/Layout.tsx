
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-feather-pointed text-amber-500 text-2xl"></i>
            <h1 className="text-xl font-bold tracking-tight text-slate-100">Ghostwriter's Ink</h1>
          </div>
          <div className="text-slate-400 text-sm hidden sm:block">
            AI-Powered Story Studio
          </div>
        </div>
      </header>
      <main className="flex-1 bg-slate-950">
        {children}
      </main>
      <footer className="bg-slate-900 border-t border-slate-800 p-4 text-center text-slate-500 text-xs">
        Powered by Gemini &copy; {new Date().getFullYear()} Ghostwriter's Ink
      </footer>
    </div>
  );
};
