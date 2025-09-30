import React, { useState } from 'react';
import { usePatients } from '../hooks/usePatients';
import ConfirmationModal from './ConfirmationModal';

const UrgentNotesDisplay: React.FC = () => {
  const { wardNotes, deleteWardNote } = usePatients();
  const [noteToDeleteId, setNoteToDeleteId] = useState<string | null>(null);

  if (wardNotes.length === 0) {
    return null;
  }
  
  const handleConfirmDelete = () => {
    if (noteToDeleteId) {
      deleteWardNote(noteToDeleteId);
      setNoteToDeleteId(null);
    }
  };

  return (
    <>
      <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-lg shadow-lg dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-600">
        <h2 className="text-xl font-bold mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-5.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z" clipRule="evenodd" />
          </svg>
          Note Urgenti di Reparto
        </h2>
        <ul className="space-y-3 pl-8">
          {wardNotes.map(note => (
            <li key={note.id} className="flex justify-between items-start group">
              <div className="flex-grow">
                <p className="whitespace-pre-wrap">{note.text}</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  {new Date(note.createdAt).toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button 
                onClick={() => setNoteToDeleteId(note.id)} 
                className="ml-4 text-amber-500 hover:text-amber-800 dark:hover:text-amber-200 text-2xl font-bold flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Elimina nota"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ConfirmationModal
        isOpen={!!noteToDeleteId}
        onClose={() => setNoteToDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Conferma Eliminazione Nota"
        message="Sei sicuro di voler eliminare questa nota urgente? L'azione è irreversibile."
        confirmButtonText="Sì, elimina"
      />
    </>
  );
};

export default UrgentNotesDisplay;
