import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative z-30 mt-auto border-t border-white/5 bg-navy-950"
      data-testid="site-footer"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-12 text-center sm:px-6 lg:px-8">
        <img
          src="/eBookslogo.png"
          alt="eBooks"
          className="h-16 w-auto max-w-[14rem] object-contain sm:h-20"
          data-testid="footer-logo"
        />
        <p
          className="mt-4 max-w-md text-sm leading-relaxed text-text-muted"
          data-testid="footer-tagline"
        >
          Classics, yoga, and cooking — a cinematic library of PDFs, ready
          whenever you are.
        </p>
        <nav
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-text-muted"
          aria-label="Footer"
        >
          <Link to="/ebooks" className="transition-colors hover:text-gold-200">
            Ebooks
          </Link>
          <Link
            to="/ebooks?category=Yoga"
            className="transition-colors hover:text-gold-200"
          >
            Yoga
          </Link>
          <Link
            to="/ebooks?category=Cooking"
            className="transition-colors hover:text-gold-200"
          >
            Cooking
          </Link>
          <Link to="/favorites" className="transition-colors hover:text-gold-200">
            Favorites
          </Link>
        </nav>
        <p
          className="mt-8 text-xs text-text-muted/70"
          data-testid="footer-copyright"
        >
          © {year} eBooks.
        </p>
      </div>
    </footer>
  )
}
