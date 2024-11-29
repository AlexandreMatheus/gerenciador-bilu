import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Box, List, ListItem, TextField, Typography } from '@mui/joy';

type ListaProdutorasProps = {
  onSelectProdutora: (produtora: string) => void;
};

const ListaProdutoras: React.FC<ListaProdutorasProps> = ({ onSelectProdutora }) => {
  const [producers, setProducers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProducers = async (query: string) => {
    setLoading(true);
    try {
        const { data, error } = await supabase.rpc('distinct_producers', { search_term: `%${query}%` });


      if (error) throw error;
        //@ts-ignore
      setProducers(data.map((item) => item.produtora));
    } catch (error) {
        //@ts-ignore
      console.error('Erro ao buscar produtoras:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducers(searchTerm);
  }, [searchTerm]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography level="h1" fontSize="xl2" marginBottom={2}>
        Lista de Produtoras
      </Typography>
      <Box
        component="input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Pesquisar produtora..."
        sx={{
          width: '100%',
          padding: '8px 16px',
          marginBottom: 3,
          border: '1px solid #ccc',
          borderRadius: '8px',
          outline: 'none',
          fontSize: '16px',
          '&:focus': {
            borderColor: 'primary.main',
            boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)',
          },
        }}
      />
      {loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <List>
          {producers.map((produtora, index) => (
            <ListItem
              key={index}
              onClick={() => onSelectProdutora(produtora)}
              sx={{
                cursor: 'pointer',
                padding: '12px 16px',
                marginBottom: 1,
                borderRadius: '8px',
                backgroundColor: 'neutral.plainBg',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'primary.softBg',
                  transform: 'scale(1.02)',
                },
                '&:active': {
                  backgroundColor: 'primary.plainColor',
                  color: 'white',
                },
              }}
            >
              <Typography fontWeight="bold" fontSize="lg">
                {produtora}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ListaProdutoras;
