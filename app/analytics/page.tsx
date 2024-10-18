"use client"; // Mark as Client Component

import { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import 'tailwindcss/tailwind.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import Link from 'next/link';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend);

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState({
    registrations: '30_days',
    sessionDuration: '30_days',
    peakHours: '30_days',
    income: '30_days',
    usersTrend: '30_days',
  });

  const handleTimeRangeChange = (chartType: string, range: string) => {
    setTimeRange((prev) => ({ ...prev, [chartType]: range }));
  };

  // Chart data for different metrics
  const lineChartData = (label: string) => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label,
        data: [120, 150, 180, 220, 250, 300, 350],
        fill: true,
        backgroundColor: 'rgba(156, 39, 176, 0.2)',
        borderColor: 'rgba(255, 255, 255, 1)', // Set the line color to white
        tension: 0.4,
      },
    ],
  });

  const pieChartData = {
    labels: ['Active Users', 'Inactive Users'],
    datasets: [
      {
        label: 'Active vs Inactive Users',
        data: [300, 120],
        backgroundColor: ['#9C27B0', '#E1BEE7'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-fixed bg-center bg-no-repeat bg-cover" style={{ backgroundImage: "url('/images/bg.jpg')" }}>
      <div className="container mx-auto pb-12">
      <div className="flex justify-between items-center py-10 px-20">
          <h1 className="font-heading text-purple-400 text-5xl">Entry</h1>
          <Link href="/dashboard" passHref>
            <Button className="flex items-center bg-purple-500 text-white font-semibold py-3 px-4 rounded-full hover:bg-purple-600 cursor-pointer">
              <ArrowBackIcon className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        {/* Chart Container */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
          {/* Chart 1: Daily/Weekly/Monthly Registrations */}
          <ChartWithDropdown
            label="Daily/Weekly/Monthly Registrations"
            chartData={lineChartData('Registrations')}
            timeRange={timeRange.registrations}
            handleTimeRangeChange={(range) => handleTimeRangeChange('registrations', range)}
          />

          {/* Chart 2: Active vs Inactive Users */}
          <ChartWithDropdown
            label="Active vs Inactive Users"
            chartData={pieChartData}
            type="pie"
            timeRange={timeRange.usersTrend}
            handleTimeRangeChange={(range) => handleTimeRangeChange('usersTrend', range)}
          />

          {/* Chart 3: Average Session Duration */}
          <ChartWithDropdown
            label="Average Session Duration"
            chartData={lineChartData('Average Session Duration')}
            timeRange={timeRange.sessionDuration}
            handleTimeRangeChange={(range) => handleTimeRangeChange('sessionDuration', range)}
          />

          {/* Chart 4: Peak Hours */}
          <ChartWithDropdown
            label="Peak Hours"
            chartData={lineChartData('Peak Hours')}
            timeRange={timeRange.peakHours}
            handleTimeRangeChange={(range) => handleTimeRangeChange('peakHours', range)}
          />

          {/* Chart 5: Daily/Weekly Trends */}
          <ChartWithDropdown
            label="Daily/Weekly Trends"
            chartData={pieChartData}
            type="pie"
            timeRange={timeRange.usersTrend}
            handleTimeRangeChange={(range) => handleTimeRangeChange('usersTrend', range)}
          />

          {/* Chart 6: Daily/Weekly/Monthly Income */}
          <ChartWithDropdown
            label="Daily/Weekly/Monthly Income"
            chartData={lineChartData('Income')}
            timeRange={timeRange.income}
            handleTimeRangeChange={(range) => handleTimeRangeChange('income', range)}
          />
        </div>
      </div>
    </div>
  );
};

// ChartWithDropdown component to handle individual chart + dropdown
const ChartWithDropdown = ({ label, chartData, timeRange, handleTimeRangeChange, type = 'line' }) => {
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
          <option value="7_days">Last 7 Days</option>
          <option value="30_days">Last 30 Days</option>
          <option value="3_months">Last 3 Months</option>
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


export default AnalyticsPage;
