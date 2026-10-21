import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Ebook } from '@/data/ebooks'
import { CoverImage } from '@/components/CoverImage'
import { FavoriteButton } from '@/components/FavoriteButton'
import { cn } from '@/utils/cn'

interface EbookCardProps {
  ebook: Ebook
  className?: string
}

export function EbookCard({ ebook, className }: EbookCardProps) {
  const href = `/ebook/${ebook.id}`

  return (
    <article
      className={cn('group relative animate-fade-in', className)}
      data-testid={`ebook-card-${ebook.id}`}
    >
      <div className="absolute right-2 top-2 z-20">
        <FavoriteButton
          kind="ebook"
          id={ebook.id}
          title={ebook.title}
          size="sm"
        />
      </div>
      <Link
        to={href}
        className="block focus-visible:rounded-xl"
        data-testid={`ebook-card-${ebook.id}-link`}
        aria-label={`Read ${ebook.title}`}
      >
        <div className="magic-card">
          <div className="magic-card-inner ring-1 ring-white/10">
            {ebook.cover ? (
              <CoverImage
                src={ebook.cover}
                alt={`Cover of ${ebook.title}`}
                title={ebook.title}
                className="aspect-[2/3] w-full rounded-none"
                data-testid={`ebook-card-${ebook.id}-cover`}
              />
            ) : (
              <div
                className="flex aspect-[2/3] w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-navy-900 to-navy-950 p-4 text-center"
                data-testid={`ebook-card-${ebook.id}-cover-placeholder`}
              >
                <BookOpen className="h-10 w-10 text-gold-400/80" aria-hidden />
                <p className="font-playfair text-sm text-text-heading line-clamp-3">
                  {ebook.title}
                </p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/20 to-transparent opacity-90" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="line-clamp-1 text-[10px] uppercase tracking-[0.14em] text-gold-300/90">
                PDF · {ebook.category === 'Ebook' ? 'Classics' : ebook.category}
              </p>
            </div>
            <span className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gold-400 text-navy-950 shadow-glow transition-transform group-hover:scale-105">
              <BookOpen className="h-5 w-5" aria-hidden />
            </span>
          </div>
        </div>
        <div className="mt-3 space-y-1 px-0.5">
          <h3
            className="font-playfair text-base leading-snug text-text-heading line-clamp-2 transition-colors group-hover:text-gold-200"
            data-testid={`ebook-card-${ebook.id}-title`}
          >
            {ebook.title}
          </h3>
          <p
            className="text-sm text-text-muted line-clamp-1"
            data-testid={`ebook-card-${ebook.id}-author`}
          >
            {ebook.author}
          </p>
        </div>
      </Link>
    </article>
  )
}
