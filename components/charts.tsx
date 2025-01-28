"use client"; // Mark as Client Component
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import 'tailwindcss/tailwind.css';
import { useActiveInactiveUsers, useIncomeData, useRegistrationData, useSessionDurationData } from '@/lib/handlers';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend, Filler);

export type TimeRangeType = {
  registrations: string,
  sessionDuration: string,
  peakHours: string,
  income: string,
  activeInactive: string,
  usersTrend: string,
}

// ChartWithDropdown component to handle individual chart + dropdown
type ChartWithDropdownProps = {
  label: string,
  chartData: any,
  timeRange: string,
  handleTimeRangeChange: (range: string) => void,
  type?: 'line' | 'pie',
  disableDropdown?: boolean
}
export const ChartWithDropdown = ({ label, chartData, timeRange, handleTimeRangeChange, type = 'line', disableDropdown = false }: ChartWithDropdownProps) => {
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
          disabled={disableDropdown}
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


// Registrations component to display the daily/weekly/monthly registrations
interface RegistrationsProps {
  startDate: Date;
  endDate: Date;
  timeRange: TimeRangeType;
  handleTimeRangeChangeProp: (range: string) => void;
}

export const Registrations = ({ startDate, endDate, timeRange, handleTimeRangeChangeProp }: RegistrationsProps) => {

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
      : registrationDataError
        ? [registrationDataError.message]
        : registrationData.labels,
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

{/* Chart 2: Active vs Inactive Users */ }
interface ActiveInactiveUsersProps {
  timeRange: TimeRangeType;
  handleTimeRangeChangeProp: (range: string) => void;
}
export const ActiveInactiveUsers = ({timeRange, handleTimeRangeChangeProp }:ActiveInactiveUsersProps) => {
  // Data Fetch
  const { data: activeInactiveData, isLoading: isLoadingActiveInactive, error: activeInactiveError } = useActiveInactiveUsers();

  // Data Processing
  const getChartData = (label: string, labels: string[], values: Number[]) => ({
    labels: labels,
    datasets: [
      {
        label,
        data: values,
        fill: true,
        backgroundColor: ['#9C27B0', '#E1BEE7'],
        hoverOffset: 4,
      },
    ],
  });


  const chartData = getChartData(
    'Active vs Inactive Users',
    isLoadingActiveInactive
      ? ['Loading...','Loading...']
      : activeInactiveError
        ? [activeInactiveError.message]
        : ['Active Users', 'Inactive Users'],
        isLoadingActiveInactive || activeInactiveError
      ? [0, 0]
      : activeInactiveData.values
  );
  return (
    <ChartWithDropdown
      label="Today's Users Activity"
      chartData={chartData}
      type="pie"
      timeRange={timeRange.activeInactive}
      handleTimeRangeChange={handleTimeRangeChangeProp}
      disableDropdown={true}
    />
  )
}

{/* Chart 2: Income */ }
interface IncomeProps {
  startDate: Date;
  endDate: Date;
  timeRange: TimeRangeType;
  handleTimeRangeChangeProp: (range: string) => void;
}
export const Income = ({ startDate, endDate, timeRange, handleTimeRangeChangeProp }: IncomeProps) => {

  // Data Fetch
  const { data: incomeData, isLoading: isLoadingIncome, error: incomeDataError } = useIncomeData(startDate, endDate, timeRange.registrations);

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
    isLoadingIncome
      ? ['Loading...']
      : incomeDataError
        ? [incomeDataError.message]
        : incomeData.labels,
    isLoadingIncome || incomeDataError
      ? [0]
      : incomeData.values
  );

  return (
    <div>
      <ChartWithDropdown
        label="Daily/Weekly/Monthly Income"
        chartData={chartData}
        timeRange={timeRange.income}
        handleTimeRangeChange={handleTimeRangeChangeProp}
      />
    </div>
  );

}

interface AverageSessionDurationProps {
  startDate: Date;
  endDate: Date;
  timeRange: TimeRangeType;
  handleTimeRangeChangeProp: (range: string) => void;
}

export const AverageSessionDuration = ({ startDate, endDate, timeRange, handleTimeRangeChangeProp }: AverageSessionDurationProps) => {

  // Data Fetch
  const { data: asdData, isLoading: isLoadingAsd, error: asdError } = useSessionDurationData(startDate, endDate, timeRange.registrations);

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
    'Duration',
    isLoadingAsd
      ? ['Loading...']
      : asdError
        ? [asdError.message]
        : asdData.labels,
        isLoadingAsd || asdError
      ? [0]
      : asdData.values
  );

  return (
    <div>
      <ChartWithDropdown
        label="Average Session Duration"
        chartData={chartData}
        timeRange={timeRange.sessionDuration}
        handleTimeRangeChange={handleTimeRangeChangeProp}
      />
    </div>
  );

}