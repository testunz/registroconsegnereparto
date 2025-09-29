import React, { useState, useMemo } from 'react';
import { usePatients } from '../hooks/usePatients';

interface ArchiveViewProps {
  onSelectPatient: (patientId: string) => void;
}

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
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Archivio Pazienti Dimessi</h2>
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Cerca per nome, cognome o data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-100 border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">Nome e Cognome</th>
              <th scope="col" className="px-6 py-3">Data di Ricovero</th>
              <th scope="col" className="px-6 py-3">Diagnosi Principale</th>
              <th scope="col" className="px-6 py-3 rounded-r-lg">Data Dimissione</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr 
                key={patient.id} 
                className="bg-white border-b hover:bg-slate-50 cursor-pointer"
                onClick={() => onSelectPatient(patient.id)}
              >
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                  {patient.lastName} {patient.firstName}
                </th>
                <td className="px-6 py-4">{new Date(patient.admissionDate).toLocaleDateString('it-IT')}</td>
                <td className="px-6 py-4 truncate max-w-xs">{patient.mainDiagnosis}</td>
                <td className="px-6 py-4">{new Date(patient.lastUpdated).toLocaleDateString('it-IT')}</td>
              </tr>
            ))}
             {filteredPatients.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-16 text-slate-500">
                      <p className="font-semibold">Nessun paziente trovato</p>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArchiveView;