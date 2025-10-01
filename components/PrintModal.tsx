import React from 'react';
import Modal from './Modal';
import { Patient } from '../types';
import { usePrint } from '../hooks/usePrint';
import PrintMinimalLayout from './PrintMinimalLayout';
import PrintHandoversLayout from './PrintHandoversLayout';
import PrintWorkGridLayout from './PrintWorkGridLayout';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
}

const PrintOption: React.FC<{title: string, description: string, onPrint: () => void}> = ({ title, description, onPrint }) => (
    <div className="p-4 bg-slate-100 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 dark:bg-slate-700">
        <div>
            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">{title}</h4>
            <p className="text-slate-600 dark:text-slate-400">{description}</p>
        </div>
        <button 
            onClick={onPrint}
            className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex-shrink-0 w-full sm:w-auto"
        >
            Stampa
        </button>
    </div>
);

const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose, patients }) => {
    
    // Create refs and print handlers for each layout
    const minimalRef = React.useRef<HTMLDivElement>(null);
    const handoversRef = React.useRef<HTMLDivElement>(null);
    const workGridRef = React.useRef<HTMLDivElement>(null);

    const printMinimal = usePrint(minimalRef);
    const printHandovers = usePrint(handoversRef);
    const printWorkGrid = usePrint(workGridRef);

    const handlePrintMinimal = () => {
        printMinimal({ documentTitle: 'Report Minimale', layout: 'portrait' });
        onClose();
    };

    const handlePrintHandovers = () => {
        printHandovers({ documentTitle: 'Report Consegne e Attività', layout: 'portrait' });
        onClose();
    };

    const handlePrintWorkGrid = () => {
        printWorkGrid({ documentTitle: 'Griglia di Lavoro', layout: 'landscape' });
        onClose();
    };
  
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Opzioni di Stampa" size="2xl">
                <div className="space-y-4">
                    <PrintOption 
                        title="Report Minimale"
                        description="Un foglio A4 con l'elenco dei pazienti, letto e diagnosi. Ideale per una visione rapida."
                        onPrint={handlePrintMinimal}
                    />
                    <PrintOption 
                        title="Report Consegne e Attività"
                        description="Un report di 1-2 pagine con le consegne e gli esami in sospeso per ogni paziente."
                        onPrint={handlePrintHandovers}
                    />
                    <PrintOption 
                        title="Griglia di Lavoro"
                        description="Un foglio A4 orizzontale con una griglia per appunti manuali durante il giro visite."
                        onPrint={handlePrintWorkGrid}
                    />
                </div>
                <div className="flex justify-end pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                     <button type="button" onClick={onClose} className="px-4 py-2 text-base font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500">
                        Annulla
                    </button>
                </div>
            </Modal>
             {/* We need to render the components to be able to get their refs */}
            <div className="hidden">
                <div ref={minimalRef}><PrintMinimalLayout patients={patients} /></div>
                <div ref={handoversRef}><PrintHandoversLayout patients={patients} /></div>
                <div ref={workGridRef}><PrintWorkGridLayout patients={patients} /></div>
            </div>
        </>
    );
};

export default PrintModal;
