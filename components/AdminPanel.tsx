import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { User } from '../types';
import ConfirmationModal from './ConfirmationModal';

const AdminPanel: React.FC = () => {
  const { currentUser, fetchAllUsers, resetUserPassword } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [userToReset, setUserToReset] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    setUsers(fetchAllUsers());
  }, [fetchAllUsers]);

  const handleResetClick = (user: User) => {
    if (user.name === currentUser) {
      alert("Non puoi resettare la tua stessa password da questo pannello. Usa l'opzione 'Cambia Password' nel menu utente.");
      return;
    }
    setUserToReset(user);
  };
  
  const handleConfirmReset = () => {
    if (!userToReset) return;
    const result = resetUserPassword(userToReset.name);
    
    setFeedback(result);
    setTimeout(() => setFeedback(null), 3000);

    setUserToReset(null);
  };


  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg animate-fade-in dark:bg-slate-800">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">Gestione Utenti</h2>
        {feedback && (
          <div className={`p-4 mb-4 rounded-md text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'}`}>
            {feedback.message}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-base text-left text-slate-500 dark:text-slate-400">
            <thead className="text-sm text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-l-lg">Nome Utente</th>
                <th scope="col" className="px-6 py-3 rounded-r-lg text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.name} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleResetClick(user)}
                      disabled={user.name === currentUser}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed"
                    >
                      Resetta Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!userToReset}
        onClose={() => setUserToReset(null)}
        onConfirm={handleConfirmReset}
        title="Conferma Reset Password"
        message={`Sei sicuro di voler resettare la password per l'utente "${userToReset?.name}"? La sua password verrà impostata al valore predefinito "1".`}
        confirmButtonText="Sì, resetta"
      />
    </>
  );
};

export default AdminPanel;