import React, { useState, useEffect } from 'react';
import { Patient, ExternalExam, ExamStatus } from '../types';
import { usePatients } from '../hooks/usePatients';
import { EXAM_STATUS_NAMES } from '../constants';
import Modal from './Modal';

interface ExamEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient;
    exam: ExternalExam;
}

const ExamEditModal: React.FC<ExamEditModalProps> = ({ isOpen, onClose, patient, exam }) => {
    const { updateExternalExam, deleteExternalExam } = usePatients();

    const [formData, setFormData] = useState({
        status: exam.status,
        reminderDate: exam.reminderDate || '',
        appointmentDate: exam.appointmentDate || '',
    });

    useEffect(() => {
        setFormData({
            status: exam.status,
            reminderDate: exam.reminderDate || '',
            appointmentDate: exam.appointmentDate || '',
        });
    }, [exam]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSetAppointmentTomorrow = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setFormData(prev => ({ ...prev, appointmentDate: tomorrow.toISOString().slice(0, 10) }));
        } else {
            setFormData(prev => ({ ...prev, appointmentDate: exam.appointmentDate || '' }));
        }
    };

    const handleSetReminderTomorrow = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setFormData(prev => ({ ...prev, reminderDate: tomorrow.toISOString().slice(0, 10) }));
        } else {
            setFormData(prev => ({ ...prev, reminderDate: exam.reminderDate || '' }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateExternalExam(patient.id, exam.id, {
            ...formData,
            reminderDate: formData.reminderDate || null,
            appointmentDate: formData.appointmentDate || null,
        });
        onClose();
    };

    const handleDelete = () => {
        deleteExternalExam(patient.id, exam.id);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Modifica Esame: ${exam.description}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">{patient.lastName} {patient.firstName}</p>
                
                <div>
                    <label htmlFor="status" className="block text-base font-medium text-slate-700 mb-1 dark:text-slate-300">Stato Esame</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                        {Object.entries(EXAM_STATUS_NAMES).map(([key, value]) => <option key={key} value={key as ExamStatus}>{value}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="reminderDate" className="block text-base font-medium text-slate-700 mb-1 dark:text-slate-300">Data Promemoria</label>
                        <input type="date" id="reminderDate" name="reminderDate" value={formData.reminderDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                        <div className="flex items-center mt-2">
                          <input type="checkbox" id="setReminderTomorrowModal" onChange={handleSetReminderTomorrow} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="setReminderTomorrowModal" className="ml-2 block text-base text-gray-900 dark:text-gray-300">Imposta a domani</label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="appointmentDate" className="block text-base font-medium text-slate-700 mb-1 dark:text-slate-300">Data Appuntamento</label>
                        <input type="date" id="appointmentDate" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                        <div className="flex items-center mt-2">
                          <input type="checkbox" id="setTomorrowModal" onChange={handleSetAppointmentTomorrow} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="setTomorrowModal" className="ml-2 block text-base text-gray-900 dark:text-gray-300">Imposta a domani</label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button type="button" onClick={handleDelete} className="px-4 py-2 text-base font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80">Elimina Esame</button>
                    <div className="space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-base font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500">Annulla</button>
                        <button type="submit" className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Salva Modifiche</button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ExamEditModal;