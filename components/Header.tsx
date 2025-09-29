import React, { useRef } from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  onImport: (file: File) => void;
  onExport: () => void;
  onPrintDashboard: () => void;
}

const NavButton: React.FC<{ view: View; label: string; currentView: View; setView: (view: View) => void }> = ({ view, label, currentView, setView }) => (
    <button
      onClick={() => setView(view)}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
        currentView === view
          ? 'text-blue-600'
          : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
      }`}
    >
      {label}
      {currentView === view && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full"></span>}
    </button>
  );

const Header: React.FC<HeaderProps> = ({ currentView, setView, onImport, onExport, onPrintDashboard }) => {
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
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-800">Registro Consegne</h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-1">
              <NavButton view="dashboard" label="Mappa Letti" currentView={currentView} setView={setView} />
              <NavButton view="archive" label="Archivio" currentView={currentView} setView={setView} />
            </nav>
             <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
                <button onClick={onPrintDashboard} title="Stampa Mappa" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
                <button onClick={handleImportClick} title="Importa Dati" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                </button>
                <button onClick={onExport} title="Esporta Dati" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75zM3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" transform="rotate(180 10 10)"/></svg>
                </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;