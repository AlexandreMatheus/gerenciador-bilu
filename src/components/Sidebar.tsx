import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Drawer, Button, Box, Typography } from '@mui/joy';

type SidebarProps = {
  onSelectScreen: (screen: string) => void;
  onLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onSelectScreen, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Desloga o usuário do Supabase
    onLogout(); // Atualiza o estado de logout na aplicação principal
  };

  return (
    <>
      {/* Botão para abrir o Drawer */}
      <Button
        onClick={() => setDrawerOpen(true)}
        variant="solid"
        color="primary"
        sx={{
          display: { xs: 'block', sm: 'none' }, // Mostra apenas em dispositivos móveis
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1100,
        }}
      >
        Menu
      </Button>

      {/* Drawer para dispositivos móveis */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: 'block', sm: 'none' } }} // Mostra apenas em dispositivos móveis
      >
        <Box
          sx={{
            width: 300,
            height: '100%',
            bgcolor: 'black',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography level="h2" fontSize="lg" textAlign="center" py={2}>
            BiluGeek
          </Typography>
          <ul className="space-y-4 p-4">
            <li>
              <Button
                onClick={() => {
                  onSelectScreen('estoque');
                  setDrawerOpen(false);
                }}
                
                variant="plain"
                sx={{ textAlign: 'left', width: '100%' }}
              >
                Estoque
              </Button>
            </li>
            <li>
              <Button
                onClick={handleLogout}
                variant="solid"
                color="success"
                sx={{ textAlign: 'left', width: '100%' }}
              >
                Sair
              </Button>
            </li>
          </ul>
        </Box>
      </Drawer>

      {/* Menu fixo para telas maiores */}
      <Box
        sx={{
          width: 250,
          height: '100vh',
          bgcolor: 'black',
          color: 'white',
          display: { xs: 'none', sm: 'block' }, // Remove completamente o menu em telas menores
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      >
        <Typography level="h2" fontSize="lg" textAlign="center" sx={{color: 'white'}} py={2}>
          BiluGeek
        </Typography>
        <ul className="space-y-4 p-4">
          <li>
            <Button
              onClick={() => {
                onSelectScreen('estoque');
                setDrawerOpen(false);
              }}
              variant="plain"
              sx={{
                textAlign: 'left',
                width: '100%',
                color: 'white', // Cor branca no texto
                '&:hover': {
                  backgroundColor: 'green', // Fundo verde no hover
                },
              }}
            >
              Estoque
            </Button>
          </li>
          <li>
            <Button
              onClick={handleLogout}
              variant="solid"
              color="success"
              sx={{ textAlign: 'left', width: '100%' }}
            >
              Sair
            </Button>
          </li>
        </ul>
      </Box>
    </>
  );
};

export default Sidebar;
