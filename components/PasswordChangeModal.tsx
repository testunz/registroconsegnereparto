import React, { useState } from 'react';
import Modal from './Modal';
import { useUser } from '../context/UserContext';

interface PasswordChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ isOpen, onClose }) => {
    const { changePassword } = useUser();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError("Le nuove password non coincidono.");
            return;
        }
        
        const result = changePassword(oldPassword, newPassword);

        if (result.success) {
            setSuccess(result.message);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                onClose();
                setSuccess('');
            }, 2000);
        } else {
            setError(result.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Cambia Password">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Vecchia Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        required
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nuova Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        required
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Conferma Nuova Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        required
                    />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                {success && <p className="text-sm text-green-500 text-center">{success}</p>}
                <div className="flex justify-end pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-base font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500">Annulla</button>
                    <button type="submit" className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Salva Password</button>
                </div>
            </form>
        </Modal>
    );
};

export default PasswordChangeModal;
