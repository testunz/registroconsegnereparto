import React, { useState, useEffect } from 'react';
import { useLastSaveInfo } from '../hooks/useLastSaveInfo';

const Footer: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const lastSaveInfo = useLastSaveInfo();

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-20 dark:bg-slate-900/80 dark:border-slate-700">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 h-auto py-2 flex flex-col items-center gap-1 sm:h-12 sm:flex-row sm:justify-between sm:py-0">
                <div className="flex-1 w-full sm:w-auto text-center sm:text-left text-sm text-slate-500 dark:text-slate-400">
                    {lastSaveInfo ? (
                        <span>
                            Ultimo salvataggio: {new Date(lastSaveInfo.timestamp).toLocaleTimeString('it-IT')} ({lastSaveInfo.user})
                        </span>
                    ) : (
                        <span>Nessun salvataggio recente.</span>
                    )}
                </div>
                <div className="flex-1 w-full sm:w-auto text-center font-semibold text-base text-slate-700 dark:text-slate-200 order-first sm:order-none">
                    <span>{formattedTime}</span>
                </div>
                <div className="flex-1 w-full sm:w-auto text-center sm:text-right text-xs">
                    <span>v1.0 beta | </span>
                    <a 
                        href="http://www.ascoltavisioni.it" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline text-blue-600 dark:text-blue-500 font-medium"
                    >
                        ascoltavisioni.it
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;