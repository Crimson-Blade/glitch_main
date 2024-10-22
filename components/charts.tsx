"use client"; // Mark as Client Component

import { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import 'tailwindcss/tailwind.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useRegistrationData } from '@/lib/handlers';
import { start } from 'repl';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend);


// ChartWithDropdown component to handle individual chart + dropdown
type ChartWithDropdownProps = {
  label: string,
  chartData: any,
  timeRange: string,
  handleTimeRangeChange: (range: string) => void,
  type?: 'line' | 'pie',
}
export const ChartWithDropdown = ({ label, chartData, timeRange, handleTimeRangeChange, type = 'line' }:ChartWithDropdownProps) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white', // Set legend labels color to white
        },
      },
      tooltip: {
        backgroundColor: '#4A148C', // Set tooltip background color to dark purple
        titleColor: 'white', // Set tooltip title color to white
        bodyColor: 'white', // Set tooltip body color to white
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Set x-axis ticks color to white
        },
      },
      y: {
        ticks: {
          color: 'white', // Set y-axis ticks color to white
        },
      },
    },
  };

  // Modify the line dataset in chartData to use a lighter purple
  if (type === 'line') {
    chartData.datasets[0].borderColor = 'rgba(156, 39, 176, 0.7)'; // Lighter purple for the line
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md border border-purple-500 rounded-lg p-6 w-full">

      <h2 className="text-center text-2xl font-bold text-purple-200 mb-8">{label}</h2> {/* Change heading color to white */}
      
      {/* Dropdown for Time Range */}
      <div className="flex justify-center mb-4">
        <select
          value={timeRange}
          onChange={(e) => handleTimeRangeChange(e.target.value)}
          className="px-4 py-2 mx-2 border border-purple-500 text-purple-500 rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Chart Display */}
      <div className="w-full h-[400px] flex justify-center pt-5">
        {type === 'line' ? (
          <Line 
            data={chartData} 
            options={chartOptions} 
            height={400} 
            width={600}  
          />
        ) : (
          <Pie data={chartData} />
        )}
      </div>
    </div>
  );
};