import React from 'react';
import { Patient } from '../types';
import { EXAM_STATUS_NAMES, ALL_BEDS } from '../constants';

interface PrintHandoversLayoutProps {
  patients: Patient[];
}

const PrintHandoversLayout: React.FC<PrintHandoversLayoutProps> = ({ patients }) => {
  const allPendingHandovers = patients.flatMap(patient =>
    patient.handovers
      .filter(h => !h.isCompleted)
      .map(handover => ({ patient, handover }))
  ).sort((a, b) => {
    const timeA = a.handover.scheduledAt || a.handover.createdAt;
    const timeB = b.handover.scheduledAt || b.handover.createdAt;
    return timeA - timeB;
  });

  const allPendingExams = patients.flatMap(patient =>
    patient.externalExams
      .filter(ex => ex.status !== 'effettuato')
      .map(exam => ({ patient, exam }))
  ).sort((a, b) => {
    const dateA = a.exam.appointmentDate || a.exam.reminderDate || '9999-12-31';
    const dateB = b.exam.appointmentDate || b.exam.reminderDate || '9999-12-31';
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    const bedA = parseInt(a.patient.bed.replace(/\D/g, ''));
    const bedB = parseInt(b.patient.bed.replace(/\D/g, ''));
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

      {/* Sezione Consegne */}
      <section className="mb-8">
        <h2 className="text-xl font-bold border-b border-black pb-1 mb-2">Consegne Cliniche da Eseguire</h2>
        {allPendingHandovers.length > 0 ? (
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-black p-1 text-left w-12">Letto</th>
                <th className="border border-black p-1 text-left w-40">Paziente</th>
                <th className="border border-black p-1 text-left">Descrizione Consegna</th>
                <th className="border border-black p-1 text-left w-40">Scadenza</th>
              </tr>
            </thead>
            <tbody>
              {allPendingHandovers.map(({ patient, handover }) => (
                <tr key={handover.id} className="break-inside-avoid">
                  <td className="border border-black p-1 font-bold text-center">{patient.bed}</td>
                  <td className="border border-black p-1 font-semibold">
                    {patient.lastName} {patient.firstName}
                    {patient.admissionType === 'lungodegenza' && ' (LD)'}
                  </td>
                  <td className="border border-black p-1">{handover.text}</td>
                  <td className="border border-black p-1">
                    {handover.scheduledAt 
                      ? `Programmata: ${new Date(handover.scheduledAt).toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}`
                      : `Inserita: ${new Date(handover.createdAt).toLocaleDateString('it-IT')}`
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 py-2">Nessuna consegna clinica in sospeso.</p>
        )}
      </section>

      {/* Sezione Attività (Esami/Consulenze) */}
      <section className="mb-8 break-before-page">
        <h2 className="text-xl font-bold border-b border-black pb-1 mb-2">Esami e Consulenze in Sospeso</h2>
        {allPendingExams.length > 0 ? (
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-black p-1 text-left w-12">Letto</th>
                <th className="border border-black p-1 text-left w-40">Paziente</th>
                <th className="border border-black p-1 text-left">Descrizione Esame/Consulenza</th>
                <th className="border border-black p-1 text-left w-40">Dettagli Scadenza</th>
                <th className="border border-black p-1 text-left w-24">Stato</th>
              </tr>
            </thead>
            <tbody>
              {allPendingExams.map(({ patient, exam }) => (
                <tr key={exam.id} className="break-inside-avoid">
                  <td className="border border-black p-1 font-bold text-center">{patient.bed}</td>
                  <td className="border border-black p-1 font-semibold">
                    {patient.lastName} {patient.firstName}
                    {patient.admissionType === 'lungodegenza' && ' (LD)'}
                  </td>
                  <td className="border border-black p-1">{exam.description}</td>
                  <td className="border border-black p-1">
                    {exam.appointmentDate && <span className="font-bold">Appuntamento: {new Date(exam.appointmentDate).toLocaleDateString('it-IT')}</span>}
                    {!exam.appointmentDate && exam.reminderDate && <span>Promemoria: {new Date(exam.reminderDate).toLocaleDateString('it-IT')}</span>}
                  </td>
                  <td className="border border-black p-1 font-bold">{EXAM_STATUS_NAMES[exam.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 py-2">Nessun esame o consulenza in sospeso.</p>
        )}
      </section>

      {/* Sezione Letti Liberi */}
      {freeBeds.length > 0 && (
        <section className="pt-4 border-t-2 border-black break-inside-avoid">
          <h2 className="text-lg font-extrabold mb-2">Letti Liberi ({freeBeds.length})</h2>
          <p className="text-base" style={{ columns: 5, columnGap: '1rem' }}>
            {freeBeds.join(', ')}
          </p>
        </section>
      )}
    </div>
  );
};

export default PrintHandoversLayout;