import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Estoque from './components/Estoque';
import Login from './components/Login';
import { supabase } from './supabaseClient';
import useIsMobile from './hooks/useIsMobile';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [selectedScreen, setSelectedScreen] = useState<string>('estoque');
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false); // Define como não logado e redireciona para o login
    setSelectedScreen('login');
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  const renderContent = () => {
    switch (selectedScreen) {
      case 'estoque':
        return <Estoque />;
      default:
        return <Estoque />;
    }
  };

  return (
    <div className="flex">
      <Sidebar onSelectScreen={setSelectedScreen} onLogout={handleLogout}/>
      <div className={`flex-grow p-2 bg-gray-100 min-h-screen ${!isMobile ? 'ml-64' : ''}`}>{renderContent()}</div>
    </div>
  );
};


export default App;
