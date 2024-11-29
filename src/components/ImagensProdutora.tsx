import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Box, Grid, Button, Typography } from '@mui/joy';

type ImagensProdutoraProps = {
  produtora: string;
  onBack: () => void;
};

const ImagensProdutora: React.FC<ImagensProdutoraProps> = ({ produtora, onBack }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('produtora_imagens')
        .select('imagem_nome')
        .eq('produtora', produtora)
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      // Gerar URLs completas para as imagens
      const formattedImages = data.map((item) => {
        const publicUrl = supabase
          .storage
          .from('produtos') // Nome do bucket
          .getPublicUrl(`Imagens/Estampas/${item.imagem_nome}`).data.publicUrl;
        return publicUrl;
      });

      setImages(formattedImages);
    } catch (error) {
      //@ts-ignore
      console.error('Erro ao buscar imagens:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [currentPage, produtora]);

  return (
    <Box sx={{ padding: 4 }}>
      <Button onClick={onBack} sx={{ marginBottom: 2, marginTop: 5 }}>
        Voltar
      </Button>
      <Typography level="h1" fontSize="xl2" marginBottom={2}>
        Imagens da Produtora: {produtora}
      </Typography>
      {loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <Grid container spacing={2}>
          {images.map((img, index) => (
            <Grid key={index} xs={6}>
              <img
                src={img} // URL gerada dinamicamente
                alt={`Imagem ${index + 1}`}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          sx={{ marginRight: 1 }}
        >
          Anterior
        </Button>
        <Button onClick={() => setCurrentPage((prev) => prev + 1)}>Próxima</Button>
      </Box>
    </Box>
  );
};

export default ImagensProdutora;
