import { supabase } from '../supabaseClient';
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

  export const searchPatients = async (term: string) => {
    const { data, error } = await supabase
      .from('patients')
      .select('name')
      .ilike('name', `%${term}%`)
      .limit(5); // Retorna até 5 opções de autocomplete
  
    if (error) {
      throw error;
    }
  
    return data.map((patient) => patient.name);
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