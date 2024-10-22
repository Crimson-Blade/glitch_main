import { ReactQueryProvider } from '@/lib/providers';
import '../styles/globals.css';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


export const metadata = {
  title: 'Go Perch',
  description: 'Go Perch: Gaming ERP',
};

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
      </body>
    </html>
  );
}
