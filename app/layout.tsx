import '../styles/globals.css';

export const metadata = {
  title: 'My Next.js App',
  description: 'A Next.js app with TypeScript and Tailwind CSS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
