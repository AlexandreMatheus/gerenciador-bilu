import { supabase } from '../supabaseClient';

interface AutocompleteOption {
    id: number; // Identificador único do paciente
    name: string; // Nome do paciente
  }
  
export const addPatient = async (
    name: string,
    phone: string,
    born_date: string,
    responsible: string,
    email: string
  ) => {
    const { data, error } = await supabase
      .from('patients')
      .insert([{ name, phone, born_date, responsible, email }]);
  
    if (error) {
      console.error('Erro ao adicionar paciente:', error.message);
      throw error;
    }
  
    return data;
  };
  
  export const getPatients = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
  
    const { data, count, error } = await supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
  
    if (error) {
      throw error;
    }
  
    return { data, total: count ?? 0 }; // Garante que `total` será sempre um número
  };

  export const searchPatients = async (term: string): Promise<AutocompleteOption[]> => {
    const { data, error } = await supabase
      .from('patients')
      .select('id, name') // Certifique-se de selecionar apenas os campos necessários
      .ilike('name', `%${term}%`)
      .limit(5);
  
    if (error) {
      throw error;
    }
  
    return data || [];
  };

  export const getPatientById = async (id: number) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
  
    if (error) {
      console.error('Erro ao buscar paciente:', error.message);
      throw error;
    }
  
    return data;
  };