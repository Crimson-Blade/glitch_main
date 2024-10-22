'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useState } from 'react';

interface ReactQueryProviderProps {
  children: ReactNode;
}

// Create a provider component that initializes a QueryClient
export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  // Create a new query client for each render to prevent stale caches across page loads
  // const [queryClient] = useState(() => new QueryClient());
  const queryClient =new QueryClient();


  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};