
import React, { useState } from 'react';
import { addPatient } from '../services/PatientService';
import PhoneInput from './PhoneInput';
import EmailInput from './EmailInput';

type PatientFormProps = {
  onBack: () => void;
};

const PatientForm: React.FC<PatientFormProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bornDate, setBornDate] = useState('');
  const [responsible, setResponsible] = useState('');
  const [email, setEmail] = useState('');

  const handleAddPatient = async (
    name: string,
    phone: string,
    bornDate: string,
    responsible: string,
    email: string
  ) => {
    try {
      const newPatient = await addPatient(name, phone, bornDate, responsible, email);
      onBack();
    } catch (error) {
      //@ts-ignore
      console.error('Erro ao adicionar paciente:', error.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddPatient(name, phone, bornDate, responsible, email);

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <div>
        <label className="block text-gray-700">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Telefone</label>
        <PhoneInput value={phone} onChange={setPhone} />
      </div>
      <div>
        <label className="block text-gray-700">Data de Nascimento</label>
        <input
          type="date"
          value={bornDate}
          onChange={(e) => setBornDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Responsável</label>
        <input
          type="text"
          value={responsible}
          onChange={(e) => setResponsible(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Email</label>
        <EmailInput value={email} onChange={setEmail} />
      </div>
      <div className='flex flex-row gap-5'>
        <button
          onClick={onBack}
          className="self-start bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Voltar
        </button>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Adicionar Paciente
        </button>
      </div>
    </form>
  );
};

export default PatientForm;