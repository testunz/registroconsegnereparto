import React from 'react';
import { Patient } from '../types';
import { EXAM_CATEGORIES, EXAM_STATUS_NAMES } from '../constants';

interface PrintLayoutProps {
  patient: Patient;
}

const InfoItem: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
    <div className="mb-3">
        <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">{label}</p>
        <p className="text-sm text-black font-medium">{value || 'N/D'}</p>
    </div>
);

const PrintLayout = React.forwardRef<HTMLDivElement, PrintLayoutProps>(({ patient }, ref) => {
    return (
        <div ref={ref} className="p-10 font-sans bg-white text-black">
            <header className="mb-8 border-b-2 border-black pb-4">
                <h1 className="text-3xl font-extrabold">Report Clinico Paziente</h1>
                <h2 className="text-2xl font-semibold mt-1">{patient.lastName} {patient.firstName}</h2>
            </header>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-1 border-r border-gray-300 pr-6">
                    <h3 className="text-lg font-bold border-b mb-4 pb-2">Dati Anagrafici e Ricovero</h3>
                    <InfoItem label="Letto" value={patient.bed} />
                    <InfoItem label="Regime Ricovero" value={patient.admissionType} />
                    <InfoItem label="Data Ricovero" value={new Date(patient.admissionDate).toLocaleDateString('it-IT')} />
                    <InfoItem label="Data Nascita" value={new Date(patient.dateOfBirth).toLocaleDateString('it-IT')} />
                    <InfoItem label="Sesso" value={patient.gender === 'M' ? 'Uomo' : 'Donna'} />
                </div>
                <div className="col-span-2">
                    <h3 className="text-lg font-bold border-b mb-4 pb-2">Informazioni Cliniche</h3>
                    <div className="mb-6">
                        <h4 className="text-md font-bold mb-1">Diagnosi Principale:</h4>
                        <p className="text-sm whitespace-pre-wrap">{patient.mainDiagnosis || 'N/D'}</p>
                    </div>
                    <div className="mb-6">
                        <h4 className="text-md font-bold mb-1">Note Cliniche e Consegne:</h4>
                        <p className="text-sm whitespace-pre-wrap">{patient.clinicalNotes || 'N/D'}</p>
                        {patient.handovers.map(h => (
                           <p key={h.id} className="text-sm whitespace-pre-wrap border-t mt-2 pt-2">[{new Date(h.createdAt).toLocaleString('it-IT')}] {h.text}</p>
                        ))}
                    </div>
                     <div>
                        <h4 className="text-md font-bold mb-2">Esami e Consulenze</h4>
                        {patient.externalExams.length > 0 ? (
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {patient.externalExams.map(ex => (
                                    <li key={ex.id}>
                                        <span className="font-semibold">{ex.description}</span> ({EXAM_CATEGORIES[ex.category]}) - <strong>{EXAM_STATUS_NAMES[ex.status]}</strong>
                                        {ex.appointmentDate && ` il ${new Date(ex.appointmentDate).toLocaleDateString('it-IT')}`}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm italic">Nessun esame o consulenza in programma.</p>
                        )}
                    </div>
                </div>
            </div>
            <footer className="mt-12 pt-4 text-xs text-center text-gray-500 border-t">
                Registro Consegne Medicina Interna Soverato - Report generato il {new Date().toLocaleString('it-IT')}
            </footer>
        </div>
    );
});

export default PrintLayout;