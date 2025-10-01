export type Severity = 'verde' | 'giallo' | 'rosso';
export type AdmissionType = 'ordinario' | 'lungodegenza';
export type Gender = 'M' | 'F';
export type ExamCategory = 'laboratorio' | 'radiologia' | 'consulenze';
export type ExamStatus = 'da_richiedere' | 'prenotato' | 'effettuato';
export type View = 'dashboard' | 'archive' | 'attività' | 'patient_detail' | 'history' | 'admin' | 'guide';
export type DischargeType = 'domicilio' | 'protetta' | 'trasferimento' | 'decesso';

export interface Handover {
  id: string;
  text: string;
  createdAt: number;
  scheduledAt?: number | null;
  isCompleted?: boolean;
}

export interface ExternalExam {
  id: string;
  category: ExamCategory;
  description: string;
  status: ExamStatus;
  reminderDate: string | null;
  appointmentDate: string | null;
  createdAt: number;
  updatedAt?: number;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  admissionDate: string;
  gender: Gender;
  bed: string;
  admissionType: AdmissionType;
  mainDiagnosis: string;
  history: string; // Anamnesi
  clinicalNotes: string;
  severity: Severity;
  status: 'active' | 'discharged';
  dischargeType?: DischargeType;
  createdAt: number;
  lastUpdated: number;
  handovers: Handover[];
  externalExams: ExternalExam[];
}

export interface WardNote {
  id: string;
  text: string;
  createdAt: number;
}

// Fix: Moved AppDatabase interface here to be a shared type.
export interface AppDatabase {
    patients: Patient[];
    wardNotes: WardNote[];
}

export interface BackupMeta {
    timestamp: number;
    patientCount: number;
    noteCount: number;
    user: string;
}

export interface User {
    name: string;
    password?: string;
}