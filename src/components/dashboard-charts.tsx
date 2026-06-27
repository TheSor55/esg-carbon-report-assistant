'use client';

import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const colors = ['#28724f', '#147481', '#a76516', '#385f9f', '#7a4d9b'];

export function MonthlyTrendChart({ data }: { data: Array<{ month: string; tCO2e: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="tCO2e" fill="#147481" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryPieChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={95} label>
          {data.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
