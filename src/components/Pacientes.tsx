import React, { useState } from 'react';

type PacientesProps = {
  onViewPatient: (patientId: number) => void;
};

const Pacientes: React.FC<PacientesProps> = ({ onViewPatient }) => {
  const [patients] = useState([
    { id: 1, name: 'Alice Souza', age: 29 },
    { id: 2, name: 'Bruno Oliveira', age: 34 },
    { id: 3, name: 'Carla Mendes', age: 42 },
    { id: 4, name: 'Diego Ferreira', age: 22 },
  ]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Pacientes</h1>
      <ul className="space-y-4">
        {patients.map((patient) => (
          <li
            key={patient.id}
            className="p-4 border border-gray-300 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{patient.name}</p>
              <p className="text-gray-600">Idade: {patient.age}</p>
            </div>
            <button
              onClick={() => onViewPatient(patient.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600"
            >
              Ver Paciente
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pacientes;