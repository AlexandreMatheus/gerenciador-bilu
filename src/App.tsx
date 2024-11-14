import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Pacientes from './components/Pacientes';
import Settings from './components/Settings';
import Login from './components/Login';
import VisualizarPaciente from './components/VisualizarPaciente';
import FormularioConsulta from './components/FormularioConsulta';
import { supabase } from './supabaseClient';

type Patient = {
  id: number;
  name: string;
  age: number;
  responsible: string;
  sessions: { id: number; date: string; completed: boolean }[];
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [selectedScreen, setSelectedScreen] = useState<string>('pacientes');
  const [viewingPatientId, setViewingPatientId] = useState<number | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();
  }, []);
  
  // Mock de dados para todos os pacientes
  const [patients] = useState<Patient[]>([
    {
      id: 1,
      name: 'Alice Souza',
      age: 29,
      responsible: 'Ana Maria',
      sessions: [
        { id: 1, date: '2024-11-01', completed: true },
        { id: 2, date: '2024-11-08', completed: true },
        { id: 3, date: '2024-11-15', completed: false },
      ],
    },
    {
      id: 2,
      name: 'Bruno Oliveira',
      age: 34,
      responsible: 'Carlos Mendes',
      sessions: [
        { id: 1, date: '2024-11-03', completed: true },
        { id: 2, date: '2024-11-10', completed: false },
      ],
    },
    {
      id: 3,
      name: 'Carla Mendes',
      age: 42,
      responsible: 'Beatriz Lima',
      sessions: [
        { id: 1, date: '2024-11-05', completed: true },
        { id: 2, date: '2024-11-12', completed: true },
      ],
    },
    {
      id: 4,
      name: 'Diego Ferreira',
      age: 22,
      responsible: 'Lucas Silva',
      sessions: [
        { id: 1, date: '2024-11-07', completed: true },
        { id: 2, date: '2024-11-14', completed: false },
      ],
    },
  ]);

  const handleLogin = () => setIsLoggedIn(true);

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  const handleViewPatient = (patientId: number) => {
    setViewingPatientId(patientId);
    setSelectedScreen('viewPatient');
  };

  const handleEditSession = (sessionId: number | null, patientId: number) => {
    setEditingSessionId(sessionId);
    setViewingPatientId(patientId);
    setSelectedScreen('editSession');
  };

  const handleSaveSession = (patientId: number) => {
    setViewingPatientId(patientId);
    setSelectedScreen('viewPatient');
  };

  const handleBack = () => {
    setSelectedScreen('pacientes');
  };

  const renderContent = () => {
    if (selectedScreen === 'editSession' && viewingPatientId !== null) {
      return (
        <FormularioConsulta
          sessionId={editingSessionId}
          patientId={viewingPatientId}
          onSave={handleSaveSession}
        />
      );
    }
    if (selectedScreen === 'viewPatient' && viewingPatientId !== null) {
      const patient = patients.find((p) => p.id === viewingPatientId);
      return (
        <VisualizarPaciente
          patient={patient}
          onEditSession={(sessionId) => handleEditSession(sessionId, viewingPatientId)}
          onBack={handleBack}
        />
      );
    }
    switch (selectedScreen) {
      case 'pacientes':
        return <Pacientes onViewPatient={handleViewPatient} />;
      case 'settings':
        return <Settings />;
      default:
        return <Pacientes onViewPatient={handleViewPatient} />;
    }
  };

  return (
    <div className="flex">
      <Sidebar onSelectScreen={setSelectedScreen} />
      <div className="ml-64 flex-grow p-8 bg-gray-100 min-h-screen">{renderContent()}</div>
    </div>
  );
};


export default App;
