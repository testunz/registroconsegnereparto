import React, { useState, useRef, useEffect } from 'react';
import { View } from '../types';
import BedOccupancyStats from './BedOccupancyStats';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  onImport: (file: File) => void;
  onShare: () => void;
  onPrint: () => void;
  onReset: () => void;
  onUndo: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUser: string | null;
  isAdmin: boolean;
  onLogout: () => void;
  onChangePassword: () => void;
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

const UserMenu: React.FC<{ currentUser: string | null; onLogout: () => void; onChangePassword: () => void; }> = ({ currentUser, onLogout, onChangePassword }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 bg-slate-100 rounded-full transition-colors dark:text-slate-300 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-30 dark:bg-slate-800 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Accesso come:</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{currentUser}</p>
                    </div>
                    <div className="py-1">
                        <button onClick={() => { onChangePassword(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">Cambia Password</button>
                        <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">Logout</button>
                    </div>
                </div>
            )}
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ currentView, setView, onImport, onShare, onPrint, onReset, onUndo, theme, toggleTheme, currentUser, isAdmin, onLogout, onChangePassword }) => {
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200">Registro Consegne</h1>
            </div>
          </div>
          <div className="w-full lg:w-auto flex flex-wrap items-center justify-center lg:justify-end gap-x-2 gap-y-2">
            <nav className="flex items-center flex-wrap gap-x-1 gap-y-2">
              <NavButton view="dashboard" label="Mappa Letti" currentView={currentView} setView={setView} />
              <NavButton view="attività" label="Attività" currentView={currentView} setView={setView} />
              <NavButton view="archive" label="Archivio" currentView={currentView} setView={setView} />
              <NavButton view="history" label="Cronologia" currentView={currentView} setView={setView} />
              {isAdmin && <NavButton view="admin" label="Gestione Utenti" currentView={currentView} setView={setView} />}
            </nav>
             <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                <button onClick={() => setView('guide')} title="Guida all'Uso" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <button onClick={toggleTheme} title="Cambia Tema" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700">
                  {theme === 'light' ? 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                    : 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                  }
                </button>
                 <button onClick={onUndo} title="Annulla Ultima Modifica" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                 </button>
                <button onClick={onPrint} title="Stampa Report" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
                <button onClick={handleImportClick} title="Importa Dati" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                </button>
                <button onClick={onShare} title="Esporta o Condividi Dati" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors dark:text-slate-400 dark:hover:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                </button>
                <button onClick={onReset} title="Resetta Dati" className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors dark:text-red-400 dark:hover:bg-red-900/50">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                </button>
                <div className="border-l border-slate-200 dark:border-slate-700 pl-2">
                    <UserMenu currentUser={currentUser} onLogout={onLogout} onChangePassword={onChangePassword} />
                </div>
            </div>
          </div>
        </div>
      </div>
      <BedOccupancyStats />
    </header>
  );
};

export default Header;