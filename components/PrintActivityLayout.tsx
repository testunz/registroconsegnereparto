import React from 'react';
import { Patient, ExamCategory, ExternalExam } from '../types';
import { EXAM_CATEGORIES, EXAM_STATUS_NAMES } from '../constants';

interface Stats {
    menOccupied: number;
    menTotal: number;
    womenOccupied: number;
    womenTotal: number;
    ldOccupied: number;
    ldTotal: number;
    totalOccupied: number;
    totalBeds: number;
    ordinarioCount: number;
    lungodegenzaCount: number;
}

interface PatientWithPendingExams extends Patient {
    pendingExams: ExternalExam[];
}

interface PrintActivityLayoutProps {
  patientsWithPendingExams: PatientWithPendingExams[];
  activeFilter: ExamCategory | 'tutto';
  dateFilter: string | null;
  stats: Stats;
}

const PrintStat: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div style={{ textAlign: 'center', padding: '0 8px' }}>
        <p style={{ fontSize: '10px', margin: 0, fontWeight: 'bold', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ fontSize: '14px', margin: 0, fontWeight: 'bold' }}>{value}</p>
    </div>
);


const PrintActivityLayout = React.forwardRef<HTMLDivElement, PrintActivityLayoutProps>(({ patientsWithPendingExams, activeFilter, dateFilter, stats }, ref) => {
    
    const filterText = activeFilter === 'tutto' ? 'Tutte le Attività' : EXAM_CATEGORIES[activeFilter];

    return (
        <div ref={ref} className="p-4 font-sans bg-white text-black">
            <header className="text-center mb-6 border-b-2 border-black pb-3">
                <h1 className="text-2xl font-extrabold">Report Attività in Sospeso</h1>
                <p className="text-base">
                    Filtro Applicato: <span className="font-bold">{filterText}</span>
                    {dateFilter && (
                        <> | Data: <span className="font-bold">{new Date(dateFilter).toLocaleDateString('it-IT')}</span></>
                    )}
                </p>
                <p className="text-sm">Report generato il {new Date().toLocaleString('it-IT')}</p>
            </header>

            <section className="mb-4 p-2 border border-black">
                 <h2 className="text-center text-lg font-bold mb-2">Situazione Posti Letto</h2>
                 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                    <PrintStat label="Uomini" value={`${stats.menOccupied}/${stats.menTotal}`} />
                    <PrintStat label="Donne" value={`${stats.womenOccupied}/${stats.womenTotal}`} />
                    <PrintStat label="Stanze LD" value={`${stats.ldOccupied}/${stats.ldTotal}`} />
                    <div style={{ borderLeft: '1px solid black', height: '30px' }}></div>
                    <PrintStat label="Ordinario" value={`${stats.ordinarioCount}`} />
                    <PrintStat label="Lungodegenza" value={`${stats.lungodegenzaCount}`} />
                    <div style={{ borderLeft: '1px solid black', height: '30px' }}></div>
                    <PrintStat label="Totale" value={`${stats.totalOccupied}/${stats.totalBeds}`} />
                 </div>
            </section>

            <section>
                 <table className="w-full text-sm border-collapse">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="border border-black p-2 text-left w-16">Letto</th>
                            <th className="border border-black p-2 text-left">Paziente</th>
                            <th className="border border-black p-2 text-left">Descrizione Attività</th>
                            <th className="border border-black p-2 text-left w-40">Dettagli Scadenza</th>
                            <th className="border border-black p-2 text-left w-28">Stato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientsWithPendingExams.length > 0 ? patientsWithPendingExams.map(patient => (
                            <React.Fragment key={patient.id}>
                                {patient.pendingExams.map((exam, index) => (
                                    <tr key={exam.id} className="break-inside-avoid">
                                        {index === 0 ? (
                                             <td className="border border-black p-2 font-bold align-top text-center" rowSpan={patient.pendingExams.length}>
                                                 {patient.bed}
                                             </td>
                                        ) : null}
                                        {index === 0 ? (
                                             <td className="border border-black p-2 font-semibold align-top" rowSpan={patient.pendingExams.length}>
                                                 {patient.lastName} {patient.firstName}
                                                 {patient.admissionType === 'lungodegenza' && ' (LD)'}
                                             </td>
                                        ) : null}
                                        <td className="border border-black p-2 align-top">
                                            {exam.description}
                                            {exam.notes && (
                                                <p className="text-xs italic pt-1 mt-1 border-t border-dashed border-gray-400">
                                                    {exam.notes}
                                                </p>
                                            )}
                                        </td>
                                        <td className="border border-black p-2 align-top">
                                            {exam.appointmentDate && <p className="font-bold">Appuntamento: {new Date(exam.appointmentDate).toLocaleDateString('it-IT')}</p>}
                                            {!exam.appointmentDate && exam.reminderDate && <p>Promemoria: {new Date(exam.reminderDate).toLocaleDateString('it-IT')}</p>}
                                        </td>
                                        <td className="border border-black p-2 align-top font-bold">{EXAM_STATUS_NAMES[exam.status]}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center border border-black p-4 text-gray-500">
                                    Nessuna attività in sospeso per i filtri selezionati.
                                </td>
                            </tr>
                        )}
                    </tbody>
                 </table>
            </section>
        </div>
    );
});

export default PrintActivityLayout;