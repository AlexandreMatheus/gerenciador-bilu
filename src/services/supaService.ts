import { supabase } from '../supabaseClient';

export const fetchOrders = async (page: number, itemsPerPage: number, statusFilter: string) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage - 1;

  try {
    const query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('status', { ascending: false }) // Ordena também pelo status
      .order('created_at', { ascending: true })
      .range(start, end);

    if (statusFilter) {
      query.eq('status', statusFilter); // Aplica filtro de status se definido
    }

    const { data: ordersData, count, error } = await query;

    if (error) throw error;

    return { ordersData: ordersData || [], count: count || 0 };
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    throw error;
  }
};

export const fetchOrderItems = async (orderId: number) => {
  try {
    const { data: itemsData, error } = await supabase
      .from('order_items')
      .select('*, products(image_url, name)')
      .eq('order_id', orderId);

    if (error) throw error;

    const updatedItems = itemsData.map((item) => {
      const imageUrl = item.products?.image_url
        ? supabase.storage.from('produtos').getPublicUrl(`Imagens/Produtos/${item.products?.image_url}`).data.publicUrl
        : null;

      return {
        ...item,
        image_url: imageUrl,
      };
    });

    return updatedItems || [];
  } catch (error) {
    console.error('Erro ao buscar itens do pedido:', error);
    throw error;
  }
};

export const finalizeOrder = async (orderId: number) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'finalizado' })
      .eq('id', orderId);

    if (error) throw error;

    return 'Pedido finalizado com sucesso!';
  } catch (error) {
    console.error('Erro ao finalizar o pedido:', error);
    throw error;
  }
};

const fetchOrderItem = async (orderId: number) => {
  try {
    const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items!fk_order(*, estoque(nome,imagem))
    `)
    .eq('id', orderId).single();

    if (error) throw error;
      /*
    const updatedItems = itemsData.map((item) => {
      const imageUrl = item.products?.image_url
        ? supabase.storage.from('produtos').getPublicUrl(`Imagens/Produtos/${item.products?.image_url}`).data.publicUrl
        : null;

      return {
        ...item,
        image_url: imageUrl,
      };
    });
      */
    return data;
  } catch (error) {
    console.error('Erro ao buscar itens do pedido:', error);
  }
};

export const openOrderModal = async (orderId: number) => {
  try {
    const orderItems = await fetchOrderItem(orderId);
    console.log(orderItems);
    return orderItems;
  } catch (error) {
    console.error('Erro ao abrir o modal do pedido:', error);
    throw error;
  }
};