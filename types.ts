export type Severity = 'verde' | 'giallo' | 'rosso';
export type AdmissionType = 'ordinario' | 'lungodegenza';
export type Gender = 'M' | 'F';
export type ExamCategory = 'laboratorio' | 'radiologia' | 'consulenze';
export type ExamStatus = 'da_prenotare' | 'richiesto' | 'prenotato' | 'completato';
export type View = 'dashboard' | 'archive' | 'patient_detail';

export interface Handover {
  id: string;
  text: string;
  createdAt: number;
}

export interface ExternalExam {
  id: string;
  category: ExamCategory;
  description: string;
  status: ExamStatus;
  appointmentDate: string | null;
  showInDashboardReminder: boolean;
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
  createdAt: number;
  lastUpdated: number;
  handovers: Handover[];
  externalExams: ExternalExam[];
}