import React from 'react';
import { usePatients } from '../hooks/usePatients';
import { Patient, ExternalExam } from '../types';

interface TodayExam {
    patient: Patient;
    exam: ExternalExam;
}

// Funzione per ottenere la data di oggi come stringa 'YYYY-MM-DD'
const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const TodayExamsReminder: React.FC<{ onSelectPatient: (patientId: string) => void }> = ({ onSelectPatient }) => {
    const { activePatients } = usePatients();

    const todayExams = React.useMemo(() => {
        const todayString = getTodayDateString();
        const exams: TodayExam[] = [];

        activePatients.forEach(patient => {
            patient.externalExams.forEach(exam => {
                if (exam.status === 'prenotato' && exam.appointmentDate === todayString) {
                    exams.push({ patient, exam });
                }
            });
        });

        return exams.sort((a, b) => a.patient.lastName.localeCompare(b.patient.lastName));
    }, [activePatients]);

    if (todayExams.length === 0) {
        return null;
    }

    return (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-lg dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-600">
            <h2 className="text-xl font-bold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Esami Prenotati per Oggi
            </h2>
            <ul className="space-y-2 pl-8">
                {todayExams.map(({ patient, exam }) => (
                    <li key={exam.id}>
                        <button 
                            onClick={() => onSelectPatient(patient.id)}
                            className="text-left w-full hover:bg-blue-200/50 dark:hover:bg-blue-800/50 p-1 rounded transition-colors"
                        >
                            <span className="font-bold">{patient.lastName} {patient.firstName} (Letto {patient.bed}):</span> {exam.description}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodayExamsReminder;
