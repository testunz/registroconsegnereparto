import React, { useState } from 'react';
import { usePatients } from '../hooks/usePatients';

const WardNotesInput: React.FC = () => {
  const [noteText, setNoteText] = useState('');
  const { addWardNote } = usePatients();

  const handleSubmit = () => {
    if (noteText.trim()) {
      addWardNote(noteText);
      setNoteText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg dark:bg-slate-800">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Aggiungi Nota Urgente di Reparto</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Inserisci una comunicazione rapida per i colleghi (es. 'Attenzione, letto 5 in attesa di trasferimento urgente'). Premi Invio per aggiungere."
          className="w-full p-2 border rounded-md text-base bg-white border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200"
          rows={2}
          spellCheck="false"
          autoComplete="off"
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 h-fit"
        >
          Aggiungi
        </button>
      </div>
    </div>
  );
};

export default WardNotesInput;
