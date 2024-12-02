import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Estoque from './components/Estoque';
import Login from './components/Login';
import Pedidos from './components/Pedidos';
import ListaProdutoras from './components/ListaProdutoras';
import ImagensProdutora from './components/ImagensProdutora';
import { supabase } from './supabaseClient';
import useIsMobile from './hooks/useIsMobile';
import Dashboard from './components/Dashboard';
import { Box } from '@mui/joy';

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
      case 'dashboard': // Adicionado
        return <Dashboard />;
      default:
        return <Estoque />;
    }
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <Box
        sx={{
          marginTop: { xs: '50px', sm: 0 }, // Adiciona espaço para Navbar em telas pequenas
        }}
      >
        {/* Conteúdo principal */}
        <Box>
        <Sidebar onSelectScreen={setSelectedScreen} onLogout={handleLogout} />
        <div className={`flex-grow p-2 bg-gray-100 min-h-screen ${!isMobile ? 'ml-64' : ''}`}>
          {renderContent()}
        </div>
        </Box>
      </Box>
   
  );
};

export default App;