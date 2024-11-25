import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

type Order = {
  id: number;
  customer_name: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
};

const ITEMS_PER_PAGE = 10;

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>(''); // Filtro de status

  // Buscar pedidos com paginação e filtro de status
  const fetchOrders = async (page: number) => {
    setLoading(true);
    try {
      const query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (statusFilter) {
        query.eq('status', statusFilter); // Aplica filtro de status se definido
      }

      const { data: ordersData, count, error } = await query;

      if (error) throw error;

      setOrders(ordersData || []);
      setTotalOrders(count || 0);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar itens de um pedido específico
  const fetchOrderItems = async (orderId: number) => {
    setLoading(true);
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

      setOrderItems(updatedItems || []);
    } catch (error) {
      console.error('Erro ao buscar itens do pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status do pedido para "finalizado"
  const finalizeOrder = async (orderId: number) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'finalizado' })
        .eq('id', orderId);

      if (error) throw error;

      alert('Pedido finalizado com sucesso!');
      fetchOrders(currentPage); // Atualiza a lista após a alteração
      closeModal(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao finalizar o pedido:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchOrders(page);
  };

  const handleOrderClick = async (order: Order) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, statusFilter]); // Atualiza ao mudar o statusFilter

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Pedidos</h1>

      {/* Filtro de Status */}
      <div className="mb-6">
        <label htmlFor="statusFilter" className="block text-sm font-medium mb-2">
          Filtrar por Status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="">Todos</option>
          <option value="pending">Pendente</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 shadow cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold">
                      Pedido #{order.id} - {order.customer_name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Data: {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-bold">
                      Total: R$ {order.total.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm ${
                        order.status === 'pending'
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }`}
                    >
                      Status: {order.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div className="flex justify-center mt-6 space-x-4">
            {Array.from(
              { length: Math.ceil(totalOrders / ITEMS_PER_PAGE) },
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

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-hidden">
            <h2 className="text-xl font-bold mb-4 text-center">
              Itens do Pedido #{selectedOrder.id}
            </h2>
            <div className="overflow-y-auto max-h-[70vh]">
              <ul className="space-y-6">
                {orderItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center space-x-6 border-b pb-6"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={`Produto ${item.products?.name}`}
                        className="w-48 h-48 object-cover rounded"
                      />
                    ) : (
                      <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-sm text-gray-500">Sem imagem</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <p className="font-semibold text-lg">{item.products?.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Preço Unitário: R$ {item.price.toFixed(2)}
                      </p>
                      <p className="font-bold">
                        Total: R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => finalizeOrder(selectedOrder.id)}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded"
            >
              Finalizar Pedido
            </button>
            <button
              onClick={closeModal}
              className="mt-2 w-full bg-gray-500 text-white py-2 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;