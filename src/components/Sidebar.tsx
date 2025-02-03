import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Drawer, Button, Box, Typography, IconButton } from '@mui/joy';

type SidebarProps = {
  onSelectScreen: (screen: string) => void;
  onLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onSelectScreen, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  // Detecta o scroll para mostrar ou ocultar o botão "Voltar ao Topo"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 200); // Mostra o botão ao rolar mais de 200px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const menuItems = [
    { label: 'Estoque', screen: 'estoque' },
    { label: 'Pedidos', screen: 'pedidos' },
    { label: 'Dashboard', screen: 'dashboard' },
    { label: 'Estampas', screen: 'estampas' },
  ];

  const renderMenuItems = () =>
    menuItems.map((item) => (
      <li key={item.screen}>
        <Button
          onClick={() => {
            onSelectScreen(item.screen);
            setDrawerOpen(false);
          }}
          variant="plain"
          sx={{
            textAlign: 'left',
            width: '100%',
            color: 'white',
            '&:hover': {
              backgroundColor: 'green',
            },
          }}
        >
          {item.label}
        </Button>
      </li>
    ));

  return (
    <>
      {/* Navbar fixa para dispositivos menores */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'black',
          color: 'white',
          px: 2,
          py: 1,
          position: 'fixed',
          width: '100%',
          zIndex: 1100,
          top: 0,
        }}
      >
           <IconButton
          onClick={() => setDrawerOpen(true)}
          variant="plain"
          sx={{ color: 'white' }}
        >
          <>Menu</>
        </IconButton>
        <Typography level="h2" fontSize="lg" sx={{ color: 'white' }}>
          BiluGeek
        </Typography>
     
      </Box>

      {/* Drawer para dispositivos menores */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: 'block', sm: 'none' } }}
        
      >
        <Box
          sx={{
            width: 300,
            height: '100%',
            bgcolor: 'black',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            padding: 2,
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Typography level="h2" fontSize="lg" textAlign="center" py={2} sx={{ color: 'white' }}>
              BiluGeek
            </Typography>
            <ul className="space-y-4 p-4">{renderMenuItems()}</ul>
          </div>
          <Button
            onClick={handleLogout}
            variant="solid"
            color="success"
            sx={{ textAlign: 'left', width: '100%' }}
          >
            Sair
          </Button>
        </Box>
      </Drawer>

      {/* Sidebar para dispositivos maiores */}
      <Box
        sx={{
          width: 250,
          height: '100%',
          bgcolor: 'black',
          color: 'white',
          display: { xs: 'none', sm: 'flex' },
          position: 'fixed',
          top: 0,
          left: 0,
          justifyContent: 'space-between',
          flexDirection: 'column',
          padding: 2
        }}
      >
        <div>
        <Typography level="h2" fontSize="lg" textAlign="center" sx={{ color: 'white' }} py={2}>
          BiluGeek
        </Typography>
        <ul className="space-y-4 p-4">{renderMenuItems()}</ul>
        </div>
        <Button
          onClick={handleLogout}
          variant="solid"
          color="success"
          sx={{ textAlign: 'left', width: '100%' }}
        >
          Sair
        </Button>
      </Box>

      {/* Botão flutuante para voltar ao topo */}
      {showScrollToTop && (
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1200,
            bgcolor: 'black',
            color: 'white',
            '&:hover': {
              bgcolor: 'green',
            },
          }}
        >
          {'/\\'}
        </IconButton>
      )}
    </>
  );
};

export default Sidebar;
