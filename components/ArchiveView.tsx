import React, { useState, useMemo } from 'react';
import { usePatients } from '../hooks/usePatients';
import { DISCHARGE_TYPE_NAMES } from '../constants';
import { Patient } from '../types';

interface ArchiveViewProps {
  onSelectPatient: (patientId: string) => void;
}

const ArchiveCard: React.FC<{ patient: Patient; onClick: () => void }> = ({ patient, onClick }) => (
    <div 
        className="bg-white p-4 rounded-lg shadow-md border-l-4 border-slate-300 dark:bg-slate-800 dark:border-slate-600 animate-fade-in"
        onClick={onClick}
    >
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{patient.lastName} {patient.firstName}</h3>
            <span className="text-sm font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md dark:bg-slate-700 dark:text-slate-300">{patient.dischargeType ? DISCHARGE_TYPE_NAMES[patient.dischargeType] : 'N/D'}</span>
        </div>
        <div className="mt-3 space-y-2 text-base text-slate-600 dark:text-slate-400">
            <p><span className="font-semibold">Ricovero:</span> {new Date(patient.admissionDate).toLocaleDateString('it-IT')}</p>
            <p><span className="font-semibold">Dimissione:</span> {new Date(patient.lastUpdated).toLocaleDateString('it-IT')}</p>
            <p><span className="font-semibold">Diagnosi:</span> {patient.mainDiagnosis}</p>
        </div>
    </div>
);

const ArchiveView: React.FC<ArchiveViewProps> = ({ onSelectPatient }) => {
  const { dischargedPatients } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');
  
  const sortedPatients = useMemo(() => {
    return [...dischargedPatients].sort((a, b) => b.lastUpdated - a.lastUpdated);
  }, [dischargedPatients]);
  
  const filteredPatients = useMemo(() => {
    if (!searchTerm) return sortedPatients;
    const lowercasedTerm = searchTerm.toLowerCase();
    return sortedPatients.filter(p => 
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(lowercasedTerm) ||
      p.admissionDate.includes(searchTerm)
    );
  }, [sortedPatients, searchTerm]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg animate-fade-in dark:bg-slate-800">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Archivio Pazienti Dimessi</h2>
        <div className="w-full md:max-w-md">
          <input
            type="text"
            placeholder="Cerca per nome, cognome o data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-100 border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base dark:bg-slate-700 dark:text-slate-200"
          />
        </div>
      </div>
      
      {/* Table for medium screens and up */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-base text-left text-slate-500 dark:text-slate-400">
          <thead className="text-sm text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">Nome e Cognome</th>
              <th scope="col" className="px-6 py-3">Data di Ricovero</th>
              <th scope="col" className="px-6 py-3">Diagnosi Principale</th>
              <th scope="col" className="px-6 py-3">Data Dimissione</th>
              <th scope="col" className="px-6 py-3 rounded-r-lg">Esito Dimissione</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr 
                key={patient.id} 
                className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                onClick={() => onSelectPatient(patient.id)}
              >
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                  {patient.lastName} {patient.firstName}
                </th>
                <td className="px-6 py-4">{new Date(patient.admissionDate).toLocaleDateString('it-IT')}</td>
                <td className="px-6 py-4 truncate max-w-xs">{patient.mainDiagnosis}</td>
                <td className="px-6 py-4">{new Date(patient.lastUpdated).toLocaleDateString('it-IT')}</td>
                <td className="px-6 py-4">{patient.dischargeType ? DISCHARGE_TYPE_NAMES[patient.dischargeType] : 'N/D'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="space-y-4 md:hidden">
          {filteredPatients.map(patient => (
              <ArchiveCard key={patient.id} patient={patient} onClick={() => onSelectPatient(patient.id)} />
          ))}
      </div>

      {filteredPatients.length === 0 && (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <p className="text-lg font-semibold">Nessun paziente trovato</p>
          </div>
      )}
    </div>
  );
};

export default ArchiveView;