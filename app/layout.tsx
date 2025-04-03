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
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {!isMobile ? (
            <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#CED6BF] to-[#94a37e] flex items-center justify-center p-6">
              <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md text-center animate-fadeIn">
                <h1 className="text-3xl font-bold mb-4">📱 Mobile Only</h1>
                <p className="text-gray-600 mb-6">
                  Undangan ini dirancang untuk tampilan mobile.
                  <br />
                  Yuk buka di smartphone kamu ✨
                  <br />
                </p>
                <div className="w-32 h-64 mx-auto border-4 border-black rounded-[2rem] bg-gray-100 relative animate-bounce-slow">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-gray-400" />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-300" />
                </div>
                <p className="text-gray-600 mt-6 mb-3">Best Regards,</p>
                <p className="text-gray-600 my-3">- Tiara & Ando -</p>
              </div>
            </div>
          ) : (
            children
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}
