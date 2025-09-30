import React, { useState, useCallback, useRef } from 'react';
import { View } from '../types';
import { usePatients } from '../hooks/usePatients';
import { importData, exportData } from '../services/localDbService';
import Header from './Header';
import Dashboard from './Dashboard';
import ArchiveView from './ArchiveView';
import PatientDetail from './PatientDetail';
import PatientForm from './PatientForm';
import PrintDashboard from './PrintDashboard';
import ActivityView from './ActivityView';
import { usePrint } from '../hooks/usePrint';
import { useTheme } from '../hooks/useTheme';

const MainLayout: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [newPatientBed, setNewPatientBed] = useState<string | null>(null);

  const { getPatientById, activePatients, refreshData } = usePatients();
  const { theme, toggleTheme } = useTheme();

  const printDashboardRef = useRef<HTMLDivElement>(null);
  const handlePrintDashboard = usePrint(printDashboardRef);

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
    importData(file, (success, message) => {
      alert(message);
      if (success) {
        refreshData();
      }
    });
  };

  const renderView = () => {
    switch(view) {
      case 'dashboard':
        return <Dashboard onSelectPatient={handleSelectPatient} onAddPatient={handleOpenNewPatientForm} />;
      case 'archive':
        return <ArchiveView onSelectPatient={handleSelectPatient} />;
      case 'attività':
        return <ActivityView />;
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
        onExport={exportData}
        onPrintDashboard={handlePrintDashboard}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="p-4 sm:p-6 lg:p-8 mx-auto">
        {renderView()}
      </main>
      {isNewPatientModalOpen && newPatientBed && (
        <PatientForm
          isOpen={isNewPatientModalOpen}
          onClose={handleCloseNewPatientForm}
          initialBed={newPatientBed}
        />
      )}
      <div className="hidden">
        <PrintDashboard ref={printDashboardRef} patients={activePatients} />
      </div>
    </div>
  );
};

export default MainLayout;