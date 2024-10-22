import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { format } from 'date-fns';

const formatDate = (date: Date | null): string => {
  return date ? format(date, 'yyyy-MM-dd') : '';
};

// API call to fetch registration data
const getRegistration = async (startDate: Date, endDate: Date, period: string) => {
  const { data } = await apiClient.get('/analytics/registrations', {
    params: {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      period,
    },
  });
  return data;
};

// API call to fetch income data
const getIncome = async (startDate: Date, endDate: Date, period: string) => {
  const { data } = await apiClient.get('/analytics/income', {
    params: {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      period,
    },
  });
  return data;
};

// Custom hook to fetch registration data using TanStack Query
export const useRegistrationData = (startDate: Date, endDate: Date, period: string) => {
  return useQuery({
    queryKey: ['registrationData', startDate, endDate, period], 
    queryFn: () => getRegistration(startDate, endDate, period)
  });
};

// Custom hook to fetch income data using TanStack Query
export const useIncomeData = (startDate: Date, endDate: Date, period: string) => {
  return useQuery({
    queryKey: ['incomeData', startDate, endDate, period], 
    queryFn: () => getIncome(startDate, endDate, period)
  });
};