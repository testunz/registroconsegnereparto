import React, { useState, useCallback, useRef } from 'react';
import { View } from '../types';
import { usePatients } from '../hooks/usePatients';
import { importData } from '../services/localDbService';
// Fix: Changed to a named import as Header.tsx does not have a default export.
import { Header } from './Header';
import Dashboard from './Dashboard';
import ArchiveView from './ArchiveView';
import PatientDetail from './PatientDetail';
import PatientForm from './PatientForm';
import ActivityView from './ActivityView';
import HistoryView from './HistoryView';
import AdminPanel from './AdminPanel';
import ConfirmationModal from './ConfirmationModal';
import PrintModal from './PrintModal';
import ShareModal from './ShareModal';
import PasswordChangeModal from './PasswordChangeModal';
import Footer from './Footer';
import GuideView from './GuideView';

import PrintMinimalLayout from './PrintMinimalLayout';
import PrintHandoversLayout from './PrintHandoversLayout';
import PrintWorkGridLayout from './PrintWorkGridLayout';

import { resetDb, exportData } from '../services/localDbService';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../context/UserContext';
import { getBackupList, restoreBackup } from '../services/backupService';

const MainLayout: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isUndoModalOpen, setIsUndoModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPatientBed, setNewPatientBed] = useState<string | null>(null);

  const { getPatientById, activePatients, refreshData } = usePatients();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, isAdmin, logout } = useUser();

  const handleSelectPatient = useCallback((patientId: string) => {
    setSelectedPatientId(patientId);
    setView('patient_detail');
  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setSelectedPatientId(null);
    setView(newView);
  }, []);

  const handleOpenNewPatientForm = useCallback((bed: string) => {
    setNewPatientBed(bed);
    setIsNewPatientModalOpen(true);
  }, []);

  const handleCloseNewPatientForm = useCallback(() => {
    setIsNewPatientModalOpen(false);
    setNewPatientBed(null);
  }, []);

  const handleImport = (file: File) => {
    importData(file, currentUser || 'Sconosciuto', (success, message) => {
      alert(message);
      if (success) {
        refreshData();
      }
    });
  };

  const handleResetApp = async () => {
    await resetDb(currentUser || 'Sconosciuto');
    refreshData();
    setIsResetModalOpen(false);
  };
  
  const handleUndo = async () => {
      const backups = await getBackupList();
      if (backups.length > 1) {
          // The most recent backup (index 0) is the current state.
          // We want to restore the one before that (index 1).
          const previousBackup = backups[1];
          const success = await restoreBackup(previousBackup.timestamp);
          if (success) {
              refreshData();
              alert("L'ultima modifica è stata annullata con successo.");
          } else {
              alert("Errore: impossibile annullare l'ultima modifica.");
          }
      } else {
          alert("Non ci sono modifiche precedenti da poter annullare.");
      }
      setIsUndoModalOpen(false);
  };

  const renderView = () => {
    switch(view) {
      case 'dashboard':
        return <Dashboard onSelectPatient={handleSelectPatient} onAddPatient={handleOpenNewPatientForm} />;
      case 'archive':
        return <ArchiveView onSelectPatient={handleSelectPatient} />;
      case 'attività':
        return <ActivityView />;
      case 'history':
        return <HistoryView />;
      case 'admin':
        return isAdmin ? <AdminPanel /> : <Dashboard onSelectPatient={handleSelectPatient} onAddPatient={handleOpenNewPatientForm} />;
      case 'guide':
        return <GuideView />;
      case 'patient_detail':
        const patient = getPatientById(selectedPatientId!);
        if (!patient) return <Dashboard onSelectPatient={handleSelectPatient} onAddPatient={handleOpenNewPatientForm} />;
        return <PatientDetail patient={patient} onClose={() => handleViewChange('dashboard')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans dark:bg-slate-900 dark:text-slate-200">
      <Header 
        currentView={view} 
        setView={handleViewChange} 
        onImport={handleImport}
        onShare={() => setIsShareModalOpen(true)}
        onPrint={() => setIsPrintModalOpen(true)}
        onReset={() => setIsResetModalOpen(true)}
        onUndo={() => setIsUndoModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onLogout={logout}
        onChangePassword={() => setIsPasswordModalOpen(true)}
      />
      <main className="p-4 sm:p-6 lg:p-8 mx-auto pb-20">
        {renderView()}
      </main>
      <Footer />
      {isNewPatientModalOpen && newPatientBed && (
        <PatientForm
          isOpen={isNewPatientModalOpen}
          onClose={handleCloseNewPatientForm}
          initialBed={newPatientBed}
        />
      )}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetApp}
        title="Conferma Reset Dashboard"
        message="Sei sicuro di voler resettare la dashboard? Tutti i pazienti e le note attuali verranno rimossi. La cronologia dei backup non sarà eliminata."
        confirmButtonText="Sì, pulisci"
      />
       <ConfirmationModal
        isOpen={isUndoModalOpen}
        onClose={() => setIsUndoModalOpen(false)}
        onConfirm={handleUndo}
        title="Annulla Ultima Modifica"
        message="Sei sicuro di voler annullare l'ultima modifica? Lo stato dell'applicazione tornerà a quello del salvataggio precedente."
        confirmButtonText="Sì, annulla"
      />
      <PrintModal 
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        patients={activePatients}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onExport={exportData}
      />
      <PasswordChangeModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
       {/* Hidden print layouts */}
      <div className="hidden">
          <PrintMinimalLayout patients={activePatients} />
          <PrintHandoversLayout patients={activePatients} />
          <PrintWorkGridLayout patients={activePatients} />
      </div>
    </div>
  );
};

export default MainLayout;
