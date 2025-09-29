import React, { useState, useEffect } from 'react';
import { Patient, AdmissionType, Gender, Severity } from '../types';
import { ALL_BEDS } from '../constants';
import Modal from './Modal';
import { usePatients } from '../hooks/usePatients';

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientToEdit?: Patient;
  initialBed?: string;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> & { label: string; children?: React.ReactNode; }> = 
  ({ label, name, children, ...props }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children ? (
        <select id={name} name={name} {...props} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          {children}
        </select>
      ) : (
        <input 
          id={name} 
          name={name} 
          {...props}
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
          autoComplete="off"
          spellCheck="false"
        />
      )}
    </div>
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <textarea 
      id={name} 
      name={name} 
      {...props}
      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      autoComplete="off" spellCheck="false"
    ></textarea>
  </div>
);

const PatientForm: React.FC<PatientFormProps> = ({ isOpen, onClose, patientToEdit, initialBed }) => {
  const { addPatient, updatePatient } = usePatients();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dateOfBirth: '',
    admissionDate: new Date().toISOString().slice(0, 10),
    gender: 'M' as Gender, bed: initialBed || '',
    admissionType: 'ordinario' as AdmissionType,
    mainDiagnosis: '', history: '', clinicalNotes: '',
    severity: 'verde' as Severity,
  });

  useEffect(() => {
    if (patientToEdit) {
      const { createdAt, lastUpdated, status, handovers, externalExams, id, ...editableData } = patientToEdit;
      setFormData(editableData);
    }
    else if (initialBed) {
      setFormData(prev => ({...prev, bed: initialBed}));
    } else {
       setFormData({
        firstName: '', lastName: '', dateOfBirth: '',
        admissionDate: new Date().toISOString().slice(0, 10),
        gender: 'M' as Gender, bed: initialBed || '',
        admissionType: 'ordinario' as AdmissionType,
        mainDiagnosis: '', history: '', clinicalNotes: '',
        severity: 'verde' as Severity,
      });
    }
  }, [patientToEdit, initialBed, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.bed) {
      alert("Nome, Cognome e Letto sono campi obbligatori.");
      return;
    }

    if(patientToEdit) {
        updatePatient(patientToEdit.id, formData);
    } else {
        addPatient(formData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={patientToEdit ? "Modifica Paziente" : "Nuovo Paziente"} size="2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Nome" name="firstName" value={formData.firstName} onChange={handleChange} required />
            <InputField label="Cognome" name="lastName" value={formData.lastName} onChange={handleChange} required />
            <InputField label="Data di Nascita" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required/>
            <InputField label="Data di Ricovero" name="admissionDate" type="date" value={formData.admissionDate} onChange={handleChange} required/>
            <InputField label="Sesso" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="M">Uomo</option><option value="F">Donna</option>
            </InputField>
            <InputField label="Letto" name="bed" value={formData.bed} onChange={handleChange} required>
                <option value="">Seleziona un letto</option>
                {ALL_BEDS.map(b => <option key={b} value={b}>{b}</option>)}
            </InputField>
            <InputField label="Tipo Ricovero" name="admissionType" value={formData.admissionType} onChange={handleChange}>
                <option value="ordinario">Ordinario</option><option value="lungodegenza">Lungodegenza</option>
            </InputField>
            <InputField label="Codice Gravità" name="severity" value={formData.severity} onChange={handleChange}>
                <option value="verde">Verde (Stabile)</option><option value="giallo">Giallo (Moderato)</option><option value="rosso">Rosso (Critico)</option>
            </InputField>
        </div>
        <InputField label="Diagnosi Principale" name="mainDiagnosis" value={formData.mainDiagnosis} onChange={handleChange} />
        <TextAreaField label="Anamnesi" name="history" value={formData.history} onChange={handleChange} rows={4}/>
        <TextAreaField label="Note Cliniche" name="clinicalNotes" value={formData.clinicalNotes} onChange={handleChange} rows={6} />

        <div className="flex justify-end pt-4 space-x-2 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50">Annulla</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Salva Paziente</button>
        </div>
      </form>
    </Modal>
  );
};

export default PatientForm;