import React, { useState } from 'react';
import Modal from './Modal';
import { useUser } from '../context/UserContext';
import { ADMIN_USERS, RECOVERY_KEY } from '../constants';

interface RecoveryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RecoveryModal: React.FC<RecoveryModalProps> = ({ isOpen, onClose }) => {
    const { resetUserPassword } = useUser();
    const [step, setStep] = useState(1);
    const [recoveryKeyInput, setRecoveryKeyInput] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState(ADMIN_USERS[0]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleVerifyKey = () => {
        setError('');
        if (recoveryKeyInput === RECOVERY_KEY) {
            setStep(2);
        } else {
            setError('Codice di recupero non valido.');
        }
    };

    const handleResetPassword = () => {
        setError('');
        setSuccess('');
        const result = resetUserPassword(selectedAdmin);
        if (result.success) {
            setSuccess(`Password per ${selectedAdmin} resettata con successo a "1". La finestra si chiuderà tra poco.`);
            setTimeout(() => {
                handleClose();
            }, 3000);
        } else {
            setError(result.message);
        }
    };

    const handleClose = () => {
        setStep(1);
        setRecoveryKeyInput('');
        setError('');
        setSuccess('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Recupero Password Amministratore">
            <div className="space-y-6">
                {step === 1 && (
                    <>
                        <div>
                            <label htmlFor="recovery-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Codice di Recupero di Sistema
                            </label>
                            <input
                                id="recovery-key"
                                type="password"
                                value={recoveryKeyInput}
                                onChange={(e) => setRecoveryKeyInput(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <div className="flex justify-end pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
                            <button onClick={handleClose} className="px-4 py-2 text-base font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500">Annulla</button>
                            <button onClick={handleVerifyKey} className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Verifica Codice</button>
                        </div>
                    </>
                )}
                {step === 2 && (
                    <>
                         <div>
                            <label htmlFor="admin-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Seleziona Amministratore
                            </label>
                            <select
                                id="admin-select"
                                value={selectedAdmin}
                                onChange={(e) => setSelectedAdmin(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            >
                                {ADMIN_USERS.map(user => <option key={user} value={user}>{user}</option>)}
                            </select>
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        {success && <p className="text-sm text-green-500 text-center">{success}</p>}
                        <div className="flex justify-end pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
                            <button onClick={handleClose} className="px-4 py-2 text-base font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500">Annulla</button>
                            <button onClick={handleResetPassword} className="px-4 py-2 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Resetta Password</button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default RecoveryModal;
