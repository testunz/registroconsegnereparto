import React from 'react';
import BedMap from './BedMap';
import { usePatients } from '../hooks/usePatients';

interface DashboardProps {
  onSelectPatient: (patientId: string) => void;
  onAddPatient: (bed: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectPatient, onAddPatient }) => {
  const { activePatients } = usePatients();
  
  return (
    <div className="animate-fade-in">
      <BedMap 
        patients={activePatients} 
        onSelectPatient={onSelectPatient} 
        onAddPatient={onAddPatient} 
      />
    </div>
  );
};

export default Dashboard;