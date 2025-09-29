import React, { useMemo } from 'react';
import { Patient } from '../types';
import { SEVERITY_COLORS } from '../constants';

interface BedCardProps {
  bedNumber: string;
  patient?: Patient;
  onSelectPatient: (patientId: string) => void;
  onAddPatient: (bed: string) => void;
}

const BellIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
);

const BedCard: React.FC<BedCardProps> = ({ bedNumber, patient, onSelectPatient, onAddPatient }) => {

  const hasPendingExams = useMemo(() => {
    if (!patient) return false;
    return patient.externalExams.some(ex => ex.status !== 'completato');
  }, [patient]);
  
  if (patient) {
    const borderColor = SEVERITY_COLORS[patient.severity];
    return (
      <div 
        onClick={() => onSelectPatient(patient.id)}
        className={`bg-white rounded-lg p-3 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer border-l-4 ${borderColor}`}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Letto {bedNumber}</span>
          {hasPendingExams && <BellIcon />}
        </div>
        <p className="font-bold text-base text-slate-800 truncate">{patient.lastName}</p>
        <p className="font-normal text-sm text-slate-600 truncate">{patient.firstName}</p>
        <p className="text-xs text-slate-400 capitalize mt-1">{patient.admissionType}</p>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onAddPatient(bedNumber)}
      className="bg-white/50 rounded-lg p-3 shadow-sm hover:bg-white hover:shadow-lg cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center border-l-4 border-transparent group"
      style={{minHeight: '112px'}}
    >
      <span className="text-sm font-bold text-slate-500">Letto {bedNumber}</span>
      <span className="text-sm text-green-600 font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">+ Aggiungi</span>
    </div>
  );
};

export default BedCard;