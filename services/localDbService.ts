import { Patient, Gender, WardNote } from '../types';

const DB_KEY = 'medicina-interna-soverato-db-v4';

interface AppDatabase {
  patients: Patient[];
  wardNotes: WardNote[];
}

const createRealPatients = (): Patient[] => {
    const reportDate = new Date('2025-09-29').getTime();

    const patients: Patient[] = [
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
        {
            id: crypto.randomUUID(),
            firstName: 'Franco', lastName: 'Galli', dateOfBirth: '1944-08-01',
            admissionDate: '2025-09-21', gender: 'M', bed: '1',
            admissionType: 'ordinario',
            mainDiagnosis: 'Scompenso cardiaco acuto su cronico, insufficienza renale',
            history: 'Pregresso infarto miocardico, ipertensione arteriosa, vasculopatia periferica.',
            clinicalNotes: 'Dispnoico a riposo, edemi declivi. In terapia diuretica.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-21').getTime(),
            lastUpdated: reportDate, handovers: [], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Roberto', lastName: 'Ferrara', dateOfBirth: '1946-03-22',
            admissionDate: '2025-08-15', gender: 'M', bed: 'LDU2',
            admissionType: 'lungodegenza',
            mainDiagnosis: 'Anemia severa da rivalutare',
            history: 'Demenza, ipertensione arteriosa, cachessia, cardiopatia ischemica.',
            clinicalNotes: 'In LD dal 25-08-2025. Trasfusioni periodiche.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-08-15').getTime(),
            lastUpdated: reportDate, handovers: [{ id: crypto.randomUUID(), text: 'Programmare dimissione protetta con attivazione ADI', createdAt: reportDate, isCompleted: false }], externalExams: [],
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
        {
            id: crypto.randomUUID(),
            firstName: 'Rosa', lastName: 'Colombo', dateOfBirth: '1955-07-07',
            admissionDate: '2025-09-26', gender: 'F', bed: '16',
            admissionType: 'ordinario',
            mainDiagnosis: 'Sospetta endocardite batterica in paziente febbrile',
            history: 'Ipertensione arteriosa, obesità, pregresso TEP, prolasso mitralico.',
            clinicalNotes: 'Eseguite emocolture. In attesa di ecocardiogramma transesofageo.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-26').getTime(),
            lastUpdated: reportDate, handovers: [], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Francesca', lastName: 'Gallo', dateOfBirth: '1939-02-14',
            admissionDate: '2025-09-22', gender: 'F', bed: '15',
            admissionType: 'ordinario',
            mainDiagnosis: 'Insufficienza respiratoria acuta su BPCO',
            history: 'Vasculopatia cerebrale cronica, FA permanente, Diabete tipo II, IRC, portatrice di pacemaker, K vescica operato.',
            clinicalNotes: 'In ossigenoterapia ad alti flussi. Eseguita emogasanalisi.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-22').getTime(),
            lastUpdated: reportDate, handovers: [], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Elena', lastName: 'Rinaldi', dateOfBirth: '1961-10-01',
            admissionDate: '2025-09-25', gender: 'F', bed: '14',
            admissionType: 'ordinario',
            mainDiagnosis: 'Febbre di origine sconosciuta',
            history: 'Tiroidite di Hashimoto in terapia sostitutiva, sindrome del colon irritabile. Riferisce intolleranza a FANS.',
            clinicalNotes: 'Eseguiti esami di primo livello, negativi. In programma TC total body.',
            severity: 'verde', status: 'active', createdAt: new Date('2025-09-25').getTime(),
            lastUpdated: reportDate, handovers: [], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Laura', lastName: 'Marino', dateOfBirth: '1956-01-28',
            admissionDate: '2025-09-23', gender: 'F', bed: '13',
            admissionType: 'ordinario',
            mainDiagnosis: 'Anemizzazione severa in paziente con mieloma',
            history: 'Trasferita da Ematologia. Mieloma multiplo in trattamento. Decadimento cognitivo lieve. Allergia a contrasto iodato.',
            clinicalNotes: 'Programmata trasfusione di emazie concentrate.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-23').getTime(),
            lastUpdated: reportDate, handovers: [], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Isabella', lastName: 'Martini', dateOfBirth: '1949-04-30',
            admissionDate: '2025-09-24', gender: 'F', bed: '12',
            admissionType: 'ordinario',
            mainDiagnosis: 'Ittero ostruttivo da definire',
            history: 'Ipertensione arteriosa, colecistectomia pregressa per via laparoscopica.',
            clinicalNotes: 'Eseguita ecografia addome che mostra dilatazione delle vie biliari. In programma Colangio-RMN.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-24').getTime(),
            lastUpdated: reportDate, handovers: [], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Valentina', lastName: 'Costa', dateOfBirth: '1965-11-18',
            admissionDate: '2025-09-26', gender: 'F', bed: '11',
            admissionType: 'ordinario',
            mainDiagnosis: 'Palpitazioni, sospetta aritmia',
            history: 'Ipertensione arteriosa in terapia. Nessuna cardiopatia nota.',
            clinicalNotes: 'In monitoraggio cardiaco continuo. Richiesto Holter ECG 24h e consulenza cardiologica.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-26').getTime(),
            lastUpdated: reportDate, handovers: [], externalExams: [],
        },
        {
            id: crypto.randomUUID(),
            firstName: 'Chiara', lastName: 'Lombardi', dateOfBirth: '1947-10-05',
            admissionDate: '2025-09-25', gender: 'F', bed: 'LDD2',
            admissionType: 'lungodegenza',
            mainDiagnosis: 'Riabilitazione post-frattura femore in paziente con insufficienza renale',
            history: 'Ipertensione arteriosa, IRC stadio III, pregressa frattura femore destro trattata chirurgicamente.',
            clinicalNotes: 'Necessita di supporto per la mobilizzazione e fisioterapia.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-25').getTime(),
            lastUpdated: reportDate, handovers: [{ id: crypto.randomUUID(), text: 'Programmare ciclo di FKT. Controllare periodicamente la funzione renale.', createdAt: new Date('2025-09-29T08:00:00').getTime(), scheduledAt: new Date('2025-09-29T14:00:00').getTime(), isCompleted: false }], externalExams: [],
        },
    ];

  return patients;
};

const initializeDatabase = (): AppDatabase => {
  const db: AppDatabase = {
    patients: createRealPatients(),
    wardNotes: [],
  };
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

export const saveDb = (db: AppDatabase): void => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error)
    {
    console.error("Failed to save data to localStorage", error);
  }
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

export const importData = (file: File, onComplete: (success: boolean, message: string) => void): void => {
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

      saveDb(currentDb);
      onComplete(true, "Dati importati e uniti con successo.");
    } catch (error) {
      console.error("Failed to import data", error);
      onComplete(false, "Errore durante l'importazione. Controlla il formato del file.");
    }
  };
  reader.readAsText(file);
};