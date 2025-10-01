import React, { useState, useEffect } from 'react';
import { Patient, Severity } from '../types';
import { usePatients } from '../hooks/usePatients';
import { SEVERITY_NAMES } from '../constants';
import Modal from './Modal';

interface SeverityEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient;
}

const SeverityEditModal: React.FC<SeverityEditModalProps> = ({ isOpen, onClose, patient }) => {
    const { updatePatient } = usePatients();
    const [selectedSeverity, setSelectedSeverity] = useState<Severity>(patient.severity);

    useEffect(() => {
        if (isOpen) {
            setSelectedSeverity(patient.severity);
        }
    }, [isOpen, patient.severity]);

    const handleSave = () => {
        if (selectedSeverity !== patient.severity) {
            updatePatient(patient.id, { severity: selectedSeverity });
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Modifica Codice di Gravità">
            <div className="space-y-6">
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    Seleziona il nuovo codice di gravità per il paziente <strong>{patient.lastName} {patient.firstName}{patient.admissionType === 'lungodegenza' && ' (LD)'}</strong>.
                </p>
                <div>
                    <label htmlFor="severity-select" className="block text-base font-medium text-slate-700 mb-1 dark:text-slate-300">Codice Gravità</label>
                    <select
                        id="severity-select"
                        value={selectedSeverity}
                        onChange={(e) => setSelectedSeverity(e.target.value as Severity)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                    >
                        {Object.entries(SEVERITY_NAMES).map(([key, value]) => (
                            <option key={key} value={key as Severity}>{value.replace("Condizioni ", "")}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-base font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500">
                        Annulla
                    </button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Salva Modifica
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SeverityEditModal;