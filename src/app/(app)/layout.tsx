'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Lobster } from 'next/font/google'

const playfair = Lobster({
  subsets: ['latin'],
  weight: ['400'],
})

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const userType = session?.user?.userType

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') return null // Prevents flicker on initial load

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-violet-700 text-white py-4 px-6 shadow-md">
        <div className="flex justify-between items-center">
          {/* Left: Logo and nav links */}
          <div className="flex items-center gap-8">
            <div className={`${playfair.className} text-2xl font-bold text-yellow-400`}>
              Le Tour Du World
            </div>
            <nav className="flex gap-6 items-center">
              <Link
                href="/app"
                className={`font-bold ${isActive('/app') ? 'text-yellow-300' : ''}`}
              >
                Home
              </Link>

              {userType === 'tourist' && (
                <Link
                  href="/app/booked-tours"
                  className={`font-bold ${isActive('/app/booked-tours') ? 'text-yellow-300' : ''}`}
                >
                  Booked Tours
                </Link>
              )}

              {userType === 'host' && (
                <>
                  <Link
                    href="/app/your-tours"
                    className={`font-bold ${isActive('/app/your-tours') ? 'text-yellow-300' : ''}`}
                  >
                    Your Tours
                  </Link>
                  <Link
                    href="/app/create-tour"
                    className={`font-bold ${isActive('/app/create-tour') ? 'text-yellow-300' : ''}`}
                  >
                    Create Tour
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right: Logout */}
          <div>
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-grow bg-orange-100 p-4">
        {children}
      </main>
    </div>
  )
}

export default AppLayout
