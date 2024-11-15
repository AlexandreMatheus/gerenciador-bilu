import React, { useEffect, useState } from 'react';
import { getPatients, searchPatients } from '../services/PatientService';

type PacientesProps = {
  onViewPatient: (patientId: number) => void;
  onHandleNewPaciente: () => void;
};

interface Patient {
  id: number;
  name: string;
  phone: string;
  born_date: Date;
  responsible: string;
  createdAt: Date;
  email: string;
}

const ITEMS_PER_PAGE = 20;

const Pacientes: React.FC<PacientesProps> = ({ onViewPatient, onHandleNewPaciente }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const { data, total } = await getPatients(currentPage, ITEMS_PER_PAGE);
        setPatients(data);
        setTotalPatients(total);
      } catch (error) {
        //@ts-ignore
        console.error('Erro ao carregar pacientes:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [currentPage]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);

    if (term.length > 2) {
      try {
        const options = await searchPatients(term);
        setAutocompleteOptions(options);
      } catch (error) {
        //@ts-ignore
        console.error('Erro ao buscar autocomplete:', error.message);
      }
    } else {
      setAutocompleteOptions([]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Pacientes</h1>

      {/* Campo de pesquisa */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar paciente"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Autocomplete */}
        {autocompleteOptions.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 w-full rounded-lg shadow-lg z-10">
            {autocompleteOptions.map((option, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSearch(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => onHandleNewPaciente()}
        className="mb-6 p-2 bg-blue-500 text-white rounded"
      >
        Adicionar Paciente
      </button>

      {/* Lista de pacientes */}
      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <ul className="space-y-4">
          {patients.map((patient) => (
            <li
              key={patient.id}
              className="p-4 border border-gray-300 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{patient.name}</p>
                <p className="text-gray-600">Idade: {new Date().getFullYear() - new Date(patient.born_date).getFullYear()} anos</p>
              </div>
              <button
                onClick={() => onViewPatient(patient.id)}
                className="text-blue-500 font-semibold hover:underline"
              >
                Ver Paciente
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Paginação */}
      <div className="flex justify-center mt-6 space-x-4">
        {Array.from({ length: Math.ceil(totalPatients / ITEMS_PER_PAGE) }, (_, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pacientes;