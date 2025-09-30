import React from 'react';
import { usePatients } from '../hooks/usePatients';
import { Patient, Handover } from '../types';

const HandoverItem: React.FC<{ handover: Handover; patient: Patient }> = ({ handover, patient }) => {
    const { updateHandover } = usePatients();

    const handleToggleComplete = () => {
        updateHandover(patient.id, handover.id, { isCompleted: !handover.isCompleted });
    };

    return (
        <div className={`p-3 rounded-lg text-base transition-colors ${handover.isCompleted ? 'bg-slate-200 dark:bg-slate-800 opacity-60' : 'bg-white dark:bg-slate-700/50'}`}>
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={!!handover.isCompleted}
                    onChange={handleToggleComplete}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label={`Segna come completata la consegna per ${patient.lastName}`}
                />
                <div className="flex-grow">
                    <p className={`text-slate-800 whitespace-pre-wrap dark:text-slate-200 ${handover.isCompleted ? 'line-through' : ''}`}>
                        <span className="font-bold">{patient.lastName} {patient.firstName} (Letto {patient.bed}): </span>
                        {handover.text}
                    </p>
                    <div className="text-sm text-slate-500 text-right mt-1 dark:text-slate-400">
                        {handover.scheduledAt ? (
                             <span>Programmata per: <span className="font-semibold">{new Date(handover.scheduledAt).toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></span>
                        ) : (
                             <span>Creata il: <span className="font-semibold">{new Date(handover.createdAt).toLocaleDateString('it-IT')}</span></span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DailyHandovers: React.FC = () => {
    const { activePatients } = usePatients();

    const pendingHandovers = activePatients.flatMap(patient => 
        patient.handovers
            .filter(h => !h.isCompleted)
            .map(h => ({ patient, handover: h }))
    ).sort((a, b) => {
        const timeA = a.handover.scheduledAt || a.handover.createdAt;
        const timeB = b.handover.scheduledAt || b.handover.createdAt;
        return timeA - timeB;
    });

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg dark:bg-slate-800">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Consegne Cliniche da Eseguire</h2>
            {pendingHandovers.length === 0 ? (
                <p className="text-center text-slate-500 py-4 dark:text-slate-400">Nessuna consegna in sospeso.</p>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {pendingHandovers.map(({ patient, handover }) => (
                        <HandoverItem key={handover.id} handover={handover} patient={patient} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DailyHandovers;
