import React, { useState } from 'react';

type FormularioConsultaProps = {
  sessionId: number | null;
  patientId: number;
  onSave: (patientId: number) => void;
};

const FormularioConsulta: React.FC<FormularioConsultaProps> = ({ sessionId, patientId, onSave }) => {
  const [responsible, setResponsible] = useState<string>('Ana Maria');
  const [behavior, setBehavior] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const today = new Date().toLocaleDateString();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(patientId); // Retorna à visualização do paciente com o ID correto
  };

  const handleCancel = () => {
    onSave(patientId); // Retorna à visualização do paciente com o ID correto ao cancelar
  };

  return (
    <div className="p-8 bg-white shadow rounded-lg max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {sessionId ? 'Editar Sessão' : 'Nova Sessão'}
      </h1>
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Pedagoga Responsável */}
        <div>
          <label className="block text-gray-700 font-medium">Pedagoga Responsável</label>
          <input
            type="text"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>

        {/* Data */}
        <div>
          <label className="block text-gray-700 font-medium">Data</label>
          <input
            type="text"
            value={today}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100"
          />
        </div>

        {/* Seção Hoje Apresentou */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Hoje apresentou</label>
          <div className="flex space-x-4">
            {['inquieto', 'sono', 'choro', 'agressividade'].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="behavior"
                  value={option}
                  checked={behavior === option}
                  onChange={(e) => setBehavior(e.target.value)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Seção Paciente Respondeu os Comandos */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Paciente respondeu os comandos</label>
          <div className="flex space-x-4">
            {['sim', 'nao', 'em partes'].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="response"
                  value={option}
                  checked={response === option}
                  onChange={(e) => setResponse(e.target.value)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Botões de Salvar e Cancelar */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioConsulta;