import { Patient } from '../types';

const DB_KEY = 'medicina-interna-soverato-db-v3';

interface AppDatabase {
  patients: Patient[];
}

const initializeDatabase = (): AppDatabase => {
  const db: AppDatabase = {
    patients: [],
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
    return {
      patients: db.patients || [],
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
        const existingPatient = patientMap.get(importedPatient.id);
        if (existingPatient) {
          if (importedPatient.lastUpdated > existingPatient.lastUpdated) {
            patientMap.set(importedPatient.id, importedPatient);
          }
        } else {
          patientMap.set(importedPatient.id, importedPatient);
        }
      });
      currentDb.patients = Array.from(patientMap.values());
      
      saveDb(currentDb);
      onComplete(true, "Dati pazienti importati e uniti con successo.");
    } catch (error) {
      console.error("Failed to import data", error);
      onComplete(false, "Errore durante l'importazione. Controlla il formato del file.");
    }
  };
  reader.readAsText(file);
};