import React from 'react';
import { usePatients } from '../hooks/usePatients';
// Fix: Import ExamStatus from types.ts, not constants.ts
import { EXAM_STATUS_NAMES } from '../constants';
import { ExamStatus } from '../types';

const isPast = (dateStr: string | null) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
};

const getStatusBadgeColor = (status: ExamStatus) => {
    switch(status) {
        case 'da_richiedere':
            return 'bg-amber-200 text-amber-800 dark:bg-amber-800/50 dark:text-amber-200';
        case 'prenotato':
            return 'bg-blue-200 text-blue-800 dark:bg-blue-800/50 dark:text-blue-200';
        case 'effettuato':
             return 'bg-green-200 text-green-800 dark:bg-green-800/50 dark:text-green-200';
        default:
            return 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200';
    }
}

const TodayAppointments: React.FC = () => {
    const { activePatients } = usePatients();

    const pendingExams = activePatients.flatMap(patient => 
        patient.externalExams
            .filter(ex => ex.status !== 'effettuato' || !isPast(ex.appointmentDate))
            .map(ex => ({ patient, exam: ex }))
    ).sort((a, b) => {
        const dateA = a.exam.appointmentDate || a.exam.reminderDate || '9999-12-31';
        const dateB = b.exam.appointmentDate || b.exam.reminderDate || '9999-12-31';
        
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        return a.patient.lastName.localeCompare(b.patient.lastName);
    });

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg dark:bg-slate-800">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Riepilogo Esami e Consulenze</h2>
            {pendingExams.length === 0 ? (
                <p className="text-center text-slate-500 py-4 dark:text-slate-400">Nessun esame da gestire.</p>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {pendingExams.map(({ patient, exam }) => (
                         <div key={exam.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex justify-between items-start">
                            <div className="flex-grow mr-2">
                               <p className="font-bold text-slate-800 dark:text-slate-100">{patient.lastName} {patient.firstName} (Letto {patient.bed})</p>
                               <p className="text-base text-slate-600 dark:text-slate-300">{exam.description}</p>
                               {exam.appointmentDate && (
                                   <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                       Appuntamento: {new Date(exam.appointmentDate).toLocaleDateString('it-IT')}
                                   </p>
                               )}
                               {!exam.appointmentDate && exam.reminderDate && (
                                   <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                                       Promemoria: {new Date(exam.reminderDate).toLocaleDateString('it-IT')}
                                   </p>
                               )}
                            </div>
                            <span className={`font-semibold px-2 py-0.5 rounded-full text-sm flex-shrink-0 ${getStatusBadgeColor(exam.status)}`}>{EXAM_STATUS_NAMES[exam.status]}</span>
                         </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TodayAppointments;