import React, { useState } from 'react';
import { usePatients } from '../hooks/usePatients';
import { Patient, ExternalExam, ExamStatus } from '../types';
import { EXAM_STATUS_NAMES } from '../constants';
import ExamEditModal from './ExamEditModal';

const getStatusBadgeColor = (status: ExamStatus) => {
    switch(status) {
        case 'da_richiedere':
            return 'bg-amber-200 text-amber-800 dark:bg-amber-800/50 dark:text-amber-200';
        case 'prenotato':
            return 'bg-blue-200 text-blue-800 dark:bg-blue-800/50 dark:text-blue-200';
        default:
            return 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200';
    }
}

const DashboardReminders: React.FC = () => {
    const { activePatients } = usePatients();
    const [editingExam, setEditingExam] = useState<{ patient: Patient; exam: ExternalExam } | null>(null);

    const patientsWithPendingExams = activePatients
        .map(patient => {
            const pendingExams = patient.externalExams.filter(
                ex => ex.status !== 'effettuato'
            ).sort((a,b) => (a.appointmentDate || a.reminderDate || 'z').localeCompare(b.appointmentDate || b.reminderDate || 'z'));
            return { ...patient, pendingExams };
        })
        .filter(patient => patient.pendingExams.length > 0)
        .sort((a, b) => a.lastName.localeCompare(b.lastName));

    const handleEditExam = (patient: Patient, exam: ExternalExam) => {
        setEditingExam({ patient, exam });
    };

    const handleCloseModal = () => {
        setEditingExam(null);
    };

    return (
        <>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg animate-fade-in dark:bg-slate-800">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">Riepilogo Attività</h2>
                {patientsWithPendingExams.length === 0 ? (
                    <p className="text-center text-lg text-slate-500 py-8 dark:text-slate-400">Nessuna attività in sospeso.</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {patientsWithPendingExams.map(patient => (
                            <div key={patient.id} className="p-4 bg-slate-50 rounded-lg dark:bg-slate-700/50">
                                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">
                                    {patient.lastName} {patient.firstName} <span className="text-base font-medium text-slate-500 dark:text-slate-400">(Letto {patient.bed})</span>
                                </h3>
                                <div className="mt-2 space-y-2">
                                    {patient.pendingExams.map(exam => (
                                        <button 
                                            key={exam.id} 
                                            onClick={() => handleEditExam(patient, exam)}
                                            className="w-full text-left p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            <div className="flex flex-col items-start gap-y-2 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                   <span className="font-semibold text-base text-slate-800 dark:text-slate-200">{exam.description}</span>
                                                   {exam.appointmentDate && <p className="text-base font-bold text-blue-600 dark:text-blue-400">Prenotato per il: {new Date(exam.appointmentDate).toLocaleDateString('it-IT')}</p>}
                                                   {!exam.appointmentDate && exam.reminderDate && <p className="text-base text-amber-600 dark:text-amber-400">Promemoria: {new Date(exam.reminderDate).toLocaleDateString('it-IT')}</p>}
                                                </div>
                                                 <span className={`font-semibold px-2 py-0.5 rounded-full text-sm flex-shrink-0 ${getStatusBadgeColor(exam.status)}`}>{EXAM_STATUS_NAMES[exam.status]}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {editingExam && (
                <ExamEditModal
                    isOpen={!!editingExam}
                    onClose={handleCloseModal}
                    patient={editingExam.patient}
                    exam={editingExam.exam}
                />
            )}
        </>
    );
};

export default DashboardReminders;