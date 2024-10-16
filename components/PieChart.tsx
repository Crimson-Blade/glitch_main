import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Sample data for the pie chart
const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

// Define colors for the pie chart segments
const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28"];

const CustomPieChart = () => {
  return (
    <div className="w-full p-0">
      {" "}
      {/* Remove padding and border */}
      <h3 className="text-center text-purple-500 font-semibold mb-2">
        Pie Chart
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
