import { USERS } from '../constants';
import { User } from '../types';

const USERS_DB_KEY = 'medicina-interna-users-db-v1';

const getUsers = (): User[] => {
    try {
        const data = localStorage.getItem(USERS_DB_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

// Initialize users with a default password if they don't exist
export const initUsers = () => {
    const storedUsers = getUsers();
    const userMap = new Map(storedUsers.map(u => [u.name, u]));

    // Add new users from constants if they don't exist
    let updated = false;
    USERS.forEach(name => {
        if (!userMap.has(name)) {
            userMap.set(name, { name, password: '1' });
            updated = true;
        }
    });

    if (storedUsers.length === 0 || updated) {
        saveUsers(Array.from(userMap.values()));
    }
};

export const authenticate = (name: string, passwordAttempt: string): boolean => {
    const users = getUsers();
    const user = users.find(u => u.name === name);
    return !!user && user.password === passwordAttempt;
};

export const changePassword = (name: string, oldPasswordAttempt: string, newPassword: string): { success: boolean, message: string } => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.name === name);

    if (userIndex === -1) {
        return { success: false, message: "Utente non trovato." };
    }

    if (users[userIndex].password !== oldPasswordAttempt) {
        return { success: false, message: "La vecchia password non è corretta." };
    }

    if (!newPassword || newPassword.length < 1) {
        return { success: false, message: "La nuova password non può essere vuota." };
    }

    users[userIndex].password = newPassword;
    saveUsers(users);
    return { success: true, message: "Password modificata con successo." };
};

export const getAllUsers = (): User[] => {
    // Return users without passwords for security, though not critical with localStorage
    return getUsers().map(({ name }) => ({ name }));
};

export const resetPasswordForUser = (name: string): { success: boolean, message: string } => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.name === name);

    if (userIndex === -1) {
        return { success: false, message: "Utente non trovato." };
    }

    users[userIndex].password = '1'; // Reset to default
    saveUsers(users);
    return { success: true, message: `Password per ${name} resettata con successo.` };
};