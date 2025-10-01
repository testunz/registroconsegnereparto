import React, { useState, useRef, useMemo } from 'react';
import { Patient, ExternalExam, ExamCategory, ExamStatus, DischargeType } from '../types';
import { SEVERITY_COLORS, SEVERITY_NAMES, EXAM_STATUS_NAMES, EXAM_CATEGORIES, DISCHARGE_TYPE_NAMES } from '../constants';
import PrintLayout from './PrintLayout';
import { usePatients } from '../hooks/usePatients';
import PatientForm from './PatientForm';
import { usePrint } from '../hooks/usePrint';
import Modal from './Modal';
import ExamEditModal from './ExamEditModal';
import ConfirmationModal from './ConfirmationModal';
import SeverityEditModal from './SeverityEditModal';

interface PatientDetailProps {
  patient: Patient;
  onClose: () => void;
}

type ActiveTab = 'clinica' | 'esami';

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


const DetailSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg dark:bg-slate-800 ${className}`}>
        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4 dark:text-slate-200 dark:border-slate-700">{title}</h3>
        {children}
    </div>
);

const TabButton: React.FC<{label: string; isActive: boolean; onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-base font-semibold rounded-md transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
        {label}
    </button>
);

const calculateLengthOfStay = (admissionDate: string, status: 'active' | 'discharged', lastUpdated: number): number => {
    if (!admissionDate) return 0;
    const start = new Date(admissionDate);
    start.setHours(0, 0, 0, 0);

    const end = status === 'discharged' ? new Date(lastUpdated) : new Date();
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays + 1;
};

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onClose }) => {
  const { dischargePatient, addHandover, updateHandover, addExternalExam, deleteExternalExam } = usePatients();
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('clinica');
  const [isEditing, setIsEditing] = useState(false);
  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);
  const [isSeverityModalOpen, setIsSeverityModalOpen] = useState(false);
  const [dischargeType, setDischargeType] = useState<DischargeType>('domicilio');
  const [editingExam, setEditingExam] = useState<ExternalExam | null>(null);
  const [examToDelete, setExamToDelete] = useState<ExternalExam | null>(null);

  const [newHandover, setNewHandover] = useState('');
   const [newHandoverSchedule, setNewHandoverSchedule] = useState({ date: '', time: '' });
  const [newExam, setNewExam] = useState({
    category: 'laboratorio' as ExamCategory,
    description: '',
    status: 'da_richiedere' as ExamStatus,
    reminderDate: '',
    appointmentDate: '',
  });

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrint(printRef);

  const handleDischargeClick = () => {
      setIsDischargeModalOpen(true);
  }

  const handleConfirmDischarge = () => {
    dischargePatient(patient.id, dischargeType);
    setIsDischargeModalOpen(false);
    onClose();
  };

  const handleAddHandover = () => {
    if (newHandover.trim()) {
        let scheduledTimestamp: number | null = null;
        if (newHandoverSchedule.date) {
            const dateStr = `${newHandoverSchedule.date}${newHandoverSchedule.time ? `T${newHandoverSchedule.time}` : 'T00:00:00'}`;
            scheduledTimestamp = new Date(dateStr).getTime();
        }
        addHandover(patient.id, newHandover.trim(), scheduledTimestamp);
        setNewHandover('');
        setNewHandoverSchedule({ date: '', time: '' });
    }
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExam.description.trim()) {
        addExternalExam(patient.id, { 
            ...newExam, 
            reminderDate: newExam.reminderDate || null,
            appointmentDate: newExam.appointmentDate || null 
        });
        setNewExam({ category: 'laboratorio', description: '', status: 'da_richiedere', reminderDate: '', appointmentDate: '' });
    }
  }

  const handleSetAppointmentTomorrow = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          setNewExam(prev => ({ ...prev, appointmentDate: tomorrow.toISOString().slice(0,10) }));
      } else {
          setNewExam(prev => ({ ...prev, appointmentDate: '' }));
      }
  };

  const handleSetReminderTomorrow = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          setNewExam(prev => ({ ...prev, reminderDate: tomorrow.toISOString().slice(0,10) }));
      } else {
          setNewExam(prev => ({ ...prev, reminderDate: '' }));
      }
  };

  const handleConfirmDeleteExam = () => {
    if (examToDelete) {
      deleteExternalExam(patient.id, examToDelete.id);
      setExamToDelete(null);
    }
  };


  const isArchived = useMemo(() => patient.status === 'discharged', [patient.status]);
  const lengthOfStay = calculateLengthOfStay(patient.admissionDate, patient.status, patient.lastUpdated);

  return (
    <div className="space-y-6 animate-fade-in">
       <div 
        className={`p-4 sm:p-6 bg-white rounded-xl shadow-lg border-l-8 dark:bg-slate-800 ${SEVERITY_COLORS[patient.severity]}`}
       >
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div 
                  className={`flex-grow ${!isArchived ? 'cursor-pointer' : ''}`}
                  onClick={() => !isArchived && setIsSeverityModalOpen(true)}
                  title={!isArchived ? "Clicca per modificare la gravità" : ""}
                >
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                        {patient.lastName} {patient.firstName}
                        {patient.admissionType === 'lungodegenza' && <span className="text-2xl lg:text-3xl text-sky-600 dark:text-sky-400 font-semibold"> (LD)</span>}
                    </h2>
                    <p className="text-lg text-slate-500 mt-1 dark:text-slate-400">
                        <span className="font-semibold">Letto:</span> {patient.bed || 'N/D'} | <span className="font-semibold">Ricovero:</span> {patient.admissionType} | <span className="font-bold">{SEVERITY_NAMES[patient.severity]}</span>
                         {isArchived && patient.dischargeType && ` | Dimesso: ${DISCHARGE_TYPE_NAMES[patient.dischargeType]}`}
                    </p>
                    <p className="text-sm text-slate-400 mt-2 dark:text-slate-500">
                        Paziente inserito il {new Date(patient.createdAt).toLocaleDateString('it-IT')}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-base font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"> &larr; Indietro </button>
                    <button onClick={handlePrint} className="px-4 py-2 text-base font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"> Stampa </button>
                    {!isArchived && (
                      <button onClick={handleDischargeClick} className="px-4 py-2 text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"> Dimetti </button>
                    )}
                </div>
            </div>
        </div>
        
        <div className="bg-slate-200/50 p-1 rounded-lg flex space-x-1 max-w-xs dark:bg-slate-700/50">
            <TabButton label="Clinica" isActive={activeTab === 'clinica'} onClick={() => setActiveTab('clinica')} />
            <TabButton label="Esami e Attività" isActive={activeTab === 'esami'} onClick={() => setActiveTab('esami')} />
        </div>
      
        {activeTab === 'clinica' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <DetailSection title="Informazioni Cliniche">
                        <div className="space-y-4 text-base text-slate-700 dark:text-slate-300">
                            <div><strong>Diagnosi Principale:</strong> <p className="whitespace-pre-wrap mt-1">{patient.mainDiagnosis || 'N/D'}</p></div>
                            <div><strong>Anamnesi:</strong> <p className="whitespace-pre-wrap mt-1">{patient.history || 'N/D'}</p></div>
                            <div><strong>Note Cliniche:</strong> <p className="whitespace-pre-wrap mt-1">{patient.clinicalNotes || 'N/D'}</p></div>
                        </div>
                    </DetailSection>
                    <DetailSection title="Consegne Cliniche">
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {patient.handovers.sort((a,b) => (a.scheduledAt || a.createdAt) - (b.scheduledAt || b.createdAt)).map(h => (
                                <div key={h.id} className={`p-3 rounded-lg text-base transition-colors ${h.isCompleted ? 'bg-slate-200 dark:bg-slate-800 opacity-60' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
                                    <div className="flex items-start gap-3">
                                        {!isArchived && (
                                          <input 
                                            type="checkbox"
                                            checked={!!h.isCompleted}
                                            onChange={(e) => updateHandover(patient.id, h.id, { isCompleted: e.target.checked })}
                                            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                          />
                                        )}
                                        <div className="flex-grow">
                                          <p className={`text-slate-800 whitespace-pre-wrap dark:text-slate-200 ${h.isCompleted ? 'line-through' : ''}`}>{h.text}</p>
                                          <div className="text-sm text-slate-400 text-right mt-1 dark:text-slate-500">
                                              {h.scheduledAt && <span className="font-bold mr-2">Programmata per: {new Date(h.scheduledAt).toLocaleString('it-IT', {day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>}
                                              <span>Inserito il {new Date(h.createdAt).toLocaleString('it-IT', {day: '2-digit', month: '2-digit'})}</span>
                                          </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!isArchived && (
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <textarea value={newHandover} onChange={e => setNewHandover(e.target.value)} placeholder="Aggiungi nuova consegna..." className="w-full p-2 border rounded-md text-base bg-white border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200" rows={2} spellCheck="false" autoComplete="off"/>
                                <div className="mt-2 flex flex-wrap gap-4 items-end">
                                    <div className="flex-grow">
                                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Programma per (opzionale)</label>
                                        <div className="flex gap-2">
                                            <input type="date" value={newHandoverSchedule.date} onChange={e => setNewHandoverSchedule(p => ({...p, date: e.target.value}))} className="w-full p-2 border rounded-md text-base bg-white border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200"/>
                                            <input type="time" value={newHandoverSchedule.time} onChange={e => setNewHandoverSchedule(p => ({...p, time: e.target.value}))} className="w-full p-2 border rounded-md text-base bg-white border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200"/>
                                        </div>
                                    </div>
                                    <button onClick={handleAddHandover} className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 self-end">Aggiungi</button>
                                </div>
                            </div>
                        )}
                    </DetailSection>
                </div>
                <div className="md:col-span-1">
                    <DetailSection title="Dati Paziente">
                        <div className="space-y-2 text-base text-slate-700 dark:text-slate-300">
                            <p><strong>Data Nascita:</strong> {new Date(patient.dateOfBirth).toLocaleDateString('it-IT') || 'N/D'}</p>
                            <p><strong>Data Ricovero:</strong> {new Date(patient.admissionDate).toLocaleDateString('it-IT')} ({lengthOfStay})</p>
                            <p><strong>Sesso:</strong> {patient.gender === 'M' ? 'Uomo' : 'Donna'}</p>
                        </div>
                        {!isArchived && (
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button onClick={() => setIsEditing(true)} className="w-full px-4 py-2 text-base font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">Modifica Dati</button>
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
                         {patient.externalExams.sort((a,b) => (a.appointmentDate || a.reminderDate || 'z').localeCompare(b.appointmentDate || b.reminderDate || 'z')).map(ex => (
                            <div key={ex.id} onClick={() => !isArchived && setEditingExam(ex)} className={`p-3 rounded-lg group transition-colors ${!isArchived ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700' : ''} bg-slate-50 dark:bg-slate-700/50`}>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{ex.description}</p>
                                        {ex.notes && (
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 pl-4 border-l-2 border-slate-200 dark:border-slate-600 italic">
                                                {ex.notes}
                                            </p>
                                        )}
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{EXAM_CATEGORIES[ex.category]}</p>
                                        
                                        <div className="mt-2 text-sm space-y-1">
                                            {ex.appointmentDate && <p className="font-bold text-blue-600 dark:text-blue-400">Appuntamento: {new Date(ex.appointmentDate).toLocaleDateString('it-IT')}</p>}
                                            {!ex.appointmentDate && ex.reminderDate && <p className="text-amber-600 dark:text-amber-400">Promemoria: {new Date(ex.reminderDate).toLocaleDateString('it-IT')}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center flex-shrink-0 gap-x-2">
                                         <span className={`font-semibold px-2 py-0.5 rounded-full text-sm ${getStatusBadgeColor(ex.status)}`}>{EXAM_STATUS_NAMES[ex.status]}</span>
                                         {!isArchived && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setExamToDelete(ex); }} 
                                                className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Elimina Esame"
                                            >
                                                &times;
                                            </button>
                                         )}
                                    </div>
                                </div>
                            </div>
                        ))}
                         {patient.externalExams.length === 0 && <p className="text-center text-slate-500 py-4 dark:text-slate-400">Nessun esame inserito.</p>}
                    </div>
                    {!isArchived && (
                        <form onSubmit={handleAddExam} className="mt-6 p-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-3"><label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Categoria</label><select value={newExam.category} onChange={e => setNewExam(p => ({...p, category: e.target.value as ExamCategory}))} className="w-full p-2 border rounded-md text-base bg-white border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200">{Object.entries(EXAM_CATEGORIES).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></div>
                            <div className="md:col-span-4"><label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Descrizione</label><input type="text" value={newExam.description} onChange={e => setNewExam(p => ({...p, description: e.target.value}))} placeholder="Es. ECG, Rx Torace..." className="w-full p-2 border rounded-md text-base bg-white border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200" spellCheck="false" autoComplete="off" required/></div>
                            <div className="md:col-span-2"><label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Data Promemoria</label><input type="date" value={newExam.reminderDate} onChange={e => setNewExam(p => ({...p, reminderDate: e.target.value}))} className="w-full p-2 border rounded-md text-base bg-white border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200"/><div className="flex items-center mt-1"><input type="checkbox" id="setReminderTomorrow" onChange={handleSetReminderTomorrow} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><label htmlFor="setReminderTomorrow" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Domani</label></div></div>
                            <div className="md:col-span-2"><label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Data Appuntamento</label><input type="date" value={newExam.appointmentDate} onChange={e => setNewExam(p => ({...p, appointmentDate: e.target.value}))} className="w-full p-2 border rounded-md text-base bg-white border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200"/><div className="flex items-center mt-1"><input type="checkbox" id="setTomorrow" onChange={handleSetAppointmentTomorrow} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><label htmlFor="setTomorrow" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Domani</label></div></div>
                            <div className="md:col-span-1"><button type="submit" className="w-full px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Aggiungi</button></div>
                        </form>
                    )}
                 </DetailSection>
            </div>
        )}

      <Modal isOpen={isDischargeModalOpen} onClose={() => setIsDischargeModalOpen(false)} title="Conferma Dimissione">
        <div className="space-y-6">
            <p className="text-lg text-slate-600 dark:text-slate-300">
            Sei sicuro di voler dimettere il paziente <strong>{patient.lastName} {patient.firstName}{patient.admissionType === 'lungodegenza' && ' (LD)'}</strong>?
            </p>
            <div>
            <label htmlFor="dischargeType" className="block text-base font-medium text-slate-700 mb-1 dark:text-slate-300">Esito della dimissione</label>
            <select 
                id="dischargeType" 
                name="dischargeType" 
                value={dischargeType} 
                onChange={(e) => setDischargeType(e.target.value as DischargeType)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
            >
                {Object.entries(DISCHARGE_TYPE_NAMES).map(([key, value]) => (
                <option key={key} value={key as DischargeType}>{value}</option>
                ))}
            </select>
            </div>
            <div className="flex justify-end pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsDischargeModalOpen(false)} className="px-4 py-2 text-base font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500">Annulla</button>
            <button type="button" onClick={handleConfirmDischarge} className="px-4 py-2 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Conferma Dimissione</button>
            </div>
        </div>
      </Modal>

      {editingExam && (
        <ExamEditModal
            isOpen={!!editingExam}
            onClose={() => setEditingExam(null)}
            patient={patient}
            exam={editingExam}
        />
      )}

      <ConfirmationModal
        isOpen={!!examToDelete}
        onClose={() => setExamToDelete(null)}
        onConfirm={handleConfirmDeleteExam}
        title="Conferma Eliminazione Esame"
        message={`Sei sicuro di voler eliminare l'esame "${examToDelete?.description}"?`}
        confirmButtonText="Sì, elimina"
      />
      
      <SeverityEditModal 
        isOpen={isSeverityModalOpen}
        onClose={() => setIsSeverityModalOpen(false)}
        patient={patient}
      />

      {isEditing && <PatientForm isOpen={isEditing} onClose={() => setIsEditing(false)} patientToEdit={patient} />}
      <div className="hidden"><PrintLayout ref={printRef} patient={patient}/></div>
    </div>
  );
};

export default PatientDetail;