import React, { useState, useEffect, useMemo } from 'react';
import { Patient, AdmissionType, Gender, Severity } from '../types';
import { ALL_BEDS, COMMON_PATHOLOGIES } from '../constants';
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
      <label htmlFor={name} className="block text-base font-medium text-slate-700 mb-1 dark:text-slate-300">{label}</label>
      {children ? (
        <select id={name} name={name} {...props} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white">
          {children}
        </select>
      ) : (
        <input 
          id={name} 
          name={name} 
          {...props}
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white" 
          autoComplete="off"
          spellCheck="false"
        />
      )}
    </div>
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, children?: React.ReactNode }> = ({ label, name, children, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-base font-medium text-slate-700 mb-1 dark:text-slate-300">{label}</label>
    <textarea 
      id={name} 
      name={name} 
      {...props}
      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
      autoComplete="off" spellCheck="false"
    ></textarea>
    {children}
  </div>
);

const PatientForm: React.FC<PatientFormProps> = ({ isOpen, onClose, patientToEdit, initialBed }) => {
  const { addPatient, updatePatient, activePatients } = usePatients();

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
      const { createdAt, lastUpdated, status, handovers, externalExams, id, dischargeType, ...editableData } = patientToEdit;
      setFormData(editableData);
    }
    else if (initialBed) {
      const admissionType = initialBed.startsWith('LD') ? 'lungodegenza' : 'ordinario';
      setFormData(prev => ({...prev, bed: initialBed, admissionType }));
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

  const handleAddPathology = (pathology: string) => {
    setFormData(prev => ({
        ...prev,
        history: prev.history ? `${prev.history}, ${pathology}` : pathology
    }));
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

  const occupiedBeds = useMemo(() => activePatients.map(p => p.bed), [activePatients]);

  const availableBeds = useMemo(() => {
      const freeBeds = ALL_BEDS.filter(b => !occupiedBeds.includes(b));
      let bedsToShow = freeBeds;
      if (patientToEdit) {
          bedsToShow = [patientToEdit.bed, ...freeBeds];
      }
      return bedsToShow.sort((a, b) => {
          const numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
          const numB = parseInt(b.replace(/[^0-9]/g, ''), 10);
          const strA = a.replace(/[0-9]/g, '');
          const strB = b.replace(/[0-9]/g, '');

          if(strA < strB) return 1;
          if(strA > strB) return -1;
          return numA - numB;
      });
  }, [occupiedBeds, patientToEdit]);


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={patientToEdit ? "Modifica Paziente" : "Nuovo Paziente"} size="4xl">
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
                {availableBeds.map(b => <option key={b} value={b}>{b}</option>)}
            </InputField>
            <InputField label="Tipo Ricovero" name="admissionType" value={formData.admissionType} onChange={handleChange}>
                <option value="ordinario">Ordinario</option><option value="lungodegenza">Lungodegenza</option>
            </InputField>
            <InputField label="Codice Gravità" name="severity" value={formData.severity} onChange={handleChange}>
                <option value="verde">Verde (Stabile)</option><option value="giallo">Giallo (Moderato)</option><option value="rosso">Rosso (Critico)</option>
            </InputField>
        </div>
        <InputField label="Diagnosi Principale" name="mainDiagnosis" value={formData.mainDiagnosis} onChange={handleChange} />
        <TextAreaField label="Anamnesi" name="history" value={formData.history} onChange={handleChange} rows={4}>
            <div className="mt-2 flex flex-wrap gap-2">
                {COMMON_PATHOLOGIES.map(p => (
                    <button type="button" key={p} onClick={() => handleAddPathology(p)} className="px-2 py-1 text-sm bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">
                        + {p}
                    </button>
                ))}
            </div>
        </TextAreaField>
        <TextAreaField label="Note Cliniche" name="clinicalNotes" value={formData.clinicalNotes} onChange={handleChange} rows={6} />

        <div className="flex justify-end pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
          <button type="button" onClick={onClose} className="px-4 py-2 text-base font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500">Annulla</button>
          <button type="submit" className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Salva Paziente</button>
        </div>
      </form>
    </Modal>
  );
};

export default PatientForm;