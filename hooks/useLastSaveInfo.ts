import { useState, useEffect } from 'react';
import { getBackupList } from '../services/backupService';
import { BackupMeta } from '../types';
import { usePatients } from './usePatients';

export const useLastSaveInfo = (): BackupMeta | null => {
    const [lastSave, setLastSave] = useState<BackupMeta | null>(null);
    // We listen to patients array changes to trigger a re-fetch of the backup list
    const { patients } = usePatients(); 

    useEffect(() => {
        const fetchLastSave = async () => {
            const backups = await getBackupList();
            if (backups.length > 0) {
                // The list is sorted newest first, so the first element is the latest
                setLastSave(backups[0]);
            }
        };

        fetchLastSave();

    }, [patients]); // Dependency array ensures this runs when patient data changes

    return lastSave;
};