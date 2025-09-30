import React from 'react';
import { Patient } from '../types';
import { BEDS } from '../constants';

interface PrintDashboardProps {
  patients: Patient[];
}

const PrintBed: React.FC<{ patient?: Patient; bedNumber: string }> = ({ patient, bedNumber }) => {
    // FIX: Corrected typo 'completato' to 'effettuato' to match the ExamStatus type.
    const pendingExams = patient?.externalExams.filter(ex => ex.status !== 'effettuato') || [];

    return (
        <div className="border border-black p-2 break-inside-avoid-page flex flex-col">
            <div className="flex-grow min-h-[4rem]"> {/* Aggiunto min-height per consistenza */}
                <p className="text-sm font-bold border-b border-black pb-1 mb-1">Letto {bedNumber}</p>
                {patient ? (
                    <div>
                        <p className="text-sm font-bold truncate">{patient.lastName} {patient.firstName}</p>
                        {pendingExams.length > 0 && (
                            <div className="mt-1">
                                <p className="text-xs font-semibold uppercase">Esami:</p>
                                <ul className="list-disc pl-3 text-xs">
                                    {pendingExams.map(ex => (
                                        <li key={ex.id}>{ex.description}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-black">Libero</p>
                )}
            </div>
            {/* Sezione Note */}
            <div className="mt-2 pt-1 border-t border-dashed border-black">
                <p className="text-xs text-black font-semibold">Note:</p>
                {/* Spazio vuoto per scrivere */}
                <div style={{ height: '50px' }}></div>
            </div>
        </div>
    );
};

const PrintSection: React.FC<{ title: string; beds: string[]; patientsByBed: Map<string, Patient> }> = ({ title, beds, patientsByBed }) => (
    <div className="mb-6 break-inside-avoid">
        <h2 className="text-xl font-extrabold border-b-2 border-black pb-2 mb-4">{title}</h2>
        <div className="grid grid-cols-5 gap-2">
            {beds.map(bed => (
                <PrintBed key={bed} bedNumber={bed} patient={patientsByBed.get(bed)} />
            ))}
        </div>
    </div>
);

const PrintDashboard = React.forwardRef<HTMLDivElement, PrintDashboardProps>(({ patients }, ref) => {
    const patientsByBed = new Map(patients.map(p => [p.bed, p]));

    return (
        <div ref={ref} className="p-8 font-sans bg-white text-black">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-extrabold">Mappa Letti - Medicina Interna Soverato</h1>
                <p className="text-lg">Report del {new Date().toLocaleDateString('it-IT')} ore {new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</p>
            </header>
            
            <main>
                <PrintSection title="Uomini" beds={BEDS.men} patientsByBed={patientsByBed} />
                <PrintSection title="Donne" beds={BEDS.women} patientsByBed={patientsByBed} />
                <PrintSection title="Lungodegenza Uomini" beds={BEDS.ldu} patientsByBed={patientsByBed} />
                <PrintSection title="Lungodegenza Donne" beds={BEDS.ldd} patientsByBed={patientsByBed} />
            </main>
        </div>
    );
});

export default PrintDashboard;