"use client"; // Mark as Client Component

import React, { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import 'tailwindcss/tailwind.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useRegistrationData } from '@/lib/handlers';
import { start } from 'repl';
import { ActiveInactiveUsers, AverageSessionDuration, Income, Registrations, TimeRangeType } from '@/components/charts';
import AnalyticTable from '@/components/AnalyticsTable';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend, Filler);


const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<TimeRangeType>(
    {
      registrations: 'daily',
      sessionDuration: 'daily',
      peakHours: 'daily',
      income: 'daily',
      activeInactive: 'daily',
      usersTrend: 'daily',
    }
  );

  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");

  const handleTimeRangeChange = (chartType: string, range: string) => {
    setTimeRange((prev) => ({ ...prev, [chartType]: range }));
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
          <ActiveInactiveUsers
            timeRange={timeRange}
            handleTimeRangeChangeProp={(range: string) => handleTimeRangeChange('activeInactive', range)}
          />
          

          {/* Chart 3: Average Session Duration */}
          {/* <ChartWithDropdown
            label="Average Session Duration"
            chartData={lineChartData('Average Session Duration')}
            timeRange={timeRange.sessionDuration}
            handleTimeRangeChange={(range) => handleTimeRangeChange('sessionDuration', range)}
          /> */}
          <AverageSessionDuration
            startDate={startDate}
            endDate={endDate}
            timeRange={timeRange}
            handleTimeRangeChangeProp={(range: string) => handleTimeRangeChange('sessionDuration', range)}
          />

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
          <Income
            startDate={startDate}
            endDate={endDate}
            timeRange={timeRange}
            handleTimeRangeChangeProp={(range: string) => handleTimeRangeChange('income', range)}
          />
            
        </div>
        <div className="mt-12">
          <h2 className="text-center font-semibold mb-6 font-heading text-purple-400 text-4xl">Billing Table</h2>
          <AnalyticTable />
        </div>
      </div>
    </div>
  );
};



export default AnalyticsPage;
