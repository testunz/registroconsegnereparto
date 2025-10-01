import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { USERS } from '../constants';
import RecoveryModal from './RecoveryModal';

const Login: React.FC = () => {
  const { login } = useUser();
  const [selectedUser, setSelectedUser] = useState(USERS[0]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(selectedUser, password);
    if (!success) {
      setError('Password non corretta. Riprova.');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 text-center">
            Accesso al Registro
          </h1>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
            Seleziona il tuo nome e inserisci la password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="user-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nome Utente
              </label>
              <select
                id="user-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                {USERS.map(user => <option key={user} value={user}>{user}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-3 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Accedi
            </button>
          </form>
          <div className="text-center mt-6">
            <button
                onClick={() => setIsRecoveryModalOpen(true)}
                className="text-sm text-blue-600 hover:underline dark:text-blue-500"
            >
                Password dimenticata? (Solo Admin)
            </button>
          </div>
        </div>
      </div>
      <RecoveryModal 
        isOpen={isRecoveryModalOpen} 
        onClose={() => setIsRecoveryModalOpen(false)} 
      />
    </>
  );
};

export default Login;