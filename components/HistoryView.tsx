import React, { useState, useEffect } from 'react';
import { getBackupList, restoreBackup } from '../services/backupService';
import { usePatients } from '../hooks/usePatients';
import { BackupMeta } from '../types';
import ConfirmationModal from './ConfirmationModal';

const HistoryView: React.FC = () => {
  const [backups, setBackups] = useState<BackupMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backupToRestore, setBackupToRestore] = useState<BackupMeta | null>(null);
  const { refreshData } = usePatients();

  useEffect(() => {
    const fetchBackups = async () => {
      setIsLoading(true);
      const backupList = await getBackupList();
      setBackups(backupList);
      setIsLoading(false);
    };
    fetchBackups();
  }, []);

  const handleRestore = async () => {
    if (!backupToRestore) return;

    const success = await restoreBackup(backupToRestore.timestamp);
    if (success) {
      refreshData();
      alert(`Ripristino del backup del ${new Date(backupToRestore.timestamp).toLocaleString('it-IT')} completato con successo.`);
      // Optionally navigate away, but for now we just close modal and refresh list
    } else {
      alert("Si è verificato un errore durante il ripristino del backup.");
    }
    setBackupToRestore(null);
  };

  if (isLoading) {
    return <div className="text-center p-8">Caricamento cronologia...</div>;
  }

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg animate-fade-in dark:bg-slate-800">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">Cronologia Modifiche (Backup Automatici)</h2>
        {backups.length === 0 ? (
          <p className="text-center text-lg text-slate-500 py-8 dark:text-slate-400">Nessun backup automatico trovato. Inizia a modificare i dati per crearne.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-base text-left text-slate-500 dark:text-slate-400">
              <thead className="text-sm text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-l-lg">Data e Ora del Backup</th>
                  <th scope="col" className="px-6 py-3">Pazienti Attivi</th>
                  <th scope="col" className="px-6 py-3">Note di Reparto</th>
                  <th scope="col" className="px-6 py-3">Utente</th>
                  <th scope="col" className="px-6 py-3 rounded-r-lg">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {backups.map(backup => (
                  <tr key={backup.timestamp} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {new Date(backup.timestamp).toLocaleString('it-IT', { dateStyle: 'full', timeStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4">{backup.patientCount}</td>
                    <td className="px-6 py-4">{backup.noteCount}</td>
                    <td className="px-6 py-4 font-semibold">{backup.user}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setBackupToRestore(backup)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Ripristina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={!!backupToRestore}
        onClose={() => setBackupToRestore(null)}
        onConfirm={handleRestore}
        title="Conferma Ripristino Backup"
        message={`Sei sicuro di voler ripristinare lo stato dell'applicazione a quello del ${backupToRestore ? new Date(backupToRestore.timestamp).toLocaleString('it-IT') : ''}? \n\nTutte le modifiche attuali andranno perse.`}
        confirmButtonText="Sì, ripristina"
      />
    </>
  );
};

export default HistoryView;
