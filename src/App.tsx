import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Pacientes from './components/Pacientes';
import Settings from './components/Settings';
import Login from './components/Login';
import FormularioConsulta from './components/FormularioConsulta';
import { supabase } from './supabaseClient';
import VisualizarPaciente from './components/VisualizarPaciente';
import PatientForm from './components/PatientForm';

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

  const handleViewPatient = async (patientId: number) => {
    setSelectedScreen('viewPatient');
    setViewingPatientId(patientId);
  };

  const handleNewPatient = () => {
    setSelectedScreen('addPatient');
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
          sessionId={viewingPatientId}
          patientId={viewingPatientId}
          onSave={handleSaveSession}
        />
      );
    }
    
    if (selectedScreen === 'viewPatient' && viewingPatientId !== null) {
      return (
        <VisualizarPaciente
          patientId={viewingPatientId}
          onBack={handleBack}
        />
      );
    }
    
    if (selectedScreen === 'addPatient') {
      return <PatientForm onBack={handleBack} />;
    }

    switch (selectedScreen) {
      case 'pacientes':
        return <Pacientes onViewPatient={handleViewPatient} onHandleNewPaciente={handleNewPatient}/>;
      case 'settings':
        return <Settings />;
      default:
        return <Pacientes  onViewPatient={handleViewPatient} onHandleNewPaciente={handleNewPatient}/>;
    }
  };

  return (
    <div className="flex">
      <Sidebar onSelectScreen={setSelectedScreen} onLogout={handleLogout}/>
      <div className="ml-64 flex-grow p-8 bg-gray-100 min-h-screen">{renderContent()}</div>
    </div>
  );
};


export default App;
