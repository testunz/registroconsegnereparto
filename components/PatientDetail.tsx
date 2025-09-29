import React, { useState, useRef, useMemo } from 'react';
import { Patient, ExternalExam, ExamCategory, ExamStatus } from '../types';
import { SEVERITY_COLORS, SEVERITY_NAMES, EXAM_STATUS_NAMES, EXAM_CATEGORIES } from '../constants';
import PrintLayout from './PrintLayout';
import { usePatients } from '../hooks/usePatients';
import PatientForm from './PatientForm';
import { usePrint } from '../hooks/usePrint';

interface PatientDetailProps {
  patient: Patient;
  onClose: () => void;
}

type ActiveTab = 'clinica' | 'esami';

const DetailSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg ${className}`}>
        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4">{title}</h3>
        {children}
    </div>
);

const TabButton: React.FC<{label: string; isActive: boolean; onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}>
        {label}
    </button>
);

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onClose }) => {
  const { dischargePatient, addHandover, addExternalExam, updateExternalExam, deleteExternalExam } = usePatients();
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('clinica');
  const [isEditing, setIsEditing] = useState(false);
  
  const [newHandover, setNewHandover] = useState('');
  const [newExam, setNewExam] = useState({
    category: 'laboratorio' as ExamCategory,
    description: '',
    status: 'da_prenotare' as ExamStatus,
    appointmentDate: '',
    showInDashboardReminder: true,
  });

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrint(printRef);

  const handleDischarge = () => {
    if(window.confirm(`Sei sicuro di voler dimettere il paziente ${patient.lastName} ${patient.firstName}?`)) {
        dischargePatient(patient.id);
        onClose();
    }
  };

  const handleAddHandover = () => {
    if (newHandover.trim()) {
        addHandover(patient.id, newHandover.trim());
        setNewHandover('');
    }
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExam.description.trim()) {
        addExternalExam(patient.id, { ...newExam, appointmentDate: newExam.appointmentDate || null });
        setNewExam({ category: 'laboratorio', description: '', status: 'da_prenotare', appointmentDate: '', showInDashboardReminder: true });
    }
  }

  const handleUpdateExam = (examId: string, field: keyof ExternalExam, value: any) => {
    updateExternalExam(patient.id, examId, {[field]: value});
  };

  const isArchived = useMemo(() => patient.status === 'discharged', [patient.status]);

  return (
    <div className="space-y-6 animate-fade-in">
       <div className={`p-4 sm:p-6 bg-white rounded-xl shadow-lg border-l-8 ${SEVERITY_COLORS[patient.severity]}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800">{patient.lastName} {patient.firstName}</h2>
                    <p className="text-md text-slate-500 mt-1">
                        <span className="font-semibold">Letto:</span> {patient.bed || 'N/D'} | <span className="font-semibold">Ricovero:</span> {patient.admissionType} | <span className="font-bold">{SEVERITY_NAMES[patient.severity]}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        Paziente inserito il {new Date(patient.createdAt).toLocaleDateString('it-IT')}
                    </p>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"> &larr; Indietro </button>
                    <button onClick={handlePrint} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"> Stampa </button>
                    {!isArchived && (
                      <button onClick={handleDischarge} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"> Dimetti </button>
                    )}
                </div>
            </div>
        </div>
        
        <div className="bg-slate-200/50 p-1 rounded-lg flex space-x-1 max-w-xs">
            <TabButton label="Clinica" isActive={activeTab === 'clinica'} onClick={() => setActiveTab('clinica')} />
            <TabButton label="Esami e Attività" isActive={activeTab === 'esami'} onClick={() => setActiveTab('esami')} />
        </div>
      
        {activeTab === 'clinica' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <DetailSection title="Informazioni Cliniche">
                        <div className="space-y-4 text-sm text-slate-700">
                            <div><strong>Diagnosi Principale:</strong> <p className="whitespace-pre-wrap mt-1">{patient.mainDiagnosis || 'N/D'}</p></div>
                            <div><strong>Anamnesi:</strong> <p className="whitespace-pre-wrap mt-1">{patient.history || 'N/D'}</p></div>
                            <div><strong>Note Cliniche:</strong> <p className="whitespace-pre-wrap mt-1">{patient.clinicalNotes || 'N/D'}</p></div>
                        </div>
                    </DetailSection>
                    <DetailSection title="Consegne Cliniche">
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {patient.handovers.map(h => (
                                <div key={h.id} className="bg-slate-50 p-3 rounded-lg text-sm">
                                    <p className="text-slate-800 whitespace-pre-wrap">{h.text}</p>
                                    <p className="text-xs text-slate-400 text-right mt-1">Inserito il {new Date(h.createdAt).toLocaleString('it-IT')}</p>
                                </div>
                            ))}
                        </div>
                        {!isArchived && (
                            <div className="mt-4 flex space-x-2">
                                <textarea value={newHandover} onChange={e => setNewHandover(e.target.value)} placeholder="Aggiungi nuova consegna..." className="w-full p-2 border rounded-md text-sm" rows={2} spellCheck="false" autoComplete="off"/>
                                <button onClick={handleAddHandover} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md self-end hover:bg-blue-700">Aggiungi</button>
                            </div>
                        )}
                    </DetailSection>
                </div>
                <div className="md:col-span-1">
                    <DetailSection title="Dati Paziente">
                        <div className="space-y-2 text-sm text-slate-700">
                            <p><strong>Data Nascita:</strong> {new Date(patient.dateOfBirth).toLocaleDateString('it-IT') || 'N/D'}</p>
                            <p><strong>Data Ricovero:</strong> {new Date(patient.admissionDate).toLocaleDateString('it-IT') || 'N/D'}</p>
                            <p><strong>Sesso:</strong> {patient.gender === 'M' ? 'Uomo' : 'Donna'}</p>
                        </div>
                        {!isArchived && (
                            <div className="mt-6 pt-4 border-t border-slate-200">
                                <button onClick={() => setIsEditing(true)} className="w-full px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">Modifica Dati</button>
                            </div>
                        )}
                    </DetailSection>
                </div>
            </div>
        )}
        
        {activeTab === 'esami' && (
             <div>
                 <DetailSection title="Esami Esterni / Consulenze">
                    <div className="space-y-2">
                        {patient.externalExams.map(ex => (
                            <div key={ex.id} className="grid grid-cols-12 gap-x-4 gap-y-2 items-center text-sm p-3 rounded-lg bg-slate-50">
                                <div className="col-span-12 sm:col-span-4">
                                    <p className="font-semibold text-slate-800">{ex.description}</p>
                                    <p className="text-xs text-slate-500">{EXAM_CATEGORIES[ex.category]}</p>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <select value={ex.status} onChange={e => handleUpdateExam(ex.id, 'status', e.target.value)} className="w-full p-1.5 border rounded-md text-sm bg-white" disabled={isArchived}>
                                        {Object.entries(EXAM_STATUS_NAMES).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <input type="date" value={ex.appointmentDate || ''} onChange={e => handleUpdateExam(ex.id, 'appointmentDate', e.target.value)} className="w-full p-1 border rounded-md text-sm" disabled={isArchived}/>
                                </div>
                                <div className="col-span-12 sm:col-span-2 flex items-center justify-end space-x-2">
                                    <button onClick={() => deleteExternalExam(patient.id, ex.id)} className="text-red-500 hover:text-red-700 text-lg font-bold" disabled={isArchived}>&times;</button>
                                </div>
                                <div className="col-span-12 text-right">
                                     <p className="text-xs text-slate-400">Ultima modifica: {new Date(ex.updatedAt || ex.createdAt).toLocaleDateString('it-IT')}</p>
                                </div>
                            </div>
                        ))}
                         {patient.externalExams.length === 0 && <p className="text-center text-slate-500 py-4">Nessun esame inserito.</p>}
                    </div>
                    {!isArchived && (
                        <form onSubmit={handleAddExam} className="mt-6 p-4 border-t border-slate-200 grid grid-cols-12 gap-4 items-end">
                            <div className="col-span-12 sm:col-span-3"><label className="text-xs font-medium text-slate-600 block mb-1">Categoria</label><select value={newExam.category} onChange={e => setNewExam(p => ({...p, category: e.target.value as ExamCategory}))} className="w-full p-2 border rounded-md text-sm">{Object.entries(EXAM_CATEGORIES).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></div>
                            <div className="col-span-12 sm:col-span-5"><label className="text-xs font-medium text-slate-600 block mb-1">Descrizione</label><input type="text" value={newExam.description} onChange={e => setNewExam(p => ({...p, description: e.target.value}))} placeholder="Es. ECG, Rx Torace..." className="w-full p-2 border rounded-md text-sm" spellCheck="false" autoComplete="off" required/></div>
                            <div className="col-span-6 sm:col-span-2"><label className="text-xs font-medium text-slate-600 block mb-1">Data</label><input type="date" value={newExam.appointmentDate} onChange={e => setNewExam(p => ({...p, appointmentDate: e.target.value}))} className="w-full p-2 border rounded-md text-sm"/></div>
                            <div className="col-span-6 sm:col-span-2"><button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Aggiungi</button></div>
                        </form>
                    )}
                 </DetailSection>
            </div>
        )}
      {isEditing && <PatientForm isOpen={isEditing} onClose={() => setIsEditing(false)} patientToEdit={patient} />}
      <div className="hidden"><PrintLayout ref={printRef} patient={patient}/></div>
    </div>
  );
};

export default PatientDetail;