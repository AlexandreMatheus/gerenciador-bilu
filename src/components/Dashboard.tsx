import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '../supabaseClient';

import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import SvgIcon from '@mui/joy/SvgIcon';

const StackedBarChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [caixaAtual, setCaixaAtual] = useState<number>(0);
  const [vendasMesAtual, setVendasMesAtual] = useState<number>(0);
  const META_VENDAS = 500; // Meta fixa de vendas para o mês

  const fetchPedidosAgrupados = async (startDate: Date, endDate: Date) => {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, created_at, total')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at');

    if (error) {
      console.error('Erro ao buscar dados de pedidos:', error);
      return;
    }

    const groupedData: Record<string, { finalizado: number; pendente: number }> = {};

    orders?.forEach((order) => {
      const month = new Date(order.created_at).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      const isFinalized = order.status === 'finalizado';

      if (!groupedData[month]) {
        groupedData[month] = { finalizado: 0, pendente: 0 };
      }

      groupedData[month][isFinalized ? 'finalizado' : 'pendente'] += order.total;
    });

    const formattedData = Object.keys(groupedData).map((month) => ({
      name: month,
      finalized: groupedData[month].finalizado,
      pending: groupedData[month].pendente,
    }));

    setData(formattedData);
  };

  const applyFilter = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    fetchPedidosAgrupados(startDate, endDate);
  };

  useEffect(() => {
    // Função para buscar o saldo do caixa na tabela 'financeiro'
    const fetchSaldoCaixa = async () => {
      const { data: financeiroData, error } = await supabase
        .from('financeiro')
        .select('saldo')
        .single();

      if (error) {
        console.error('Erro ao buscar saldo do caixa:', error);
        return;
      }

      setCaixaAtual(financeiroData.saldo || 0);
    };

    // Função para buscar o total de vendas no mês atual de pedidos finalizados
    const fetchVendasMesAtual = async () => {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

      const { data: vendasData, error } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'finalizado')
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString());

      if (error) {
        console.error('Erro ao buscar vendas do mês atual:', error);
        return;
      }

      const totalVendas = vendasData.reduce((acc, order) => acc + order.total, 0);
      setVendasMesAtual(totalVendas);
    };

    fetchSaldoCaixa();
    fetchVendasMesAtual();
    applyFilter(30); // Mostra os últimos 30 dias inicialmente
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <div className="flex flex-row gap-3">
        {/* Caixa Atual */}
        <div className="w-48">
          <Card variant="solid" color="primary" invertedColors>
            <CardContent orientation="horizontal">
              <CardContent>
                <Typography level="body-md">Caixa Atual</Typography>
                <Typography level="h2">R$ {caixaAtual.toFixed(2)}</Typography>
              </CardContent>
            </CardContent>
          </Card>
        </div>

        {/* Meta de Vendas */}
        <div className="w-64">
          <Card variant="solid" color="primary" invertedColors>
            <CardContent orientation="horizontal">
              <CircularProgress
                size="lg"
                determinate
                value={(vendasMesAtual / META_VENDAS) * 100}
              >
                <SvgIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                    />
                  </svg>
                </SvgIcon>
              </CircularProgress>
              <CardContent>
                <Typography level="body-md">Meta Vendas</Typography>
                <Typography level="h2">
                  R$ {vendasMesAtual.toFixed(2)} / R$ {META_VENDAS.toFixed(2)}
                </Typography>
              </CardContent>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráfico de Barras */}
      <div className="p-4">
        <Typography level="h2">Relatório Vendas</Typography>

        {/* Botões de Filtro */}
        <div className="flex gap-2 mt-4">
          <Button onClick={() => applyFilter(365)}>1 Ano</Button>
          <Button onClick={() => applyFilter(180)}>6 Meses</Button>
          <Button onClick={() => applyFilter(90)}>3 Meses</Button>
          <Button onClick={() => applyFilter(30)}>1 Mês</Button>
          <Button onClick={() => applyFilter(15)}>15 Dias</Button>
          <Button onClick={() => applyFilter(7)}>7 Dias</Button>
        </div>
      </div>

      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="finalized" stackId="a" fill="#82ca9d" name="Finalizados" />
          <Bar dataKey="pending" stackId="a" fill="#8884d8" name="Pendentes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;
