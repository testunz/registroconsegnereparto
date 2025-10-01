import { Patient, Gender, WardNote, AppDatabase, Severity, AdmissionType, Handover, ExternalExam, ExamCategory, ExamStatus } from '../types';
import { addBackup } from './backupService';
import { ALL_BEDS, BEDS } from '../constants';


const DB_KEY = 'medicina-interna-soverato-db-v4';

const createRealPatients = (): Patient[] => {
    const reportDate = new Date('2025-09-29').getTime();
    const toISODate = (date: Date) => date.toISOString().slice(0, 10);
    const today = new Date('2025-09-29');
    const tomorrow = new Date('2025-09-30');
    const dayAfterTomorrow = new Date('2025-10-01');

    const handoversTemplate = {
        h1: (text: string): Handover => ({ id: crypto.randomUUID(), text, createdAt: reportDate, isCompleted: false }),
        h2: (text: string, scheduledDate: Date): Handover => ({ id: crypto.randomUUID(), text, createdAt: reportDate, scheduledAt: scheduledDate.getTime(), isCompleted: false }),
    };

    const examsTemplate = {
        e1: (category: ExamCategory, description: string, notes?: string): ExternalExam => ({
            id: crypto.randomUUID(), category, description, status: 'da_richiedere', reminderDate: toISODate(tomorrow), appointmentDate: null, createdAt: reportDate, notes,
        }),
        e2: (category: ExamCategory, description: string, appointmentDate: Date, notes?: string): ExternalExam => ({
            id: crypto.randomUUID(), category, description, status: 'prenotato', reminderDate: null, appointmentDate: toISODate(appointmentDate), createdAt: reportDate, notes,
        }),
    };

    let patients: Patient[] = [
        // UOMINI (8/10, Letti liberi: 7, 10)
        {
            id: crypto.randomUUID(), firstName: 'Giovanni', lastName: 'Rossi', dateOfBirth: '1935-03-15',
            admissionDate: '2025-09-24', gender: 'M', bed: '9', admissionType: 'ordinario',
            mainDiagnosis: 'Bronchite cronica riacutizzata',
            history: 'Ipertensione arteriosa, BPCO, pregresso infarto miocardico, insufficienza renale lieve.',
            clinicalNotes: 'Paziente vigile, collaborante. Stabile emodinamicamente.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-24').getTime(), lastUpdated: reportDate, 
            handovers: [
                handoversTemplate.h1('Monitorare diuresi nelle 24h.'),
                handoversTemplate.h1('Controllo parametri vitali ogni 6 ore.'),
            ], 
            externalExams: [
                examsTemplate.e2('radiologia', 'Rx Torace di controllo', today, 'Eseguire in 2 proiezioni, senza mdc.'),
                examsTemplate.e1('laboratorio', 'Emogasanalisi arteriosa'),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Luigi', lastName: 'Bianchi', dateOfBirth: '1945-05-20',
            admissionDate: '2025-09-18', gender: 'M', bed: '8', admissionType: 'ordinario',
            mainDiagnosis: 'Versamento pleurico destro in studio',
            history: 'Ictus ischemico pregresso con emiparesi sinistra, demenza vascolare, diabete mellito tipo 2.',
            clinicalNotes: 'Allettato, poco collaborante. In ossigenoterapia. Sospetta eziologia neoplastica.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-18').getTime(), lastUpdated: reportDate, 
            handovers: [
                handoversTemplate.h1('Prevenzione lesioni da decubito, mobilizzazione nel letto.'),
                handoversTemplate.h1('Valutare stato nutrizionale con dietista.'),
            ], 
            externalExams: [
                examsTemplate.e1('laboratorio', 'Emocromo e PCR di controllo', 'Prelievo da eseguire domattina'),
                examsTemplate.e2('consulenze', 'Consulenza Neurologica', dayAfterTomorrow),
                examsTemplate.e2('radiologia', 'TC Torace con mdc', tomorrow),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Paolo', lastName: 'Romano', dateOfBirth: '1940-11-02',
            admissionDate: '2025-09-23', gender: 'M', bed: '6', admissionType: 'ordinario',
            mainDiagnosis: 'Neoplasia del colon con metastasi epatiche',
            history: 'Cardiopatia ischemica cronica, portatore di stent coronarico.',
            clinicalNotes: 'Presenta dolore addominale, in terapia antalgica con oppioidi. Condizioni generali scadute.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-23').getTime(), lastUpdated: reportDate, 
            handovers: [
                handoversTemplate.h1('Richiesta consulenza cure palliative.'),
                handoversTemplate.h1('Gestione del dolore, rivalutare VAS ogni 4 ore.'),
            ], 
            externalExams: [
                examsTemplate.e1('laboratorio', 'Marcatori tumorali (CEA)'),
                examsTemplate.e2('radiologia', 'Ecografia addome completo', dayAfterTomorrow, 'Paziente a digiuno da 6 ore'),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Mario', lastName: 'Esposito', dateOfBirth: '1960-07-22',
            admissionDate: '2025-09-28', gender: 'M', bed: '1', admissionType: 'ordinario',
            mainDiagnosis: 'Polmonite comunitaria (CAP)',
            history: 'Diabete Mellito di tipo 2 in terapia orale.',
            clinicalNotes: 'Iniziata terapia antibiotica empirica. Attualmente febbrile.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-28').getTime(), lastUpdated: reportDate,
            handovers: [
                handoversTemplate.h1('Monitoraggio della febbre e della saturazione.'),
                handoversTemplate.h1('Controllo glicemico prima dei pasti.'),
            ],
            externalExams: [
                examsTemplate.e1('laboratorio', 'Procalcitonina'),
                examsTemplate.e2('laboratorio', 'Urinocoltura', tomorrow),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Antonio', lastName: 'Russo', dateOfBirth: '1955-01-30',
            admissionDate: '2025-09-27', gender: 'M', bed: '2', admissionType: 'ordinario',
            mainDiagnosis: 'Trombosi Venosa Profonda (TVP) arto inferiore sx',
            history: 'Ipertensione arteriosa, obesità.',
            clinicalNotes: 'Iniziata terapia anticoagulante con eparina. Edema e dolore in miglioramento.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-27').getTime(), lastUpdated: reportDate,
            handovers: [
                handoversTemplate.h1('Mobilizzazione cauta come da indicazioni.'),
                handoversTemplate.h1('Monitoraggio parametri coagulativi (aPTT).'),
            ],
            externalExams: [
                examsTemplate.e2('radiologia', 'Ecodoppler di controllo tra 48h', dayAfterTomorrow),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Giuseppe', lastName: 'Ferrari', dateOfBirth: '1948-09-12',
            admissionDate: '2025-09-26', gender: 'M', bed: '3', admissionType: 'ordinario',
            mainDiagnosis: 'Scompenso epatico su cirrosi',
            history: 'Cirrosi epatica HCV correlata, pregressi episodi di ascite.',
            clinicalNotes: 'Paziente soporoso, presenta flapping tremor. Iniziata terapia per encefalopatia epatica.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-26').getTime(), lastUpdated: reportDate,
            handovers: [
                handoversTemplate.h1('Monitoraggio stato di coscienza (GCS).'),
                handoversTemplate.h1('Controllo ammoniemia.'),
                handoversTemplate.h1('Valutare paracentesi se aumento ascite.'),
            ],
            externalExams: [
                examsTemplate.e1('laboratorio', 'Funzionalità epatica completa'),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Sergio', lastName: 'Costa', dateOfBirth: '1939-12-08',
            admissionDate: '2025-09-29', gender: 'M', bed: '4', admissionType: 'ordinario',
            mainDiagnosis: 'Anemizzazione da rettorragia',
            history: 'Cardiopatia ischemica in terapia con antiaggreganti.',
            clinicalNotes: 'Stabile emodinamicamente dopo trasfusione di 2 GRC. Sospesa terapia antiaggregante.',
            severity: 'giallo', status: 'active', createdAt: reportDate, lastUpdated: reportDate,
            handovers: [
                handoversTemplate.h1('Monitoraggio Hb post-trasfusionale.'),
                handoversTemplate.h1('Contattare endoscopia per EGDS/Colonscopia in urgenza.'),
            ],
            externalExams: [
                examsTemplate.e2('consulenze', 'Consulenza Gastroenterologica', today),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Roberto', lastName: 'Marino', dateOfBirth: '1942-04-25',
            admissionDate: '2025-09-25', gender: 'M', bed: '5', admissionType: 'ordinario',
            mainDiagnosis: 'Sincope di ndd',
            history: 'Ipertensione, pregressa TIA.',
            clinicalNotes: 'Paziente asintomatico dopo episodio sincopale a domicilio. ECG e enzimi cardiaci negativi.',
            severity: 'verde', status: 'active', createdAt: new Date('2025-09-25').getTime(), lastUpdated: reportDate,
            handovers: [
                handoversTemplate.h1('Monitoraggio telemetrico.'),
                handoversTemplate.h1('Educare il paziente a non alzarsi bruscamente.'),
            ],
            externalExams: [
                examsTemplate.e2('radiologia', 'Ecocolordoppler TSA', tomorrow),
                examsTemplate.e1('consulenze', 'Consulenza Cardiologica per Holter'),
            ],
        },

        // LUNGODEGENZA UOMINI (2/2)
        {
            id: crypto.randomUUID(), firstName: 'Franco', lastName: 'Gallo', dateOfBirth: '1958-02-11',
            admissionDate: '2025-09-20', gender: 'M', bed: 'LDU1', admissionType: 'lungodegenza',
            mainDiagnosis: 'Recupero post-operatorio anca',
            history: 'Ipertensione',
            clinicalNotes: 'In attesa di trasferimento in struttura riabilitativa.',
            severity: 'verde', status: 'active', createdAt: new Date('2025-09-20').getTime(), lastUpdated: reportDate, 
            handovers: [
                handoversTemplate.h1('Mobilizzazione passiva assistita 2 volte al dì.'),
                handoversTemplate.h1('Medicazione ferita chirurgica a giorni alterni.'),
            ], 
            externalExams: [
                examsTemplate.e1('laboratorio', 'Controllo elettroliti'),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Aldo', lastName: 'De Luca', dateOfBirth: '1946-08-03',
            admissionDate: '2025-09-15', gender: 'M', bed: 'LDU2', admissionType: 'lungodegenza',
            mainDiagnosis: 'Esiti di ictus ischemico',
            history: 'Fibrillazione atriale, diabete.',
            clinicalNotes: 'Paziente con emiparesi destra e afasia motoria. Programma riabilitativo in corso.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-15').getTime(), lastUpdated: reportDate,
            handovers: [
                handoversTemplate.h1('Prevenzione delle cadute.'),
                handoversTemplate.h1('Logopedia 3 volte a settimana.'),
            ],
            externalExams: [
                examsTemplate.e2('consulenze', 'Controllo Fisiatrico', dayAfterTomorrow),
            ],
        },

        // DONNE (8/10, Letti liberi: 16, 17)
        {
            id: crypto.randomUUID(), firstName: 'Sofia', lastName: 'Greco', dateOfBirth: '1962-09-10',
            admissionDate: '2025-09-25', gender: 'F', bed: '20', admissionType: 'ordinario',
            mainDiagnosis: 'Ictus cerebellare recente',
            history: 'Ipertensione arteriosa, Fibrillazione atriale in TAO, protesi valvolare mitralica meccanica.',
            clinicalNotes: 'Presenta vertigini e atassia. Inizia percorso riabilitativo.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-25').getTime(), lastUpdated: reportDate, 
            handovers: [
                handoversTemplate.h1('Inizio FKT motoria e del cammino.'),
                handoversTemplate.h1('Controllo TAO (INR) domattina.'),
            ], 
            externalExams: [
                examsTemplate.e2('radiologia', 'Ecocardiogramma di controllo', dayAfterTomorrow),
                examsTemplate.e1('radiologia', 'Doppler TSA'),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Giulia', lastName: 'Conti', dateOfBirth: '1943-08-19',
            admissionDate: '2025-09-26', gender: 'F', bed: '19', admissionType: 'ordinario',
            mainDiagnosis: 'Dolore addominale in studio',
            history: 'Osteoporosi severa, sindrome ansioso-depressiva.',
            clinicalNotes: 'Tende a camminare da sola nel reparto, aumentato rischio cadute. In programma EGDS.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-26').getTime(), lastUpdated: reportDate, 
            handovers: [
                handoversTemplate.h1('Attenzione al rischio cadute, paziente poco collaborante.'),
                handoversTemplate.h1('Valutazione diario alimentare e monitoraggio alvo.'),
            ], 
            externalExams: [
                examsTemplate.e2('radiologia', 'Gastroscopia', tomorrow),
                examsTemplate.e1('laboratorio', 'Sangue occulto feci su 3 campioni'),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Maria', lastName: 'Bruno', dateOfBirth: '1948-11-25',
            admissionDate: '2025-09-19', gender: 'F', bed: '18', admissionType: 'ordinario',
            mainDiagnosis: 'Infezione delle vie urinarie complicata',
            history: 'Diabete Mellito tipo 2, Fibrillazione atriale cronica, scompenso cardiaco cronico.',
            clinicalNotes: 'In terapia antibiotica mirata. Attualmente apiretica. Da rivalutare funzione renale.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-19').getTime(), lastUpdated: reportDate, 
            handovers: [
                handoversTemplate.h1('Controllare esami urine e PCR a 48h.'),
                handoversTemplate.h1('Valutare stato di idratazione e bilancio idrico.'),
            ], 
            externalExams: [
                examsTemplate.e1('laboratorio', 'Creatinina e urea di controllo'),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Elena', lastName: 'Rizzo', dateOfBirth: '1951-04-01',
            admissionDate: '2025-09-29', gender: 'F', bed: '11', admissionType: 'ordinario',
            mainDiagnosis: 'Scompenso cardiaco riacutizzato',
            history: 'Ipertensione, diabete, cardiopatia ischemica.',
            clinicalNotes: 'Stabile dopo terapia diuretica e.v. Netto miglioramento della dispnea.',
            severity: 'verde', status: 'active', createdAt: reportDate, lastUpdated: reportDate, 
            handovers: [
                handoversTemplate.h1('Controllo peso corporeo giornaliero.'),
                handoversTemplate.h1('Programmare switch a terapia diuretica orale.'),
            ], 
            externalExams: [
                examsTemplate.e2('laboratorio', 'BNP di controllo', dayAfterTomorrow),
                examsTemplate.e1('laboratorio', 'Iono plasmatico e funzione renale'),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Laura', lastName: 'Galli', dateOfBirth: '1970-03-05',
            admissionDate: '2025-09-28', gender: 'F', bed: '12', admissionType: 'ordinario',
            mainDiagnosis: 'Pielonefrite acuta',
            history: 'Nessuna patologia di rilievo.',
            clinicalNotes: 'Presenta febbre e dolore lombare. Iniziata terapia antibiotica dopo prelievi colturali.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-28').getTime(), lastUpdated: reportDate,
            handovers: [
                handoversTemplate.h1('Assicurare adeguata idratazione.'),
                handoversTemplate.h1('Monitorare la risposta alla terapia antibiotica.'),
            ],
            externalExams: [
                examsTemplate.e1('laboratorio', 'Emocolture x2'),
                examsTemplate.e2('radiologia', 'Ecografia renale', tomorrow),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Chiara', lastName: 'Fontana', dateOfBirth: '1949-10-18',
            admissionDate: '2025-09-27', gender: 'F', bed: '13', admissionType: 'ordinario',
            mainDiagnosis: 'Fibrillazione Atriale ad alta risposta ventricolare',
            history: 'Ipertensione arteriosa, dislipidemia.',
            clinicalNotes: 'Ritmo cardiaco controllato con terapia farmacologica. Emodinamicamente stabile.',
            severity: 'verde', status: 'active', createdAt: new Date('2025-09-27').getTime(), lastUpdated: reportDate,
            handovers: [
                handoversTemplate.h1('Valutare inizio terapia anticoagulante.'),
                handoversTemplate.h1('Monitoraggio ECG continuo.'),
            ],
            externalExams: [
                examsTemplate.e2('consulenze', 'Consulenza Cardiologica', today),
                examsTemplate.e1('laboratorio', 'Funzione tiroidea (TSH, FT4)'),
            ],
        },
        {
            id: crypto.randomUUID(), firstName: 'Caterina', lastName: 'Santoro', dateOfBirth: '1938-05-29',
            admissionDate: '2025-09-26', gender: 'F', bed: '14', admissionType: 'ordinario',
            mainDiagnosis: 'Delirium ipercinetico',
            history: 'Demenza senile, ipertensione.',
            clinicalNotes: 'Paziente agitata e disorientata, soprattutto nelle ore notturne. In corso ricerca di cause scatenanti.',
            severity: 'giallo', status: 'active', createdAt: new Date('2025-09-26').getTime(), lastUpdated: reportDate,
            handovers: [
                handoversTemplate.h1('Garantire ambiente tranquillo e illuminato.'),
                handoversTemplate.h1('Evitare mezzi di contenzione se possibile.'),
            ],
            externalExams: [
                examsTemplate.e1('laboratorio', 'Esame urine e indici di flogosi'),
                examsTemplate.e2('consulenze', 'Valutazione Geriatrica', tomorrow),
            ],
        },
         {
            id: crypto.randomUUID(), firstName: 'Silvia', lastName: 'Colombo', dateOfBirth: '1965-11-11',
            admissionDate: '2025-09-29', gender: 'F', bed: '15', admissionType: 'ordinario',
            mainDiagnosis: 'Chetoacidosi diabetica',
            history: 'Diabete Mellito tipo 1 di lunga data.',
            clinicalNotes: 'Quadro clinico in miglioramento dopo idratazione e infusione insulinica. Gap anionico in riduzione.',
            severity: 'giallo', status: 'active', createdAt: reportDate, lastUpdated: reportDate,
            handovers: [
                handoversTemplate.h1('Monitoraggio glicemico orario.'),
                handoversTemplate.h1('Controllo emogasanalisi seriati.'),
            ],
            externalExams: [
                examsTemplate.e1('laboratorio', 'Elettroliti, con focus sul potassio'),
                examsTemplate.e2('consulenze', 'Consulenza Diabetologica', dayAfterTomorrow),
            ],
        },

        // LUNGODEGENZA DONNE (1/2, Letto libero: LDD2)
        {
            id: crypto.randomUUID(), firstName: 'Anna', lastName: 'Moretti', dateOfBirth: '1942-06-15',
            admissionDate: '2025-09-22', gender: 'F', bed: 'LDD1', admissionType: 'lungodegenza',
            mainDiagnosis: 'Lesione da decubito sacrale III stadio',
            history: 'Morbo di Alzheimer, diabete mellito tipo II, ipertensione arteriosa.',
            clinicalNotes: 'Necessita di medicazioni avanzate giornaliere e supporto nutrizionale.',
            severity: 'rosso', status: 'active', createdAt: new Date('2025-09-22').getTime(), lastUpdated: reportDate, 
            handovers: [
                handoversTemplate.h1('Medicazione lesione sacrale con schiuma di poliuretano.'),
                handoversTemplate.h1('Garantire apporto proteico adeguato.'),
            ], 
            externalExams: [
                examsTemplate.e2('consulenze', 'Consulenza Fisiatrica per presidi', tomorrow),
                examsTemplate.e1('laboratorio', 'Albumina e prealbumina'),
            ],
        },
    ];

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