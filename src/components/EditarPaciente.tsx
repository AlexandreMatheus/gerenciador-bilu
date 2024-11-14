import React, { useState } from 'react';

type EditarPacienteProps = {
  patientId: number | null;
  onSave: () => void;
};

const EditarPaciente: React.FC<EditarPacienteProps> = ({ patientId, onSave }) => {
  const [responsible, setResponsible] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [behavior, setBehavior] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const today = new Date().toLocaleDateString();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="p-8 bg-white shadow rounded-lg max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {patientId ? 'Editar Paciente' : 'Novo Paciente'}
      </h1>
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Campo Pedagoga Responsável */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Pedagoga Responsável</label>
          <input
            type="text"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome da pedagoga"
            required
          />
        </div>

        {/* Campo Nome do Paciente */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Nome do Paciente</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do paciente"
            required
          />
        </div>

        {/* Campo Data */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Data</label>
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

        {/* Botão de Salvar */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Salvar
        </button>
      </form>
    </div>
  );
};

export default EditarPaciente;