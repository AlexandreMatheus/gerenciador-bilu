import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, Typography, Box, Button, Grid, Input } from '@mui/joy';

type Item = {
  id: number;
  nome: string;
  quantidade: number;
  valor: number;
  imagem: string;
};

const ITEMS_PER_PAGE = 10;

const Estoque: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [newQuantity, setNewQuantity] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchItems(page);
  };

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  return (
    <Box p={4}>
      <Typography level="h1" fontSize="xl4" mb={2}>
        Estoque
      </Typography>

      {/* Campo de busca */}
      <Input
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Pesquisar no estoque..."
        sx={{ mb: 4, width: '100%' }}
      />

      {loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid key={item.id} xs={12} sm={6} md={4} lg={3}>
                <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="w-32 h-32 max-h-32 object-cover mb-4"
                />
                <CardContent>
                    <Typography color="neutral" sx={{height: '64px', maxHeight: '64px', color: 'black'}}>
                      {item.nome}
                    </Typography>
                  </CardContent>
                 <CardContent>
                    <Typography color="neutral">
                      R$ {item.valor.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <Box width="100%" px={2} mb={2}>
                    {editingItemId === item.id ? (
                      <Box display="flex" gap={1} flexDirection="column">
                        <Input
                          type="number"
                          value={newQuantity ?? item.quantidade}
                          onChange={(e) => setNewQuantity(parseInt(e.target.value, 10))}
                          fullWidth
                          size="md"
                        />
                        <Box display="flex" gap={1}>
                          <Button
                            onClick={() =>
                              newQuantity !== null && updateQuantity(item.id, newQuantity)
                            }
                            color="success"
                            fullWidth
                          >
                            Salvar
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingItemId(null);
                              setNewQuantity(null);
                            }}
                            color="danger"
                            fullWidth
                          >
                            Cancelar
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Input
                          type="number"
                          value={item.quantidade}
                          disabled
                          fullWidth
                          size="sm"
                        />
                        <Button
                          onClick={() => {
                            setEditingItemId(item.id);
                            setNewQuantity(item.quantidade);
                          }}
                          fullWidth
                        >
                          Editar
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Paginação */}
          <Box display="flex" justifyContent="center" mt={4}>
            {Array.from({ length: Math.ceil(totalItems / ITEMS_PER_PAGE) }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? 'soft' : 'plain'}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Estoque;