import React, { useState, useRef, useMemo } from 'react';
import { usePatients } from '../hooks/usePatients';
import { Patient, ExternalExam, ExamStatus, ExamCategory, Severity } from '../types';
import { EXAM_STATUS_NAMES, EXAM_CATEGORIES, BEDS } from '../constants';
import ExamEditModal from './ExamEditModal';
import { usePrint } from '../hooks/usePrint';
import PrintActivityLayout from './PrintActivityLayout';

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
    const [activeFilter, setActiveFilter] = useState<ExamCategory | 'tutto'>('tutto');
    const [dateFilter, setDateFilter] = useState<string | null>(null);

    // Print logic
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = usePrint(printRef);

    const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

    const onPrintClick = () => {
        const filterText = activeFilter === 'tutto' ? 'Tutte' : EXAM_CATEGORIES[activeFilter];
        const dateText = dateFilter ? ` - ${new Date(dateFilter).toLocaleDateString('it-IT')}` : '';
        handlePrint({ documentTitle: `Report Attività - ${filterText}${dateText}`, layout: 'portrait' });
    };

    const patientsWithPendingExams = useMemo(() => activePatients
        .map(patient => {
            const pendingExams = patient.externalExams.filter(
                ex => {
                    const categoryMatch = activeFilter === 'tutto' || ex.category === activeFilter;
                    const isPending = ex.status !== 'effettuato';
                    
                    if (!dateFilter) {
                        return isPending && categoryMatch;
                    }

                    const dateMatch = ex.appointmentDate === dateFilter || ex.reminderDate === dateFilter;
                    return isPending && categoryMatch && dateMatch;
                }
            ).sort((a,b) => (a.appointmentDate || a.reminderDate || 'z').localeCompare(b.appointmentDate || b.reminderDate || 'z'));
            
            return { ...patient, pendingExams };
        })
        .filter(patient => patient.pendingExams.length > 0)
        .sort((a, b) => {
             // Sort by bed number numerically
            const bedA = parseInt(a.bed.replace(/\D/g, ''));
            const bedB = parseInt(b.bed.replace(/\D/g, ''));
            return bedA - bedB;
        }), [activePatients, activeFilter, dateFilter]);
    
    // Stats logic copied from BedOccupancyStats.tsx for printing
    const stats = useMemo(() => {
        const menTotal = BEDS.men.length;
        const womenTotal = BEDS.women.length;
        const ldTotal = BEDS.ldu.length + BEDS.ldd.length;

        const menOccupied = activePatients.filter(p => BEDS.men.includes(p.bed)).length;
        const womenOccupied = activePatients.filter(p => BEDS.women.includes(p.bed)).length;
        const ldOccupied = activePatients.filter(p => BEDS.ldu.includes(p.bed) || BEDS.ldd.includes(p.bed)).length;
        const totalOccupied = menOccupied + womenOccupied + ldOccupied;
        const totalBeds = menTotal + womenTotal + ldTotal;
        const ordinarioCount = activePatients.filter(p => p.admissionType === 'ordinario').length;
        const lungodegenzaCount = activePatients.filter(p => p.admissionType === 'lungodegenza').length;

        return { menTotal, womenTotal, ldTotal, menOccupied, womenOccupied, ldOccupied, totalOccupied, totalBeds, ordinarioCount, lungodegenzaCount };
    }, [activePatients]);


    const handleEditExam = (patient: Patient, exam: ExternalExam) => {
        setEditingExam({ patient, exam });
    };

    const handleCloseModal = () => {
        setEditingExam(null);
    };

    const filterOptions: { key: ExamCategory | 'tutto'; value: string }[] = [
        { key: 'tutto', value: 'Tutto' },
        ...Object.entries(EXAM_CATEGORIES).map(([key, value]) => ({ key: key as ExamCategory, value })),
    ];

    return (
        <>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg animate-fade-in dark:bg-slate-800">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Riepilogo Attività</h2>
                     <div className="flex items-center flex-wrap gap-2">
                        <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
                            {filterOptions.map(({ key, value }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveFilter(key)}
                                    className={`px-3 py-1 text-base font-semibold rounded-md transition-colors ${
                                        activeFilter === key
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600'
                                    }`}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                         <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
                            <button onClick={() => setDateFilter(null)} className={`px-3 py-1 text-base font-semibold rounded-md transition-colors ${!dateFilter ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600'}`}>Tutte</button>
                            <button onClick={() => setDateFilter(today)} className={`px-3 py-1 text-base font-semibold rounded-md transition-colors ${dateFilter === today ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600'}`}>Oggi</button>
                            <div className="relative">
                                <input type="date" id="date-picker" onChange={e => setDateFilter(e.target.value || null)} value={dateFilter || ''} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                                <label htmlFor="date-picker" className={`px-3 py-1 text-base font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${dateFilter && dateFilter !== today ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600'}`}>
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                                     {dateFilter && dateFilter !== today ? new Date(dateFilter).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }) : ''}
                                </label>
                            </div>
                        </div>
                        <button 
                            onClick={onPrintClick} 
                            title="Stampa Report Attività" 
                            className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors dark:text-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>

                {patientsWithPendingExams.length === 0 ? (
                    <p className="text-center text-lg text-slate-500 py-8 dark:text-slate-400">Nessuna attività in sospeso per i filtri selezionati.</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {patientsWithPendingExams.map(patient => (
                            <div key={patient.id} className="p-4 bg-slate-50 rounded-lg dark:bg-slate-700/50">
                                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">
                                    {patient.lastName} {patient.firstName}
                                    {patient.admissionType === 'lungodegenza' && <span className="text-sky-600 dark:text-sky-400"> (LD)</span>}
                                    {' '}<span className="text-base font-medium text-slate-500 dark:text-slate-400">(Letto {patient.bed})</span>
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
                                                    {exam.notes && (
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">
                                                            Nota: {exam.notes}
                                                        </p>
                                                    )}
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
            <div className="hidden">
                <PrintActivityLayout 
                    ref={printRef} 
                    patientsWithPendingExams={patientsWithPendingExams}
                    activeFilter={activeFilter}
                    dateFilter={dateFilter}
                    stats={stats}
                />
            </div>
        </>
    );
};

export default DashboardReminders;