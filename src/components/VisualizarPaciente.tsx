import React from 'react';

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
};

type VisualizarPacienteProps = {
  patient: Patient | undefined;
  onEditSession: (sessionId: number) => void;
  onBack: () => void;
};

const VisualizarPaciente: React.FC<VisualizarPacienteProps> = ({ patient, onEditSession, onBack }) => {
  if (!patient) {
    return <p>Paciente não encontrado.</p>;
  }

  // Filtra a próxima sessão futura
  const nextSession = patient.sessions.find((session) => !session.completed);

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
          <p><strong>Idade:</strong> {patient.age}</p>
          <p><strong>Pedagoga Responsável:</strong> {patient.responsible}</p>

          <h3 className="text-xl font-semibold mt-6 mb-4">Próxima Sessão</h3>
          {nextSession ? (
            <p className="text-gray-700">
              A próxima sessão está agendada para: <strong>{nextSession.date}</strong>
            </p>
          ) : (
            <p className="text-gray-500">Não há sessões futuras agendadas.</p>
          )}
        </div>

        {/* Listagem de histórico de sessões */}
        <div className="w-2/3 bg-white shadow p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Histórico de Sessões</h3>
          <ul className="space-y-3">
            {patient.sessions.map((session) => (
              <li
                key={session.id}
                className="flex justify-between p-3 border rounded-lg border-gray-300"
              >
                <span>{session.date}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => onEditSession(session.id)}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    className="text-gray-500 font-semibold hover:underline"
                  >
                    Baixar PDF
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisualizarPaciente;