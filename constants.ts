import { Severity, DischargeType } from './types';

export const BEDS = {
  men: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
  women: Array.from({ length: 10 }, (_, i) => `${i + 11}`),
  ldu: ['LDU1', 'LDU2'],
  ldd: ['LDD1', 'LDD2'],
};

export const ALL_BEDS = [...BEDS.men, ...BEDS.women, ...BEDS.ldu, ...BEDS.ldd];

export const ROOM_LAYOUT = [
    // Sezione Uomini & Donne
    {
      groups: [
        { beds: ['1', '2'] },
        { beds: ['3', '4', '5', '6'] },
        { beds: ['7', '8', '9', '10'] },
        { beds: ['11', '12'] },
        { beds: ['13', '14', '15', '16'] },
        { beds: ['17', '18', '19', '20'] },
      ],
    },
    // Sezione Lungodegenza
    {
      isLongTerm: true,
      groups: [
        { title: 'Lungodegenza Uomini', beds: ['LDU1', 'LDU2'] },
        { title: 'Lungodegenza Donne', beds: ['LDD1', 'LDD2'] },
      ],
    },
];

export const COMMON_PATHOLOGIES = [
    'Ipertensione Arteriosa', 'Diabete Mellito 2', 'Cardiopatia Ischemica', 'BPCO', 'Scompenso Cardiaco',
    'Fibrillazione Atriale', 'Insufficienza Renale Cronica', 'Dislipidemia', 'Vasculopatia Periferica', 'Obesità'
];


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

export const DISCHARGE_TYPE_NAMES: Record<DischargeType, string> = {
  domicilio: 'A Domicilio',
  protetta: 'Dimissione Protetta',
  trasferimento: 'Trasferimento',
  decesso: 'Decesso',
};

export const EXAM_STATUS_NAMES: Record<string, string> = {
  da_richiedere: 'Da Richiedere',
  prenotato: 'Prenotato',
  effettuato: 'Effettuato',
};

export const EXAM_CATEGORIES: Record<string, string> = {
  laboratorio: 'Laboratorio',
  radiologia: 'Radiologia',
  consulenze: 'Consulenze',
};