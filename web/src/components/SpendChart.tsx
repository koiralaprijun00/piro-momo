import React from "react"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

interface SpendChartProps {
  data: {
    name: string;
    value: number;
    [key: string]: any;
  }[];
}

const SpendChart: React.FC<SpendChartProps> = ({ data }) => {
  return (
    <PieChart width={400} height={300}>
      <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
        {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  )
}

export default SpendChart
