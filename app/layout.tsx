import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://nina-tervezoi-projektkoveto.rpzxpjjtn8.chatgpt.site',
  ),
  title: 'Tervezői projektkövető',
  description: 'Tervezői projektek, feladatok és határidők kezelése.',
  openGraph: {
    title: 'Tervezői projektkövető',
    description:
      'Projektek, határidők és felelősök egy közös tervezői munkafelületen.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Tervezői projektkövető',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tervezői projektkövető',
    description:
      'Projektek, határidők és felelősök egy közös tervezői munkafelületen.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
