import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pinora — Discover & Curate',
  description: 'Explore millions of ideas curated for your taste — architecture, art, fashion, interiors and beyond.',
  keywords: ['inspiration', 'design', 'art', 'creative', 'moodboard', 'curation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
