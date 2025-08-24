import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'

import { ToastProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { SetupGuide } from '@/components/ui/setup-guide'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dashboard',
  description: 'E-Commerce Dashboard',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if critical environment variables are present
  const hasEnvVars = !!(
    process.env.DATABASE_URL &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
  );
  
  if (!hasEnvVars) {
    const missingVars = [];
    if (!process.env.DATABASE_URL) missingVars.push('DATABASE_URL');
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) missingVars.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
    if (!process.env.CLERK_SECRET_KEY) missingVars.push('CLERK_SECRET_KEY');
    
    return (
      <html lang="en">
        <body className={inter.className}>
          <SetupGuide missingVars={missingVars} />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
          >
            <ToastProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
