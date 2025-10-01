import React from 'react';
import BedMap from './BedMap';
import { usePatients } from '../hooks/usePatients';
import DailyHandovers from './DailyHandovers';
import TodayAppointments from './TodayAppointments';
import UrgentNotesDisplay from './UrgentNotesDisplay';
import WardNotesInput from './WardNotesInput';
import TodayExamsReminder from './TodayExamsReminder';

interface DashboardProps {
  onSelectPatient: (patientId: string) => void;
  onAddPatient: (bed: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectPatient, onAddPatient }) => {
  const { activePatients } = usePatients();
  
  return (
    <div className="animate-fade-in space-y-8">
      <UrgentNotesDisplay />
      <TodayExamsReminder onSelectPatient={onSelectPatient} />
      <BedMap 
        patients={activePatients} 
        onSelectPatient={onSelectPatient} 
        onAddPatient={onAddPatient} 
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DailyHandovers />
        <TodayAppointments />
      </div>
      <WardNotesInput />
    </div>
  );
};

export default Dashboard;
