import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Estoque from './components/Estoque';
import Login from './components/Login';
import Pedidos from './components/Pedidos';
import ListaProdutoras from './components/ListaProdutoras';
import ImagensProdutora from './components/ImagensProdutora';
import { supabase } from './supabaseClient';
import useIsMobile from './hooks/useIsMobile';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [selectedScreen, setSelectedScreen] = useState<string>('estoque');
  const [selectedProdutora, setSelectedProdutora] = useState<string | null>(null);
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
    setIsLoggedIn(false);
    setSelectedScreen('login');
  };

  const renderContent = () => {
    if (selectedProdutora) {
      return (
        <ImagensProdutora
          produtora={selectedProdutora}
          onBack={() => setSelectedProdutora(null)}
        />
      );
    }

    switch (selectedScreen) {
      case 'estoque':
        return <Estoque />;
      case 'pedidos':
        return <Pedidos />;
      case 'estampas':
        return <ListaProdutoras onSelectProdutora={setSelectedProdutora} />;
      default:
        return <Estoque />;
    }
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex">
      <Sidebar onSelectScreen={setSelectedScreen} onLogout={handleLogout} />
      <div className={`flex-grow p-2 bg-gray-100 min-h-screen ${!isMobile ? 'ml-64' : ''}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default App;