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

const NavButton: React.FC<{ view: View; label: string; currentView: View; setView: (view: View) => void, className?: string }> = ({ view, label, currentView, setView, className }) => (
    <button
      onClick={() => setView(view)}
      className={`px-4 py-2 text-lg w-full text-left font-medium rounded-md transition-colors relative lg:w-auto lg:text-center ${
        currentView === view
          ? 'text-blue-600 dark:text-blue-500 bg-blue-100 dark:bg-blue-900/50'
          : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
      } ${className}`}
    >
      {label}
      {currentView === view && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full hidden lg:block"></span>}
    </button>
  );

const ActionButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode; isDanger?: boolean; className?: string }> = ({ onClick, title, children, isDanger, className }) => (
    <button onClick={onClick} title={title} className={`p-2 rounded-full transition-colors ${isDanger ? 'text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700'} ${className}`}>
        {children}
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
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 bg-slate-100 rounded-full transition-colors dark:text-slate-300 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center gap-2 w-full">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">{currentUser}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 dark:bg-slate-800 border dark:border-slate-700">
                    <div className="p-4 border-b dark:border-slate-700">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Accesso come:</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{currentUser}</p>
                    </div>
                    <div className="py-2">
                        <button onClick={onChangePassword} className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">Cambia Password</button>
                        <button onClick={onLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50">Logout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({
    currentView, setView, onImport, onShare, onPrint, onReset, onUndo,
    theme, toggleTheme, currentUser, isAdmin, onLogout, onChangePassword
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImport(e.target.files[0]);
            e.target.value = ''; // Reset input
        }
    };
    
    const handleNavClick = (view: View) => {
        setView(view);
        setIsMenuOpen(false);
    }
    
    const navItems = (
        <>
            <NavButton view="dashboard" label="Mappa Letti" currentView={currentView} setView={handleNavClick} />
            <NavButton view="attività" label="Attività" currentView={currentView} setView={handleNavClick} />
            <NavButton view="archive" label="Archivio" currentView={currentView} setView={handleNavClick} />
            <NavButton view="history" label="Cronologia" currentView={currentView} setView={handleNavClick} />
            {isAdmin && <NavButton view="admin" label="Gestione Utenti" currentView={currentView} setView={handleNavClick} />}
        </>
    );

    const actionItems = (
        <>
            <ActionButton onClick={() => handleNavClick('guide')} title="Guida all'Uso">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </ActionButton>
            <ActionButton onClick={toggleTheme} title="Cambia Tema">
                {theme === 'light' ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg> : 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                }
            </ActionButton>
             <ActionButton onClick={onUndo} title="Annulla Ultima Modifica">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
            </ActionButton>
            <ActionButton onClick={onPrint} title="Stampa Report">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
            </ActionButton>
            <ActionButton onClick={handleImportClick} title="Importa Dati">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
            </ActionButton>
             <ActionButton onClick={onShare} title="Esporta o Condividi Dati">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            </ActionButton>
            <ActionButton onClick={onReset} title="Resetta Dati" isDanger>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            </ActionButton>
        </>
    );
    
    return (
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg sticky top-0 z-30 shadow-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <span className="text-xl font-bold text-slate-800 dark:text-slate-200">Registro Consegne MI</span>
                    </div>
                    
                    <nav className="hidden lg:flex lg:items-center lg:gap-2">
                        {navItems}
                    </nav>

                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex items-center gap-2">
                           {actionItems}
                        </div>
                        <div className="border-l border-slate-300 dark:border-slate-600 h-8"></div>
                        <UserMenu currentUser={currentUser} onLogout={onLogout} onChangePassword={onChangePassword} />
                    </div>

                    <div className="lg:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Apri menu">
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                {isMenuOpen ? 
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> :
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile/Side Menu */}
            <div className={`fixed inset-0 z-40 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`} role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
                <div className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white dark:bg-slate-800 shadow-xl flex flex-col">
                    <div className="p-4 border-b dark:border-slate-700">
                        <UserMenu currentUser={currentUser} onLogout={() => { onLogout(); setIsMenuOpen(false); }} onChangePassword={() => { onChangePassword(); setIsMenuOpen(false); }} />
                    </div>
                    <nav className="flex-grow p-4 flex flex-col gap-2">
                        {navItems}
                    </nav>
                    <div className="p-4 border-t dark:border-slate-700 flex flex-wrap gap-2 justify-center">
                        {actionItems}
                    </div>
                </div>
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            <BedOccupancyStats />
        </header>
    );
};