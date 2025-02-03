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
import CriarPedido from './components/CriarPedido';
import NewSidebar from './components/NewSidebar';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { Box } from '@mui/joy';
import Header from './components/Header';
import OrderList from './components/OrderList';
import OrderTable from './components/OrderTable';
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
        return  <Box
        sx={{
          display: 'flex',
          mb: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      > <OrderTable /> <OrderList /></Box>
      case 'estampas':
        return <ListaProdutoras onSelectProdutora={setSelectedProdutora} />;
      case 'criarPedido':
        return <CriarPedido onSelectScreen={setSelectedScreen} />;
      case 'dashboard': // Adicionado
        return <Dashboard />;
      default:
        return <Estoque />;
    }
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Header />
        <NewSidebar onSelectScreen={setSelectedScreen} onLogout={handleLogout} selectedScreen={selectedScreen} />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
          }}
        >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderContent()}
        </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default App;