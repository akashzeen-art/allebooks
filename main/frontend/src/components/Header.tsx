import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-medium transition-colors hover:text-gold-200',
    isActive ? 'text-gold-300' : 'text-text-muted',
  )

const navItems = [
  { to: '/', label: 'Home', end: true, testId: 'header-home-nav-link' },
  { to: '/ebooks', label: 'Ebooks', end: false, testId: 'header-ebook-link' },
  { to: '/favorites', label: 'Favorites', end: false, testId: 'header-favorites-link' },
] as const

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/5 bg-navy-950/85 backdrop-blur-xl"
      data-testid="site-header"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2.5"
          data-testid="header-home-link"
          aria-label="eBooks home"
        >
          <img
            src="/eBookslogo.png"
            alt="eBooks"
            className="h-10 w-auto max-w-[9.5rem] object-contain object-left sm:h-11 sm:max-w-[11rem]"
            data-testid="header-logo"
          />
        </Link>

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Primary"
          data-testid="header-desktop-nav"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
              data-testid={item.testId}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          data-testid="header-mobile-menu-button"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-white/5 px-4 py-4 md:hidden"
          aria-label="Mobile"
          data-testid="header-mobile-nav"
        >
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
                onClick={() => setOpen(false)}
                data-testid={`header-mobile-${item.testId}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
