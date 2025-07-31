import './styles/globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { DndProvider } from '@/components/providers/DndProvider'
import { CustomDragLayer } from '@/components/dnd/DragLayer'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap', // Optional: Prevents FOUC
})

export const metadata: Metadata = {
  title: 'Write With me',
  description: 'Ai based assistive writing',
  icons: {
    icon: 'favicon.ico', // Path to your icon in public folder
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem("theme") || "light";
                  document.documentElement.classList.toggle("dark", theme === "dark");
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <DndProvider>
            <Toaster />
            {children}
            {/* Add custom drag layer for visual feedback */}
            <CustomDragLayer />
          </DndProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
