import { Inter } from 'next/font/google'
import { StorefrontHeader } from '@/components/storefront/storefront-header'
import { StorefrontFooter } from '@/components/storefront/storefront-footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Storefront - CrockNest Club',
  description: 'Browse and shop our products',
}

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`min-h-screen bg-white ${inter.className}`}>
      <StorefrontHeader />
      <main className="flex-1">
        {children}
      </main>
      <StorefrontFooter />
    </div>
  )
}
