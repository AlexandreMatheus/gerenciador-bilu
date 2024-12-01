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

interface Order {
  status: string;
  order_date: string;
  total: number;
}

const StackedBarChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, created_at, total').order('created_at');

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const groupedData: Record<
        string,
        { finalizado: number; pendente: number }
      > = {};

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
        name: month, // Usado como eixo X
        finalized: groupedData[month].finalizado,
        pending: groupedData[month].pendente,
      }));
      console.log(formattedData)
      setData(formattedData);
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
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