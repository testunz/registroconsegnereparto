import React, { useState } from 'react';
import Modal from './Modal';
import { getDb } from '../services/localDbService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onExport }) => {
  const [email, setEmail] = useState('');

  const handleSendEmail = () => {
    if (!email) {
      alert("Inserisci un indirizzo email valido.");
      return;
    }
    const db = getDb();
    const dataStr = JSON.stringify(db, null, 2);
    const dataBlob = new Blob([dataStr], {type: "application/json"});
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const dataUri = event.target?.result;
        const subject = `Backup Registro Medicina Interna del ${new Date().toLocaleDateString('it-IT')}`;
        const body = `In allegato il file di backup del database dell'applicazione Registro Consegne.\n\nFile: backup_registro_medicina_${new Date().toISOString().slice(0, 10)}.json`;
        
        // Note: Mailto has limitations on attachment size. For large DBs, direct download is better.
        // We are not directly attaching, but linking. This is a common workaround.
        // A more robust solution would involve a server.
        let mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // This won't attach the file but will open the mail client. The user must attach the downloaded file.
        alert("Il tuo client di posta si aprirà. Ricorda di allegare il file di backup che è stato scaricato automaticamente.");
        onExport(); // Trigger download so the user has the file
        window.location.href = mailtoLink;
        onClose();
    };
    reader.readAsDataURL(dataBlob);
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Condividi o Esporta Dati">
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Invia Backup via Email</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    Inserisci l'indirizzo email del destinatario. Verrà aperto il tuo client di posta predefinito.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="indirizzo@email.com"
                        className="flex-grow w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                    <button 
                        onClick={handleSendEmail} 
                        className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Invia Email
                    </button>
                </div>
            </div>

             <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500">oppure</span>
                <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
            </div>

            <div>
                 <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Scarica File di Backup</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    Salva una copia del database in formato JSON sul tuo computer.
                </p>
                <button 
                    onClick={() => { onExport(); onClose(); }} 
                    className="w-full px-4 py-2 text-base font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                    Scarica Backup
                </button>
            </div>
            
            <div className="flex justify-end pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={onClose} className="px-4 py-2 text-base font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500">
                    Chiudi
                </button>
            </div>
        </div>
    </Modal>
  );
};

export default ShareModal;
