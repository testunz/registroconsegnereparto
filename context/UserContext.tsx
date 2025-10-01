import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { initUsers, authenticate, changePassword as changePasswordService, getAllUsers, resetPasswordForUser } from '../services/userService';
import { ADMIN_USERS } from '../constants';
import { User } from '../types';

interface UserContextType {
  currentUser: string | null;
  isAdmin: boolean;
  login: (name: string, password: string) => boolean;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => ReturnType<typeof changePasswordService>;
  fetchAllUsers: () => User[];
  resetUserPassword: (name: string) => ReturnType<typeof resetPasswordForUser>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(() => sessionStorage.getItem('currentUser'));

  useEffect(() => {
    // Initialize the user database on first load
    initUsers();
  }, []);
  
  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    return ADMIN_USERS.includes(currentUser);
  }, [currentUser]);

  const login = useCallback((name: string, password: string): boolean => {
    const isAuthenticated = authenticate(name, password);
    if (isAuthenticated) {
      setCurrentUser(name);
      sessionStorage.setItem('currentUser', name);
    }
    return isAuthenticated;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  }, []);

  const changePassword = useCallback((oldPassword: string, newPassword: string) => {
    if (!currentUser) {
        return { success: false, message: "Nessun utente loggato." };
    }
    return changePasswordService(currentUser, oldPassword, newPassword);
  }, [currentUser]);

  const fetchAllUsers = useCallback(() => {
    return getAllUsers();
  }, []);

  const resetUserPassword = useCallback((name: string) => {
    if (!isAdmin) {
      return { success: false, message: "Azione non autorizzata." };
    }
    return resetPasswordForUser(name);
  }, [isAdmin]);

  return (
    <UserContext.Provider value={{ currentUser, isAdmin, login, logout, changePassword, fetchAllUsers, resetUserPassword }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};