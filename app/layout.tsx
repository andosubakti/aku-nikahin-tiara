import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { headers } from 'next/headers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Tiara & Ando',
  description: 'Join us for our special day, inspired by the magic of AI',
  generator: 'v0.dev',
  openGraph: {
    title: 'Tiara & Ando Wedding Invitation',
    description: 'Join us for our special day, inspired by the magic of AI',
    url: 'https://aku-nikahin-tiara.vercel.app',
    siteName: 'Tiara & Ando Wedding',
    images: [
      {
        url: 'https://aku-nikahin-tiara.vercel.app/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'Tiara & Ando Wedding Invitation',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiara & Ando Wedding Invitation',
    description: 'Join us for our special day, inspired by the magic of AI',
    images: ['https://aku-nikahin-tiara.vercel.app/og-image.jpeg'],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const userAgent = (await headers()).get('user-agent') || ''
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta property="og:title" content="Tiara & Ando Wedding Invitation" />
        <meta
          property="og:description"
          content="Join us for our special day, inspired by the magic of AI"
        />
        <meta
          property="og:image"
          content="https://aku-nikahin-tiara.vercel.app/og-image.jpeg"
        />
        <meta
          property="og:url"
          content="https://aku-nikahin-tiara.vercel.app"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tiara & Ando Wedding Invitation" />
        <meta
          name="twitter:description"
          content="Join us for our special day, inspired by the magic of AI"
        />
        <meta
          name="twitter:image"
          content="https://aku-nikahin-tiara.vercel.app/og-image.jpeg"
        />
      </head>
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
