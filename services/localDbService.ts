import { Patient, Gender, WardNote, AppDatabase, Severity, AdmissionType, Handover, ExternalExam, ExamCategory, ExamStatus } from '../types';
import { addBackup } from './backupService';
import { ALL_BEDS, BEDS } from '../constants';


const DB_KEY = 'medicina-interna-soverato-db-v4';

const createRealPatients = (): Patient[] => {
    const reportDate = new Date('2025-09-29').getTime();

    // Funzioni di utilità per la generazione casuale
    const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const getRandomDate = (start: Date, end: Date): Date => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const toISODate = (date: Date) => date.toISOString().slice(0, 10);

    // Dati di esempio per la generazione
    const MALE_NAMES = ['Mario', 'Carlo', 'Francesco', 'Alessandro', 'Davide', 'Simone', 'Marco', 'Luca', 'Paolo'];
    const FEMALE_NAMES = ['Elisa', 'Martina', 'Sara', 'Alessia', 'Federica', 'Veronica', 'Roberta', 'Simona', 'Laura'];
    const LAST_NAMES = ['Ferrari', 'Russo', 'Colombo', 'De Luca', 'Barbieri', 'Fontana', 'Santoro', 'Marchetti', 'Galli'];
    const DIAGNOSES = ['Polmonite nosocomiale', 'Insufficienza cardiaca scompensata', 'Embolia polmonare', 'Sepsi da IVU', 'Colecistite acuta', 'Diverticolite', 'Ictus ischemico acuto', 'Sindrome coronarica acuta'];
    const SEVERITIES: Severity[] = ['verde', 'giallo', 'rosso'];

    const HANDOVER_TEXTS = ['Monitorare diuresi nelle 24h', 'Controllo parametri vitali ogni 4 ore', 'Attendere referto emocolture', 'Valutare introduzione di terapia marziale', 'Richiedere visita fisiatrica per mobilizzazione', 'Pianificare colloquio con i familiari', 'Eseguire ECG di controllo domattina'];
    const LAB_EXAMS = ['Emocromo con formula', 'PCR, Procalcitonina', 'Funzionalità renale ed elettroliti', 'Enzimi cardiaci', 'Profilo epatico completo', 'Esame urine completo', 'Emogasanalisi arteriosa'];
    const RADIO_EXAMS = ['Ecografia addome completo', 'TC Torace con mdc', 'Doppler arti inferiori', 'Rx diretta addome', 'Colangio-RMN', 'Rx Torace'];
    const CONSULTATIONS = ['Consulenza cardiologica', 'Consulenza neurologica', 'Consulenza chirurgica', 'Valutazione nutrizionistica', 'Consulenza infettivologica'];
    const EXAM_STATUSES: ExamStatus[] = ['da_richiedere', 'prenotato', 'effettuato'];


    let patients: Patient[] = [
        // UOMINI
        {
            id: crypto.randomUUID(),
            firstName: 'Giovanni', lastName: 'Rossi', dateOfBirth: '1935-03-15',
            admissionDate: '2025-09-24', gender: 'M', bed: '9',
            admissionType: 'ordinario',
            mainDiagnosis: 'Bronchite cronica riacutizzata',
            history: 'Ipertensione arteriosa, BPCO, pregresso infarto miocardico, insufficienza renale lieve.',
            clinicalNotes: 'Paziente vigile, collaborante. Stabile emodinamicamente.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-24').getTime(),
            lastUpdated: reportDate, handovers: [], 
            externalExams: [{
                id: crypto.randomUUID(),
                category: 'radiologia',
                description: 'Rx Torace di controllo',
                status: 'prenotato',
                reminderDate: null,
                appointmentDate: '2025-09-29',
                createdAt: new Date('2025-09-27').getTime()
            }],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Luigi', lastName: 'Bianchi', dateOfBirth: '1945-05-20',
            admissionDate: '2025-09-18', gender: 'M', bed: '8',
            admissionType: 'ordinario',
            mainDiagnosis: 'Versamento pleurico destro, Polmonite basale.',
            history: 'Ictus ischemico pregresso con emiparesi sinistra, demenza vascolare, diabete mellito tipo 2.',
            clinicalNotes: 'Allettato, poco collaborante. In ossigenoterapia.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-18').getTime(),
            lastUpdated: reportDate, handovers: [], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Paolo', lastName: 'Romano', dateOfBirth: '1940-11-02',
            admissionDate: '2025-09-23', gender: 'M', bed: '6',
            admissionType: 'ordinario',
            mainDiagnosis: 'Neoplasia del colon con metastasi epatiche',
            history: 'Cardiopatia ischemica cronica, portatore di stent coronarico.',
            clinicalNotes: 'Presenta dolore addominale, in terapia antalgica con oppioidi. Condizioni generali scadute.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-23').getTime(),
            lastUpdated: reportDate, handovers: [{ id: crypto.randomUUID(), text: 'Richiesta consulenza cure palliative.', createdAt: reportDate, scheduledAt: new Date('2025-09-29T10:00:00').getTime(), isCompleted: false }], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Antonio', lastName: 'Esposito', dateOfBirth: '1972-01-30',
            admissionDate: '2025-09-28', gender: 'M', bed: '4',
            admissionType: 'ordinario',
            mainDiagnosis: 'Crisi epilettica in paziente con pregressa epilessia, stato febbrile.',
            history: 'Epilessia in trattamento farmacologico da anni. Non altre comorbidità di rilievo.',
            clinicalNotes: 'Attualmente apiretico, post-critico. In attesa di EEG.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-28').getTime(),
            lastUpdated: reportDate, handovers: [], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Giuseppe', lastName: 'Ricci', dateOfBirth: '1939-07-12',
            admissionDate: '2025-09-27', gender: 'M', bed: '3',
            admissionType: 'ordinario',
            mainDiagnosis: 'Squilibrio elettrolitico, disidratazione da gastroenterite',
            history: 'Diabete tipo 2, Insufficienza renale cronica, demenza senile. Allergia nota a penicillina.',
            clinicalNotes: 'Confuso, disorientato. In reidratazione endovenosa.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-27').getTime(),
            lastUpdated: reportDate, handovers: [{ id: crypto.randomUUID(), text: 'Eseguire TC addome per sospetta diverticolite', createdAt: reportDate, isCompleted: false }], externalExams: [],
        },
        // DONNE
        {
            id: crypto.randomUUID(),
            firstName: 'Anna', lastName: 'Moretti', dateOfBirth: '1942-06-15',
            admissionDate: '2025-09-27', gender: 'F', bed: 'LDD1',
            admissionType: 'lungodegenza',
            mainDiagnosis: 'Lesione da decubito sacrale in paziente allettata con decadimento cognitivo.',
            history: 'Morbo di Alzheimer, diabete mellito tipo II, ipertensione arteriosa.',
            clinicalNotes: 'Necessita di medicazioni avanzate giornaliere.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-27').getTime(),
            lastUpdated: reportDate, handovers: [], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Sofia', lastName: 'Greco', dateOfBirth: '1962-09-10',
            admissionDate: '2025-09-25', gender: 'F', bed: '20',
            admissionType: 'ordinario',
            mainDiagnosis: 'Ictus cerebellare recente',
            history: 'Ipertensione arteriosa, Fibrillazione atriale in TAO, protesi valvolare mitralica meccanica.',
            clinicalNotes: 'Presenta vertigini e atassia. Inizia percorso riabilitativo.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-25').getTime(),
            lastUpdated: reportDate, handovers: [], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Giulia', lastName: 'Conti', dateOfBirth: '1943-08-19',
            admissionDate: '2025-09-26', gender: 'F', bed: '19',
            admissionType: 'ordinario',
            mainDiagnosis: 'Dolore addominale in studio, sospetta pancreatite',
            history: 'Osteoporosi severa, sindrome ansioso-depressiva.',
            clinicalNotes: 'Tende a camminare da sola nel reparto, aumentato rischio cadute.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-26').getTime(),
            lastUpdated: reportDate, handovers: [{ id: crypto.randomUUID(), text: 'Attenzione al rischio cadute, paziente poco collaborante.', createdAt: reportDate, isCompleted: false }], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Maria', lastName: 'Bruno', dateOfBirth: '1948-11-25',
            admissionDate: '2025-09-19', gender: 'F', bed: '18',
            admissionType: 'ordinario',
            mainDiagnosis: 'Infezione delle vie urinarie con febbre',
            history: 'Diabete Mellito tipo 2, Fibrillazione atriale cronica, scompenso cardiaco cronico.',
            clinicalNotes: 'In terapia antibiotica mirata. Attualmente apiretica.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-19').getTime(),
            lastUpdated: reportDate, handovers: [{ id: crypto.randomUUID(), text: 'Controllare esami urine e PCR a 48h', createdAt: reportDate, isCompleted: true }], externalExams: [],
        },
    ];

    const occupiedBeds = new Set(patients.map(p => p.bed));

    // Riempi i letti vuoti
    ALL_BEDS.forEach(bed => {
        if (!occupiedBeds.has(bed)) {
            const isLduOrLdd = bed.startsWith('LD');
            const gender: Gender = BEDS.men.includes(bed) || BEDS.ldu.includes(bed) ? 'M' : 'F';
            
            const newPatient: Patient = {
                id: crypto.randomUUID(),
                firstName: getRandomElement(gender === 'M' ? MALE_NAMES : FEMALE_NAMES),
                lastName: getRandomElement(LAST_NAMES),
                dateOfBirth: toISODate(getRandomDate(new Date('1930-01-01'), new Date('1965-01-01'))),
                admissionDate: toISODate(getRandomDate(new Date('2025-09-15'), new Date('2025-09-28'))),
                gender,
                bed,
                admissionType: isLduOrLdd ? 'lungodegenza' : 'ordinario',
                mainDiagnosis: getRandomElement(DIAGNOSES),
                history: 'Anamnesi non ancora raccolta.',
                clinicalNotes: 'Condizioni al momento stabili.',
                severity: getRandomElement(SEVERITIES),
                status: 'active',
                createdAt: new Date().getTime(),
                lastUpdated: new Date().getTime(),
                handovers: [],
                externalExams: [],
            };
            patients.push(newPatient);
        }
    });

    // Aggiungi consegne ed esami a tutti i pazienti
    patients.forEach(p => {
        // Pulisci le attività esistenti per evitare duplicati al riavvio
        p.handovers = [];
        p.externalExams = [];

        // Aggiungi 1-3 consegne
        for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
            const isCompleted = Math.random() > 0.6;
            const hasSchedule = Math.random() > 0.5;
            p.handovers.push({
                id: crypto.randomUUID(),
                text: getRandomElement(HANDOVER_TEXTS),
                createdAt: getRandomDate(new Date(p.admissionDate), new Date()).getTime(),
                isCompleted,
                scheduledAt: hasSchedule ? getRandomDate(new Date(), new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)).getTime() : null,
            });
        }
        
        // Aggiungi 2-4 esami
        for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
            const category = getRandomElement<ExamCategory>(['laboratorio', 'radiologia', 'consulenze']);
            let description = '';
            switch (category) {
                case 'laboratorio': description = getRandomElement(LAB_EXAMS); break;
                case 'radiologia': description = getRandomElement(RADIO_EXAMS); break;
                case 'consulenze': description = getRandomElement(CONSULTATIONS); break;
            }

            const status = getRandomElement(EXAM_STATUSES);
            let appointmentDate: string | null = null;
            let reminderDate: string | null = null;

            if (status === 'prenotato') {
                appointmentDate = toISODate(getRandomDate(new Date(), new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)));
            } else if (status === 'da_richiedere') {
                 if(Math.random() > 0.5) reminderDate = toISODate(getRandomDate(new Date(), new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)));
            }
            
            p.externalExams.push({
                id: crypto.randomUUID(),
                category,
                description,
                status,
                appointmentDate,
                reminderDate,
                createdAt: getRandomDate(new Date(p.admissionDate), new Date()).getTime(),
            });
        }
    });

    return patients;
};


const initializeDatabase = (): AppDatabase => {
  const db: AppDatabase = {
    patients: createRealPatients(),
    wardNotes: [],
  };
  // Don't save backup on first initialization
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
};

export const getDb = (): AppDatabase => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      return initializeDatabase();
    }
    const db = JSON.parse(data);
    // Basic validation to ensure we have an array
    if (!Array.isArray(db.patients)) {
        console.warn("Database patient data is not an array, re-initializing.");
        return initializeDatabase();
    }
    return {
      patients: db.patients || [],
      wardNotes: db.wardNotes || [],
    };
  } catch (error) {
    console.error("Failed to load data from localStorage", error);
    return initializeDatabase();
  }
};

export const saveDb = (db: AppDatabase, user: string): void => {
  try {
    const dbString = JSON.stringify(db);
    localStorage.setItem(DB_KEY, dbString);
    // Fire-and-forget backup call with user
    addBackup(dbString, user);
  } catch (error)
    {
    console.error("Failed to save data to localStorage", error);
  }
};

export const resetDb = async (user: string): Promise<void> => {
    const emptyDb: AppDatabase = { patients: [], wardNotes: [] };
    // This action will be backed up automatically by saveDb, preserving the history.
    saveDb(emptyDb, user);
};


export const exportData = (): void => {
  const db = getDb();
  const dataStr = JSON.stringify(db, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `backup_registro_medicina_${new Date().toISOString().slice(0, 10)}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importData = (file: File, user: string, onComplete: (success: boolean, message: string) => void): void => {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedDb: Partial<AppDatabase> = JSON.parse(event.target?.result as string);
      
      const currentDb = getDb();
      
      const patientMap = new Map<string, Patient>(currentDb.patients.map(p => [p.id, p]));
      importedDb.patients?.forEach(importedPatient => {
        // Basic validation for imported patient
        if (importedPatient && typeof importedPatient.id === 'string' && typeof importedPatient.lastUpdated === 'number') {
            const existingPatient = patientMap.get(importedPatient.id);
            if (existingPatient) {
              if (importedPatient.lastUpdated > existingPatient.lastUpdated) {
                patientMap.set(importedPatient.id, importedPatient);
              }
            } else {
              patientMap.set(importedPatient.id, importedPatient);
            }
        }
      });
      currentDb.patients = Array.from(patientMap.values());
      
      // Import and merge ward notes
      const noteMap = new Map<string, WardNote>(currentDb.wardNotes.map(n => [n.id, n]));
      importedDb.wardNotes?.forEach(importedNote => {
        if (importedNote && typeof importedNote.id === 'string') {
            noteMap.set(importedNote.id, importedNote);
        }
      });
      currentDb.wardNotes = Array.from(noteMap.values());

      saveDb(currentDb, user); // User is passed in for audit trail
      onComplete(true, "Dati importati e uniti con successo.");
    } catch (error) {
      console.error("Failed to import data", error);
      onComplete(false, "Errore durante l'importazione. Controlla il formato del file.");
    }
  };
  reader.readAsText(file);
};
