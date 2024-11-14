import React from 'react';
import { supabase } from '../supabaseClient';

type SidebarProps = {
  onSelectScreen: (screen: string) => void;
  onLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onSelectScreen, onLogout  }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut(); // Desloga o usuário do Supabase
    onLogout(); // Atualiza o estado de logout na aplicação principal
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <h2 className="text-2xl font-bold p-4">Menu</h2>
      <button
        onClick={() => onSelectScreen('pacientes')}
        className="p-4 hover:bg-gray-700 text-left"
      >
        Pacientes
      </button>
      <button
        onClick={() => onSelectScreen('settings')}
        className="p-4 hover:bg-gray-700 text-left"
      >
        Configurações
      </button>
      <div className="mt-auto p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded text-white font-semibold"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;