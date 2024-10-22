"use client"; // Mark as Client Component

import React, { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import 'tailwindcss/tailwind.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useRegistrationData } from '@/lib/handlers';
import { start } from 'repl';
import { ChartWithDropdown } from '@/components/charts';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend);


// ChartWithDropdown component to handle individual chart + dropdown
type TimeRangeType = {
  registrations: string,
  sessionDuration: string,
  peakHours: string,
  income: string,
  usersTrend: string,
}

export const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeType>(
    {
      registrations: 'daily',
      sessionDuration: 'daily',
      peakHours: 'daily',
      income: 'daily',
      usersTrend: 'daily',
    }
  );

  const startDate = new Date("2024-11-01");
  const endDate = new Date("2024-12-31");

  const handleTimeRangeChange = (chartType: string, range: string) => {
    setTimeRange((prev) => ({ ...prev, [chartType]: range }));
  };

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
          <Registrations
            startDate={startDate}
            endDate={endDate}
            timeRange={timeRange}
            handleTimeRangeChangeProp={(range: string) => handleTimeRangeChange('registrations', range)}
          />

          {/* Chart 2: Active vs Inactive Users */}

          {/* <ChartWithDropdown
            label="Active vs Inactive Users"
            chartData={pieChartData}
            type="pie"
            timeRange={timeRange.usersTrend}
            handleTimeRangeChange={(range) => handleTimeRangeChange('usersTrend', range)}
          /> */}

          {/* Chart 3: Average Session Duration */}
          {/* <ChartWithDropdown
            label="Average Session Duration"
            chartData={lineChartData('Average Session Duration')}
            timeRange={timeRange.sessionDuration}
            handleTimeRangeChange={(range) => handleTimeRangeChange('sessionDuration', range)}
          /> */}

          {/* Chart 4: Peak Hours */}
          {/* <ChartWithDropdown
            label="Peak Hours"
            chartData={lineChartData('Peak Hours')}
            timeRange={timeRange.peakHours}
            handleTimeRangeChange={(range) => handleTimeRangeChange('peakHours', range)}
          /> */}

          {/* Chart 5: Daily/Weekly Trends */}
          {/* <ChartWithDropdown
            label="Daily/Weekly Trends"
            chartData={pieChartData}
            type="pie"
            timeRange={timeRange.usersTrend}
            handleTimeRangeChange={(range) => handleTimeRangeChange('usersTrend', range)}
          /> */}

          {/* Chart 6: Daily/Weekly/Monthly Income */}
          {/* <ChartWithDropdown
            label="Daily/Weekly/Monthly Income"
            chartData={lineChartData('Income')}
            timeRange={timeRange.income}
            handleTimeRangeChange={(range) => handleTimeRangeChange('income', range)}
          /> */}
        </div>
      </div>
    </div>
  );
};

interface RegistrationsProps {
  startDate: Date;
  endDate: Date;
  timeRange: TimeRangeType;
  handleTimeRangeChangeProp: (range: string) => void;
}

const Registrations = ({ startDate, endDate, timeRange, handleTimeRangeChangeProp }: RegistrationsProps) => {

  // Data Fetch
  const { data: registrationData, isLoading: isLoadingRegistration, error: registrationDataError } = useRegistrationData(startDate, endDate, timeRange.registrations);

  // Data Processing
  const getChartData = (label: string, labels: [string], values: [Number]) => ({
    labels,
    datasets: [
      {
        label,
        data: values,
        fill: true,
        backgroundColor: 'rgba(156, 39, 176, 0.2)',
        borderColor: 'rgba(255, 255, 255, 1)', // Set the line color to white
        tension: 0.4,
      },
    ],
  });

  const chartData = getChartData(
    'Registrations',
    isLoadingRegistration
      ? ['Loading...']
      : registrationData.labels
        ? registrationData.labels
        : ['No Data'],
    isLoadingRegistration || registrationDataError
      ? [0]
      : registrationData.values
  );

  return (
    <div>
      <ChartWithDropdown
        label="Daily/Weekly/Monthly Registrations"
        chartData={chartData}
        timeRange={timeRange.registrations}
        handleTimeRangeChange={handleTimeRangeChangeProp}
      />
    </div>
  );

}

export default AnalyticsPage;
