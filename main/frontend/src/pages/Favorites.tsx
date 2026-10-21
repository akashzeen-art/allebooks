import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getEbookById } from '@/data/ebooks'
import { EbookCard } from '@/components/EbookCard'
import { useFavorites } from '@/context/FavoritesContext'

export function Favorites() {
  const { favorites } = useFavorites()

  const ebookBooks = favorites.ebookIds
    .map((id) => getEbookById(id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))

  const empty = ebookBooks.length === 0

  return (
    <div data-testid="favorites-page">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,75,0.1),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-gold-400">
            <Heart className="h-3.5 w-3.5" aria-hidden />
            Saved for you
          </p>
          <h1
            className="mt-2 font-playfair text-3xl md:text-5xl"
            data-testid="favorites-page-heading"
          >
            Favorites
          </h1>
          <p className="mt-3 max-w-xl text-sm text-text-muted">
            Titles you heart stay saved in your browser cookies — ready when you
            come back.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        {empty ? (
          <div className="rounded-xl border border-white/10 bg-navy-900/40 px-6 py-12 text-center">
            <Heart className="mx-auto h-8 w-8 text-gold-400/70" aria-hidden />
            <p className="mt-4 font-playfair text-xl text-text-heading">
              No favorites yet
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Tap the heart on any cover to save it here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/ebooks" className="text-gold-300 hover:underline">
                Browse ebooks
              </Link>
            </div>
          </div>
        ) : (
          <section aria-labelledby="fav-ebook-heading">
            <h2
              id="fav-ebook-heading"
              className="mb-6 font-playfair text-2xl text-text-heading"
            >
              Ebooks ({ebookBooks.length})
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {ebookBooks.map((book) => (
                <EbookCard key={book.id} ebook={book} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
