import React from 'react';
import { Patient } from '../types';
import { EXAM_STATUS_NAMES, ALL_BEDS } from '../constants';

interface PrintHandoversLayoutProps {
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

const PatientHandovers: React.FC<{ patient: Patient }> = ({ patient }) => {
    const activeHandovers = patient.handovers.filter(h => !h.isCompleted);
    const pendingExams = patient.externalExams.filter(e => e.status !== 'effettuato');

    if (activeHandovers.length === 0 && pendingExams.length === 0) {
        return null;
    }

    const severityColor = {
        rosso: '#ef4444',
        giallo: '#facc15',
        verde: '#22c55e',
    }[patient.severity];
    
    const lengthOfStay = calculateLengthOfStay(patient.admissionDate);

    return (
        <div className="mb-4 p-3 border border-black rounded break-inside-avoid">
            <h3 className="text-base font-extrabold border-b border-black pb-1 mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ height: '12px', width: '12px', backgroundColor: severityColor, borderRadius: '50%', marginRight: '8px', flexShrink: 0 }}></span>
                <span>Letto {patient.bed} - {patient.lastName} {patient.firstName} ({lengthOfStay} gg)</span>
            </h3>
            <p className="text-xs mb-2 truncate"><strong>Diagnosi:</strong> {patient.mainDiagnosis}</p>
            
            {activeHandovers.length > 0 && (
                 <div className="mb-2">
                    <h4 className="text-sm font-bold">Consegne Attive:</h4>
                     <ul className="list-disc pl-5 text-xs space-y-1">
                        {activeHandovers.map(h => (
                            <li key={h.id}>
                                {h.text}
                                {h.scheduledAt && <span className="font-semibold ml-2"> (Scad. {new Date(h.scheduledAt).toLocaleString('it-IT', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})})</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {pendingExams.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold">Esami/Consulenze in Sospeso:</h4>
                    <ul className="list-disc pl-5 text-xs space-y-1">
                        {pendingExams.map(ex => (
                            <li key={ex.id}>
                                {ex.description} - <strong>{EXAM_STATUS_NAMES[ex.status]}</strong>
                                {ex.appointmentDate && <span className="font-semibold ml-2"> (App. {new Date(ex.appointmentDate).toLocaleDateString('it-IT')})</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const PrintHandoversLayout: React.FC<PrintHandoversLayoutProps> = ({ patients }) => {
  const sortedPatients = [...patients].sort((a, b) => {
    const bedA = parseInt(a.bed.replace(/\D/g, ''), 10);
    const bedB = parseInt(b.bed.replace(/\D/g, ''), 10);
    return bedA - bedB;
  });

  const occupiedBeds = new Set(patients.map(p => p.bed));
  const freeBeds = ALL_BEDS.filter(b => !occupiedBeds.has(b));

  return (
    <div className="p-4 font-sans bg-white text-black">
      <header className="text-center mb-6 border-b-2 border-black pb-3">
        <h1 className="text-2xl font-extrabold">Report Consegne e Attività</h1>
        <p className="text-base">Report del {new Date().toLocaleString('it-IT')}</p>
      </header>
      <div className="columns-2 gap-4">
        {sortedPatients.map(patient => (
          <PatientHandovers key={patient.id} patient={patient} />
        ))}
      </div>

       {freeBeds.length > 0 && (
            <div className="mt-6 pt-4 border-t-2 border-black break-before-page sm:break-before-auto break-inside-avoid">
                <h2 className="text-xl font-extrabold mb-2">Letti Liberi ({freeBeds.length})</h2>
                <p className="text-base" style={{ columns: 4, columnGap: '1rem' }}>
                {freeBeds.join(', ')}
                </p>
            </div>
        )}
    </div>
  );
};

export default PrintHandoversLayout;