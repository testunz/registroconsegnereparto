import { Severity } from './types';

export const BEDS = {
  men: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
  women: Array.from({ length: 10 }, (_, i) => `${i + 11}`),
  ldu: ['LDU1', 'LDU2'],
  ldd: ['LDD1', 'LDD2'],
};

export const ALL_BEDS = [...BEDS.men, ...BEDS.women, ...BEDS.ldu, ...BEDS.ldd];

export const SEVERITY_COLORS: Record<Severity, string> = {
  verde: 'border-severity-verde',
  giallo: 'border-severity-giallo',
  rosso: 'border-severity-rosso',
};

export const SEVERITY_NAMES: Record<Severity, string> = {
  verde: 'Stabile',
  giallo: 'Condizioni Moderate',
  rosso: 'Condizioni Critiche',
};

export const EXAM_STATUS_NAMES: Record<string, string> = {
  da_prenotare: 'Da Prenotare',
  richiesto: 'Richiesto',
  prenotato: 'Prenotato',
  completato: 'Completato',
};

export const EXAM_CATEGORIES: Record<string, string> = {
  laboratorio: 'Laboratorio',
  radiologia: 'Radiologia',
  consulenze: 'Consulenze',
};