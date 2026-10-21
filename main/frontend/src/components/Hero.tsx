import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HeroVisual } from '@/components/HeroVisual'

export function Hero() {
  return (
    <section
      className="relative z-10 border-b border-white/5 lg:min-h-[min(85svh,800px)]"
      data-testid="hero-section"
      aria-labelledby="hero-heading"
    >
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-start gap-6 px-4 pb-12 pt-6 sm:gap-8 sm:px-6 sm:pb-16 sm:pt-10 lg:min-h-[min(85svh,800px)] lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8 lg:pb-20 lg:pt-12">
        <div className="w-full max-w-xl animate-slide-up rounded-2xl bg-navy-950/35 p-5 backdrop-blur-[2px] sm:bg-transparent sm:p-0 sm:backdrop-blur-0">
          <img
            src="/eBookslogo.png"
            alt="eBooks"
            className="mb-4 h-16 w-auto max-w-[16rem] object-contain object-left sm:mb-5 sm:h-20 sm:max-w-[20rem] lg:h-24 lg:max-w-[22rem]"
            data-testid="hero-brand"
          />
          <h1
            id="hero-heading"
            className="font-playfair text-3xl leading-[1.12] text-text-heading text-balance sm:text-4xl lg:text-[2.85rem]"
            data-testid="hero-heading"
          >
            Literature, page by page
          </h1>
          <p
            className="mt-3 max-w-md text-base leading-relaxed text-text-muted sm:mt-4 sm:text-lg"
            data-testid="hero-supporting"
          >
            Open a classic, stretch into yoga, or cook something new — PDF
            ebooks ready whenever you are.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <Link
              to="/ebooks"
              data-testid="hero-ebooks-button"
              aria-label="Browse ebooks"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-gold-400 px-6 text-base font-medium text-navy-950 shadow-glow transition-all hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Browse ebooks
            </Link>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}
