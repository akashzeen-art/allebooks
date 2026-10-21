import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { EbookPreloader } from '@/components/EbookPreloader'

export function Layout() {
  const { pathname } = useLocation()

  // Ebook reader: hide site chrome.
  const immersive = pathname.startsWith('/ebook/')

  return (
    <div className="flex min-h-svh flex-col" data-testid="app-layout">
      <EbookPreloader />
      <ScrollToTop />
      {!immersive ? <Header /> : null}
      <main className="relative flex-1" data-testid="main-content">
        <Outlet />
      </main>
      {!immersive ? <Footer /> : null}
    </div>
  )
}
