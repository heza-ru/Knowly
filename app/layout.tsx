import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Knowly / Seekhli - Bilingual Quiz App',
  description: 'Offline-first bilingual quiz app for practicing test papers',
  manifest: '/manifest.json',
  themeColor: '#0f0f0f',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Knowly',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
