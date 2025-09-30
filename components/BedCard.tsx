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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
);

const calculateAge = (dateOfBirth: string): number | null => {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const BedCard: React.FC<BedCardProps> = ({ bedNumber, patient, onSelectPatient, onAddPatient }) => {

  const hasPendingExams = useMemo(() => {
    if (!patient) return false;
    return patient.externalExams.some(ex => ex.status !== 'effettuato');
  }, [patient]);
  
  if (patient) {
    const borderColor = SEVERITY_COLORS[patient.severity];
    const age = calculateAge(patient.dateOfBirth);

    return (
      <div 
        onClick={() => onSelectPatient(patient.id)}
        className={`bg-white rounded-lg p-4 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer border-l-8 ${borderColor} dark:bg-slate-800 dark:hover:shadow-slate-700/[.5] w-full sm:w-64 flex flex-col min-h-[190px] sm:min-h-[220px]`}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-xl font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-md dark:bg-slate-700 dark:text-slate-400">Letto {bedNumber}</span>
          {hasPendingExams && <BellIcon />}
        </div>
        <div className="flex-grow">
            <p className="font-bold text-2xl sm:text-3xl text-slate-800 truncate dark:text-slate-100">{patient.lastName}</p>
            <p className="font-normal text-xl sm:text-2xl text-slate-600 truncate dark:text-slate-300">{patient.firstName}</p>
            <div className="text-base text-slate-500 dark:text-slate-400 mt-3 space-y-1">
                 {age !== null && <p>Nato/a il: {new Date(patient.dateOfBirth).toLocaleDateString('it-IT')} ({age} anni)</p>}
                 <p>Ricovero: {new Date(patient.admissionDate).toLocaleDateString('it-IT')}</p>
            </div>
        </div>
         <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
             <p className="text-base font-semibold text-slate-700 dark:text-slate-300 truncate" title={patient.mainDiagnosis}>{patient.mainDiagnosis || 'Diagnosi non specificata'}</p>
         </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onAddPatient(bedNumber)}
      className="bg-white/50 rounded-lg p-4 shadow-sm hover:bg-white hover:shadow-lg cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center border-l-8 border-transparent group dark:bg-slate-800/50 dark:hover:bg-slate-800 w-full sm:w-64 min-h-[190px] sm:min-h-[220px]"
    >
      <span className="text-xl font-bold text-slate-500 dark:text-slate-400">Letto {bedNumber}</span>
      <span className="text-2xl text-green-600 font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">+ Aggiungi Paziente</span>
    </div>
  );
};

export default BedCard;