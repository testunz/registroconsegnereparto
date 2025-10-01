import { AppDatabase, BackupMeta } from "../types";

const DB_NAME = 'medicina-interna-backups';
const STORE_NAME = 'db_backups';
const DB_VERSION = 1;

interface BackupEntry {
    timestamp: number;
    user: string;
    data: string; // The JSON string of the AppDatabase
}

const openDb = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject("Errore nell'apertura di IndexedDB per i backup.");
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'timestamp' });
            }
        };
    });
};

export const addBackup = async (dbString: string, user: string): Promise<void> => {
    try {
        const db = await openDb();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const backupEntry: BackupEntry = {
            timestamp: Date.now(),
            user,
            data: dbString,
        };
        store.add(backupEntry);
    } catch (error) {
        console.error("Impossibile salvare il backup automatico.", error);
    }
};

export const getBackupList = async (): Promise<BackupMeta[]> => {
    try {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onerror = () => reject("Errore nel recupero della lista di backup.");
            request.onsuccess = () => {
                const backups: BackupEntry[] = request.result;
                const metaList = backups.map(b => {
                    try {
                        const dbContent: Partial<AppDatabase> = JSON.parse(b.data);
                        return {
                            timestamp: b.timestamp,
                            patientCount: dbContent.patients?.length || 0,
                            noteCount: dbContent.wardNotes?.length || 0,
                            user: b.user || 'Sconosciuto',
                        };
                    } catch {
                        return { timestamp: b.timestamp, patientCount: 0, noteCount: 0, user: 'Sconosciuto' };
                    }
                }).sort((a, b) => b.timestamp - a.timestamp); // Newest first
                resolve(metaList);
            };
        });
    } catch (error) {
        console.error("Impossibile recuperare la lista dei backup.", error);
        return [];
    }
};


export const restoreBackup = async (timestamp: number): Promise<boolean> => {
    try {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(timestamp);
            
            request.onerror = () => reject("Errore nel recupero del backup per il ripristino.");
            request.onsuccess = () => {
                const backup: BackupEntry | undefined = request.result;
                if (backup) {
                    localStorage.setItem('medicina-interna-soverato-db-v4', backup.data);
                    resolve(true);
                } else {
                    reject("Backup non trovato.");
                    resolve(false);
                }
            }
        });
    } catch (error) {
        console.error("Impossibile ripristinare il backup.", error);
        return false;
    }
};

export const clearBackups = async (): Promise<void> => {
    try {
        const db = await openDb();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.clear();
    } catch (error) {
        console.error("Impossibile cancellare i backup.", error);
    }
};
