import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Patient, Handover, ExternalExam } from '../types';
import { getDb, saveDb } from '../services/localDbService';

interface PatientContextType {
  patients: Patient[];
  activePatients: Patient[];
  dischargedPatients: Patient[];
  getPatientById: (id: string) => Patient | undefined;
  addPatient: (patientData: Omit<Patient, 'id' | 'status' | 'lastUpdated' | 'handovers' | 'externalExams' | 'createdAt'>) => void;
  updatePatient: (patientId: string, updatedData: Partial<Omit<Patient, 'id' | 'createdAt'>>) => void;
  dischargePatient: (patientId: string) => void;
  addHandover: (patientId: string, handoverText: string) => void;
  addExternalExam: (patientId: string, examData: Omit<ExternalExam, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExternalExam: (patientId: string, examId: string, updatedData: Partial<ExternalExam>) => void;
  deleteExternalExam: (patientId: string, examId: string) => void;
  refreshData: () => void;
}

export const PatientContext = createContext<PatientContextType | undefined>(undefined);

const formatName = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  return name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
};

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  const updateAndSave = useCallback((newPatients: Patient[]) => {
    const db = getDb();
    db.patients = newPatients;
    saveDb(db);
    setPatients(newPatients);
  }, []);

  const refreshData = useCallback(() => {
    setPatients(getDb().patients);
  }, []);

  const addPatient = useCallback((patientData: Omit<Patient, 'id' | 'status' | 'lastUpdated' | 'handovers' | 'externalExams' | 'createdAt'>) => {
    const now = Date.now();
    const newPatient: Patient = {
      ...patientData,
      firstName: formatName(patientData.firstName),
      lastName: formatName(patientData.lastName),
      id: crypto.randomUUID(),
      status: 'active',
      createdAt: now,
      lastUpdated: now,
      handovers: [],
      externalExams: [],
    };
    updateAndSave([...patients, newPatient]);
  }, [patients, updateAndSave]);

  const updatePatient = useCallback((patientId: string, updatedData: Partial<Patient>) => {
    const formattedData = { ...updatedData };
    if (formattedData.firstName) formattedData.firstName = formatName(formattedData.firstName);
    if (formattedData.lastName) formattedData.lastName = formatName(formattedData.lastName);
    
    const newPatients = patients.map(p => 
      p.id === patientId 
        ? { ...p, ...formattedData, lastUpdated: Date.now() } 
        : p
    );
    updateAndSave(newPatients);
  }, [patients, updateAndSave]);
  
  const dischargePatient = useCallback((patientId: string) => {
    const newPatients = patients.map((p): Patient => 
      p.id === patientId 
        ? { ...p, status: 'discharged', bed: '', lastUpdated: Date.now() } 
        : p
    );
    updateAndSave(newPatients);
  }, [patients, updateAndSave]);

  const addHandover = useCallback((patientId: string, handoverText: string) => {
    const now = Date.now();
    const newHandover: Handover = {
      id: crypto.randomUUID(),
      text: handoverText,
      createdAt: now
    };
     const newPatients = patients.map(p => 
      p.id === patientId 
        ? { ...p, handovers: [...p.handovers, newHandover].sort((a,b) => b.createdAt - a.createdAt), lastUpdated: now } 
        : p
    );
    updateAndSave(newPatients);
  }, [patients, updateAndSave]);

  const addExternalExam = useCallback((patientId: string, examData: Omit<ExternalExam, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newExam: ExternalExam = {
      ...examData,
      id: crypto.randomUUID(),
      createdAt: now,
    };
    const newPatients = patients.map(p =>
      p.id === patientId
        ? { ...p, externalExams: [...p.externalExams, newExam], lastUpdated: now }
        : p
    );
    updateAndSave(newPatients);
  }, [patients, updateAndSave]);

  const updateExternalExam = useCallback((patientId: string, examId: string, updatedData: Partial<ExternalExam>) => {
    const now = Date.now();
    const newPatients = patients.map(p => {
      if (p.id === patientId) {
        const updatedExams = p.externalExams.map(ex => 
          ex.id === examId ? { ...ex, ...updatedData, updatedAt: now } : ex
        );
        return { ...p, externalExams: updatedExams, lastUpdated: now };
      }
      return p;
    });
    updateAndSave(newPatients);
  }, [patients, updateAndSave]);

  const deleteExternalExam = useCallback((patientId: string, examId: string) => {
    const newPatients = patients.map(p => {
      if (p.id === patientId) {
        return { ...p, externalExams: p.externalExams.filter(ex => ex.id !== examId), lastUpdated: Date.now() };
      }
      return p;
    });
    updateAndSave(newPatients);
  }, [patients, updateAndSave]);

  const getPatientById = useCallback((id: string) => patients.find(p => p.id === id), [patients]);
  
  const activePatients = useMemo(() => patients.filter(p => p.status === 'active'), [patients]);
  const dischargedPatients = useMemo(() => patients.filter(p => p.status === 'discharged'), [patients]);

  return (
    <PatientContext.Provider value={{ 
        patients, activePatients, dischargedPatients, getPatientById, addPatient, 
        updatePatient, dischargePatient, addHandover, addExternalExam, 
        updateExternalExam, deleteExternalExam, refreshData
    }}>
      {children}
    </PatientContext.Provider>
  );
};