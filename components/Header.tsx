import React, { useRef } from 'react';
import { View } from '../types';
import BedOccupancyStats from './BedOccupancyStats';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  onImport: (file: File) => void;
  onExport: () => void;
  onPrintDashboard: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const NavButton: React.FC<{ view: View; label: string; currentView: View; setView: (view: View) => void }> = ({ view, label, currentView, setView }) => (
    <button
      onClick={() => setView(view)}
      className={`px-4 py-2 text-lg font-medium rounded-md transition-colors relative ${
        currentView === view
          ? 'text-blue-600 dark:text-blue-500'
          : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      {label}
      {currentView === view && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full"></span>}
    </button>
  );

const Header: React.FC<HeaderProps> = ({ currentView, setView, onImport, onExport, onPrintDashboard, theme, toggleTheme }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
    event.target.value = '';
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-20 dark:bg-slate-900/80 dark:border-slate-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-y-4 py-4 lg:h-20 lg:flex-nowrap">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200">Registro Consegne Medicina Interna Soverato</h1>
              <p className="text-base text-slate-500 dark:text-slate-400 hidden sm:block">Direttore: dott. Benedetto Caroleo</p>
            </div>
          </div>
          <div className="w-full lg:w-auto flex flex-wrap items-center justify-center lg:justify-end gap-x-2 gap-y-2">
            <nav className="flex items-center flex-wrap gap-x-1 gap-y-2">
              <NavButton view="dashboard" label="Mappa Letti" currentView={currentView} setView={setView} />
              <NavButton view="attività" label="Attività" currentView={currentView} setView={setView} />
              <NavButton view="archive" label="Archivio" currentView={currentView} setView={setView} />
            </nav>
             <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                <button onClick={toggleTheme} title="Cambia Tema" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700">
                  {theme === 'light' ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.464A1 1 0 106.465 13.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1-1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16.95A1 1 0 017 16V5a1 1 0 012 0v11a1 1 0 01-1 .05z" /></svg>
                    : 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                  }
                </button>
                <button onClick={onPrintDashboard} title="Stampa Mappa" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
                <button onClick={handleImportClick} title="Importa Dati" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                </button>
                <button onClick={onExport} title="Esporta Dati" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75zM3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" transform="rotate(180 10 10)"/></svg>
                </button>
            </div>
          </div>
        </div>
      </div>
      <BedOccupancyStats />
    </header>
  );
};

export default Header;