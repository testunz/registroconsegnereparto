import React from 'react';
import { Patient } from '../types';
import { ALL_BEDS } from '../constants';

interface PrintWorkGridLayoutProps {
  patients: Patient[];
}

const calculateLengthOfStay = (admissionDate: string): number => {
    if (!admissionDate) return 0;
    const start = new Date(admissionDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays + 1;
};

const PrintWorkGridLayout: React.FC<PrintWorkGridLayoutProps> = ({ patients }) => {
  // Fix: Explicitly type the Map to ensure correct type inference for `patient`.
  const patientsByBed = new Map<string, Patient>(patients.map(p => [p.bed, p]));

  const calculateAge = (dateOfBirth: string): number => {
    const ageDifMs = Date.now() - new Date(dateOfBirth).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="p-4 font-sans bg-white text-black">
      <header className="text-center mb-4 border-b-2 border-black pb-2">
        <h1 className="text-xl font-extrabold">Griglia di Lavoro</h1>
        <p className="text-sm">Data: {new Date().toLocaleDateString('it-IT')}</p>
      </header>
      <table className="w-full text-xs border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <th className="border border-black p-1 text-left" style={{ width: '4%' }}>Letto</th>
            <th className="border border-black p-1 text-left" style={{ width: '20%' }}>Anagrafica</th>
            <th className="border border-black p-1 text-left" style={{ width: '20%' }}>Diagnosi Principale</th>
            <th className="border border-black p-1 text-left" style={{ width: '28%' }}>Note Cliniche</th>
            <th className="border border-black p-1 text-left" style={{ width: '28%' }}>Da Fare</th>
          </tr>
        </thead>
        <tbody>
          {ALL_BEDS.map(bed => {
            const patient = patientsByBed.get(bed);
            if (patient) {
                const severityColor = {
                    rosso: '#ef4444',
                    giallo: '#facc15',
                    verde: '#22c55e',
                }[patient.severity];
                
                const lengthOfStay = calculateLengthOfStay(patient.admissionDate);

                return (
                    <tr key={bed} className="break-inside-avoid">
                    <td className="border border-black p-1 font-bold align-top text-center h-24">{patient.bed}</td>
                    <td className="border border-black p-1 align-top">
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                             <span style={{ height: '10px', width: '10px', backgroundColor: severityColor, borderRadius: '50%', marginRight: '4px', display: 'inline-block', flexShrink: 0 }}></span>
                            <p className="font-bold">{patient.lastName} {patient.firstName}</p>
                        </div>
                        <p>{calculateAge(patient.dateOfBirth)} anni ({new Date(patient.dateOfBirth).toLocaleDateString('it-IT')})</p>
                        <p>Ricovero: {new Date(patient.admissionDate).toLocaleDateString('it-IT')} ({lengthOfStay} gg)</p>
                    </td>
                    <td className="border border-black p-1 align-top">{patient.mainDiagnosis}</td>
                    <td className="border border-black p-1 align-top"></td>
                    <td className="border border-black p-1 align-top"></td>
                    </tr>
                );
            } else {
                 return (
                    <tr key={bed} className="break-inside-avoid">
                        <td className="border border-black p-1 font-bold align-top text-center h-24">{bed}</td>
                        <td className="border border-black p-1 align-top text-center text-gray-500" colSpan={4}>Libero</td>
                    </tr>
                );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PrintWorkGridLayout;