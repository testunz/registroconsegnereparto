import React from 'react';
import MainLayout from './components/MainLayout';
import { useUser } from './context/UserContext';
import Login from './components/Login';

const App: React.FC = () => {
  const { currentUser } = useUser();

  if (!currentUser) {
    return <Login />;
  }

  return <MainLayout />;
};

export default App;
