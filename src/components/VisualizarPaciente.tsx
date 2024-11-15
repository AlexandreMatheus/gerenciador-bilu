import React, { useEffect, useState } from 'react';
import { getPatientById } from '../services/PatientService';

type Session = {
  id: number;
  date: string;
  completed: boolean;
};

type Patient = {
  id: number;
  name: string;
  age: number;
  responsible: string;
  sessions: Session[];
  born_date: Date;
};

type VisualizarPacienteProps = {
  patientId: number | null;
  onBack: () => void;
};

const VisualizarPaciente: React.FC<VisualizarPacienteProps> = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  if (patientId == null) onBack();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const data = await getPatientById(patientId || 0);
        setPatient(data);
        setError(null);
      } catch (err: any) {
        setError('Erro ao carregar os dados do paciente.');
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (loading) {
    return <p>Carregando os dados do paciente...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!patient) {
    return <p>Paciente não encontrado.</p>;
  }


  return (
    <div className="p-8 flex flex-col space-y-8">
      <button
        onClick={onBack}
        className="self-start bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
      >
        Voltar
      </button>

      <div className="flex space-x-8">
        {/* Dados do paciente e próxima sessão */}
        <div className="w-1/3 bg-white shadow p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Informações do Paciente</h2>
          <p><strong>Nome:</strong> {patient.name}</p>
          <p><strong>Idade:</strong> {patient.born_date.toString()}</p>
          <p><strong>Pedagoga Responsável:</strong> {patient.responsible}</p>

          <h3 className="text-xl font-semibold mt-6 mb-4">Próxima Sessão</h3>
          
            <p className="text-gray-500">Não há sessões futuras agendadas.</p>

        </div>

        {/* Listagem de histórico de sessões */}
        <div className="w-2/3 bg-white shadow p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Histórico de Sessões</h3>
          <ul className="space-y-3">
           
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisualizarPaciente;