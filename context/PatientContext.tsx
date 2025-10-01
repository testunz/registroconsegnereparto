import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Patient, Handover, ExternalExam, DischargeType, WardNote } from '../types';
import { getDb, saveDb } from '../services/localDbService';
import { useUser } from './UserContext';

interface PatientContextType {
  patients: Patient[];
  activePatients: Patient[];
  dischargedPatients: Patient[];
  wardNotes: WardNote[];
  getPatientById: (id: string) => Patient | undefined;
  addPatient: (patientData: Omit<Patient, 'id' | 'status' | 'lastUpdated' | 'handovers' | 'externalExams' | 'createdAt' | 'dischargeType'>) => void;
  updatePatient: (patientId: string, updatedData: Partial<Omit<Patient, 'id' | 'createdAt' | 'status' | 'handovers' | 'externalExams'>>) => void;
  dischargePatient: (patientId: string, dischargeType: DischargeType) => void;
  addHandover: (patientId: string, handoverText: string, scheduledAt?: number | null) => void;
  updateHandover: (patientId: string, handoverId: string, updatedData: Partial<Handover>) => void;
  addExternalExam: (patientId: string, examData: Omit<ExternalExam, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExternalExam: (patientId: string, examId: string, updatedData: Partial<ExternalExam>) => void;
  deleteExternalExam: (patientId: string, examId: string) => void;
  addWardNote: (text: string) => void;
  deleteWardNote: (noteId: string) => void;
  refreshData: () => void;
}

export const PatientContext = createContext<PatientContextType | undefined>(undefined);

const formatName = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  return name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
};

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [wardNotes, setWardNotes] = useState<WardNote[]>([]);
  const { currentUser } = useUser();

  const updateAndSavePatients = useCallback((newPatients: Patient[]) => {
    const db = getDb();
    db.patients = newPatients;
    saveDb(db, currentUser || 'Sconosciuto');
    setPatients(newPatients);
  }, [currentUser]);

  const updateAndSaveNotes = useCallback((newNotes: WardNote[]) => {
    const db = getDb();
    db.wardNotes = newNotes;
    saveDb(db, currentUser || 'Sconosciuto');
    setWardNotes(newNotes);
  }, [currentUser]);

  const refreshData = useCallback(() => {
    const db = getDb();
    setPatients(db.patients);
    setWardNotes(db.wardNotes);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addPatient = useCallback((patientData: Omit<Patient, 'id' | 'status' | 'lastUpdated' | 'handovers' | 'externalExams' | 'createdAt' | 'dischargeType'>) => {
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
    updateAndSavePatients([...patients, newPatient]);
  }, [patients, updateAndSavePatients]);

  const updatePatient = useCallback((patientId: string, updatedData: Partial<Patient>) => {
    const formattedData = { ...updatedData };
    if (formattedData.firstName) formattedData.firstName = formatName(formattedData.firstName);
    if (formattedData.lastName) formattedData.lastName = formatName(formattedData.lastName);
    
    const originalPatient = patients.find(p => p.id === patientId);
    if (!originalPatient) return;

    // Check if bed is being changed to an occupied bed
    if (formattedData.bed && formattedData.bed !== originalPatient.bed) {
      const newBed = formattedData.bed;
      const oldBed = originalPatient.bed;
      const otherPatientInNewBed = patients.find(p => p.status === 'active' && p.bed === newBed);

      if (otherPatientInNewBed) {
        // A patient is in the destination bed, perform a swap
        const now = Date.now();
        const newPatients = patients.map(p => {
          if (p.id === patientId) {
            // The patient being edited gets the new data and new bed
            return { ...p, ...formattedData, lastUpdated: now };
          }
          if (p.id === otherPatientInNewBed.id) {
            // The other patient gets the old bed
            return { ...p, bed: oldBed, lastUpdated: now };
          }
          return p;
        });
        updateAndSavePatients(newPatients);
        return; // Early return after swap
      }
    }
    
    // Default case: no swap needed
    const newPatients = patients.map(p => 
      p.id === patientId 
        ? { ...p, ...formattedData, lastUpdated: Date.now() } 
        : p
    );
    updateAndSavePatients(newPatients);
  }, [patients, updateAndSavePatients]);
  
  const dischargePatient = useCallback((patientId: string, dischargeType: DischargeType) => {
    const newPatients = patients.map((p): Patient => 
      p.id === patientId 
        ? { ...p, status: 'discharged', bed: '', lastUpdated: Date.now(), dischargeType } 
        : p
    );
    updateAndSavePatients(newPatients);
  }, [patients, updateAndSavePatients]);

  const addHandover = useCallback((patientId: string, handoverText: string, scheduledAt?: number | null) => {
    const now = Date.now();
    const newHandover: Handover = {
      id: crypto.randomUUID(),
      text: handoverText,
      createdAt: now,
      scheduledAt: scheduledAt || null,
      isCompleted: false,
    };
     const newPatients = patients.map(p => 
      p.id === patientId 
        ? { ...p, handovers: [...p.handovers, newHandover].sort((a,b) => b.createdAt - a.createdAt), lastUpdated: now } 
        : p
    );
    updateAndSavePatients(newPatients);
  }, [patients, updateAndSavePatients]);

  const updateHandover = useCallback((patientId: string, handoverId: string, updatedData: Partial<Handover>) => {
      const now = Date.now();
      const newPatients = patients.map(p => {
          if (p.id === patientId) {
              const updatedHandovers = p.handovers.map(h => 
                  h.id === handoverId ? { ...h, ...updatedData } : h
              );
              return { ...p, handovers: updatedHandovers, lastUpdated: now };
          }
          return p;
      });
      updateAndSavePatients(newPatients);
  }, [patients, updateAndSavePatients]);

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
    updateAndSavePatients(newPatients);
  }, [patients, updateAndSavePatients]);

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
    updateAndSavePatients(newPatients);
  }, [patients, updateAndSavePatients]);

  const deleteExternalExam = useCallback((patientId: string, examId: string) => {
    const newPatients = patients.map(p => {
      if (p.id === patientId) {
        return { ...p, externalExams: p.externalExams.filter(ex => ex.id !== examId), lastUpdated: Date.now() };
      }
      return p;
    });
    updateAndSavePatients(newPatients);
  }, [patients, updateAndSavePatients]);

  const addWardNote = useCallback((text: string) => {
      if (!text.trim()) return;
      const newNote: WardNote = {
        id: crypto.randomUUID(),
        text: text.trim(),
        createdAt: Date.now(),
      };
      updateAndSaveNotes([newNote, ...wardNotes]);
  }, [wardNotes, updateAndSaveNotes]);

  const deleteWardNote = useCallback((noteId: string) => {
    const newNotes = wardNotes.filter(note => note.id !== noteId);
    updateAndSaveNotes(newNotes);
  }, [wardNotes, updateAndSaveNotes]);

  const getPatientById = useCallback((id: string) => patients.find(p => p.id === id), [patients]);
  
  const activePatients = useMemo(() => patients.filter(p => p.status === 'active'), [patients]);
  const dischargedPatients = useMemo(() => patients.filter(p => p.status === 'discharged'), [patients]);

  return (
    <PatientContext.Provider value={{ 
        patients, activePatients, dischargedPatients, getPatientById, addPatient, 
        updatePatient, dischargePatient, addHandover, updateHandover, addExternalExam, 
        updateExternalExam, deleteExternalExam, refreshData, wardNotes, addWardNote, deleteWardNote
    }}>
      {children}
    </PatientContext.Provider>
  );
};