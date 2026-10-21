import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ebooks, getEbookCategories } from '@/data/ebooks'
import { EbookCard } from '@/components/EbookCard'
import { SearchBar } from '@/components/SearchBar'
import { cn } from '@/utils/cn'

const CATEGORY_LABELS: Record<string, string> = {
  Ebook: 'Classics',
  Yoga: 'Yoga',
  Cooking: 'Cooking',
}

function resolveCategory(
  raw: string | null,
  categories: string[],
): string {
  if (!raw || raw === 'all') return 'all'
  const match = categories.find(
    (c) => c.toLowerCase() === raw.toLowerCase(),
  )
  return match ?? 'all'
}

export function Ebooks() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categories = useMemo(() => getEbookCategories(), [])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(() =>
    resolveCategory(searchParams.get('category'), categories),
  )

  useEffect(() => {
    setCategory(resolveCategory(searchParams.get('category'), categories))
  }, [searchParams, categories])

  const selectCategory = (next: string) => {
    setCategory(next)
    if (next === 'all') {
      searchParams.delete('category')
      setSearchParams(searchParams, { replace: true })
    } else {
      setSearchParams({ category: next }, { replace: true })
    }
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ebooks.filter((book) => {
      if (category !== 'all' && book.category !== category) return false
      if (!q) return true
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q)
      )
    })
  }, [query, category])

  const missingCoverCount = results.filter((b) => !b.cover).length

  return (
    <div data-testid="ebooks-page">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,168,75,0.1),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold-400">
            Library
          </p>
          <h1
            className="mt-2 font-playfair text-3xl md:text-5xl"
            data-testid="ebooks-page-heading"
          >
            Ebooks
          </h1>
          <p className="mt-3 max-w-xl text-sm text-text-muted">
            {ebooks.length} PDF titles — classics, yoga, and cooking. Tap a cover
            to read in the full-screen viewer.
            {missingCoverCount > 0
              ? ` ${missingCoverCount} title${missingCoverCount === 1 ? '' : 's'} still need a thumbnail.`
              : null}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Ebook categories">
          <button
            type="button"
            role="tab"
            aria-selected={category === 'all'}
            data-testid="ebooks-category-all"
            onClick={() => selectCategory('all')}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              category === 'all'
                ? 'border-gold-400/50 bg-gold-400/15 text-gold-200'
                : 'border-white/10 bg-navy-900/40 text-text-muted hover:border-gold-400/30 hover:text-gold-200',
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              data-testid={`ebooks-category-${cat.toLowerCase()}`}
              onClick={() => selectCategory(cat)}
              className={cn(
                'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                category === cat
                  ? 'border-gold-400/50 bg-gold-400/15 text-gold-200'
                  : 'border-white/10 bg-navy-900/40 text-text-muted hover:border-gold-400/30 hover:text-gold-200',
              )}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>

        <div className="mb-8 max-w-md">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search ebooks…"
          />
        </div>

        {results.length === 0 ? (
          <p className="text-sm text-text-muted">No ebooks match “{query}”.</p>
        ) : (
          <div
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            data-testid="ebooks-grid"
          >
            {results.map((ebook) => (
              <EbookCard key={ebook.id} ebook={ebook} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
