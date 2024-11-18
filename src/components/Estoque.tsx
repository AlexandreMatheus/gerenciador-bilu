import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

type Item = {
  id: number;
  nome: string;
  quantidade: number;
  valor: number;
  imagem: string;
};

const ITEMS_PER_PAGE = 10;

interface AutocompleteOption {
  id: number; // Identificador único do paciente
  name: string; // Nome do paciente
}

const Estoque: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [newQuantity, setNewQuantity] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para buscar itens do estoque com paginação
  const fetchItems = async (page: number) => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
      .from('estoque')
      .select('*', { count: 'exact' })
      .order('nome', { ascending: true }) // Ordena pelo campo 'nome' em ordem ascendente
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);
  
      if (error) throw error;
  
      // Atualizando as URLs das imagens com base no valor da coluna "imagem" (nome do arquivo)
      const updatedItems = data.map((item) => {
        // Concatena o caminho do bucket de imagens com o nome do arquivo
        const imageUrl = `${supabase.storage.from('produtos').getPublicUrl(`Imagens/Estoque${item.imagem}`).data.publicUrl}`;
        console.log(imageUrl);
        return { ...item, imagem: imageUrl };
      });
  
      setItems(updatedItems || []);
      setTotalItems(count || 0);
    } catch (error) {
      console.error('Erro ao buscar itens do estoque:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza a quantidade no banco
  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const { error } = await supabase
        .from('estoque')
        .update({ quantidade: quantity })
        .eq('id', itemId);
      if (error) throw error;

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantidade: quantity } : item
        )
      );
      setEditingItemId(null);
      setNewQuantity(null);
    } catch (error) {
      console.error('Erro ao atualizar a quantidade:', error);
    }
  };

  const searchItems = async (query: string) => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('estoque')
        .select('*', { count: 'exact' })
        .ilike('nome', `%${query}%`)
        .range(0, ITEMS_PER_PAGE - 1); // Limita a quantidade de itens exibidos na busca
  
      if (error) throw error;
  
      setItems(data || []);
      setTotalItems(count || 0); // Atualiza o total de itens com base na busca
    } catch (error) {
      console.error('Erro ao buscar itens do estoque:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtra itens com base no termo de busca
  const handleSearch = (query: string) => {
    setSearchTerm(query);

    if (query.length === 0) {
      fetchItems(currentPage);
      return;
    }

    searchItems(query);
  };

  // Paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchItems(page);
  };

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Estoque</h1>

      {/* Campo de busca */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Pesquisar no estoque..."
          className="border rounded-lg px-4 py-2 w-full"
        />
        {/* Sugestões de autocomplete */}
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg shadow p-4 flex flex-col items-center"
              >
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="w-32 h-32 max-h-32 object-cover mb-4"
                />
                <h2 className="text-md font-semibold h-16 max-h-16">{item.nome}</h2>
                <p className="text-gray-500">R$ {item.valor.toFixed(2)}</p>
                <div className="w-full border border-black rounded-md p-2">
                  {editingItemId === item.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="number"
                        value={newQuantity ?? item.quantidade}
                        onChange={(e) =>
                          setNewQuantity(parseInt(e.target.value, 10))
                        }
                        className="border rounded px-2 py-1 w-full text-center"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            newQuantity !== null &&
                            updateQuantity(item.id, newQuantity)
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded w-full"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setEditingItemId(null);
                            setNewQuantity(null);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded w-full"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <input
                        type="number"
                        value={item.quantidade}
                        disabled
                        className="border rounded px-2 py-1 w-full text-center"
                      />
                      <button
                        onClick={() => {
                          setEditingItemId(item.id);
                          setNewQuantity(item.quantidade);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded w-full"
                      >
                        Editar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Paginação */}
          <div className="flex justify-center mt-6 space-x-4">
            {Array.from(
              { length: Math.ceil(totalItems / ITEMS_PER_PAGE) },
              (_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Estoque;