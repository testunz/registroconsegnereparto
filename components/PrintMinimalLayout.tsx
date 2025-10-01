import React from 'react';
import { Patient } from '../types';
import { ALL_BEDS, SEVERITY_NAMES } from '../constants';

interface PrintMinimalLayoutProps {
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

const PrintMinimalLayout: React.FC<PrintMinimalLayoutProps> = ({ patients }) => {
  // Fix: Explicitly type the Map to ensure correct type inference for `patient`.
  const patientsByBed = new Map<string, Patient>(patients.map(p => [p.bed, p]));

  return (
    <div className="p-4 font-sans bg-white text-black">
      <header className="text-center mb-6 border-b-2 border-black pb-3">
        <h1 className="text-2xl font-extrabold">Report Minimale Pazienti</h1>
        <p className="text-base">Report del {new Date().toLocaleString('it-IT')}</p>
      </header>
      <table className="w-full text-sm border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <th className="border border-black p-2 text-left w-16">Letto</th>
            <th className="border border-black p-2 text-left">Cognome e Nome</th>
            <th className="border border-black p-2 text-left w-24">Degenza</th>
            <th className="border border-black p-2 text-left w-28">Gravità</th>
            <th className="border border-black p-2 text-left">Diagnosi Principale</th>
          </tr>
        </thead>
        <tbody>
          {ALL_BEDS.map(bed => {
            const patient = patientsByBed.get(bed);
            if (patient) {
              const severityClass = {
                rosso: 'bg-red-200',
                giallo: 'bg-yellow-200',
                verde: 'bg-green-200',
              }[patient.severity];
              
              const lengthOfStay = calculateLengthOfStay(patient.admissionDate);

              return (
                <tr key={bed} className="break-inside-avoid">
                  <td className="border border-black p-2 font-bold text-center">{patient.bed}</td>
                  <td className="border border-black p-2 font-semibold">
                    {patient.lastName} {patient.firstName}
                    {patient.admissionType === 'lungodegenza' && ' (LD)'}
                  </td>
                  <td className="border border-black p-2 text-center font-bold">{lengthOfStay} gg</td>
                  <td className={`border border-black p-2 text-center font-bold ${severityClass}`}>
                    {SEVERITY_NAMES[patient.severity].replace('Condizioni ', '').replace('Moderate', 'Moder.')}
                  </td>
                  <td className="border border-black p-2">{patient.mainDiagnosis}</td>
                </tr>
              );
            } else {
              return (
                <tr key={bed} className="break-inside-avoid">
                  <td className="border border-black p-2 font-bold text-center">{bed}</td>
                  <td className="border border-black p-2 text-center text-gray-500" colSpan={4}>Libero</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PrintMinimalLayout;