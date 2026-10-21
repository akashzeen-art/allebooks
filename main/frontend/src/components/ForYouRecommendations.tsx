import { BookOpen, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EbookCard } from '@/components/EbookCard'
import {
  getRecommendationBundle,
  type Recommendation,
  type RecommendationBundle,
} from '@/utils/recommendations'

function RecRow({
  eyebrow,
  title,
  seedLabel,
  items,
  testId,
}: {
  eyebrow: string
  title: string
  seedLabel: string
  items: Recommendation[]
  testId: string
}) {
  if (items.length === 0) return null

  return (
    <div data-testid={testId}>
      <div className="mb-4">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-gold-400">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {eyebrow}
        </p>
        <h3 className="mt-1 font-playfair text-xl text-text-heading sm:text-2xl">
          {title}
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          Based on <span className="text-gold-200/90">{seedLabel}</span>
        </p>
      </div>

      <ul
        className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-testid={`${testId}-list`}
      >
        {items.map((item) => (
          <li
            key={`${item.kind}-${item.id}`}
            className="w-[9.5rem] shrink-0 sm:w-40"
          >
            {item.ebook ? (
              <div>
                <EbookCard ebook={item.ebook} />
                <p className="mt-2 truncate text-[0.65rem] uppercase tracking-wider text-gold-400/80">
                  {item.reason}
                </p>
              </div>
            ) : (
              <Link to={item.href} className="block text-sm text-gold-200">
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function loadBundle(): RecommendationBundle {
  return getRecommendationBundle(8)
}

/**
 * Home “For you” strip — recommendations from what you’re reading.
 */
export function ForYouRecommendations() {
  const [bundle, setBundle] = useState<RecommendationBundle>(() => loadBundle())

  useEffect(() => {
    const refresh = () => setBundle(loadBundle())
    refresh()
    window.addEventListener('ab-reading-changed', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('ab-reading-changed', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const hasReading = bundle.fromReading.length > 0
  if (!hasReading) return null

  return (
    <section
      className="animate-slide-up space-y-10"
      aria-labelledby="for-you-heading"
      data-testid="for-you-recommendations"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id="for-you-heading"
            className="font-playfair text-2xl text-text-heading md:text-3xl"
          >
            For you
          </h2>
          <p className="mt-1 max-w-lg text-sm text-text-muted">
            Picks that follow what you’re reading right now.
          </p>
        </div>
      </div>

      {bundle.readingSeed ? (
        <RecRow
          eyebrow="Because you’re reading"
          title="More in that mood"
          seedLabel={bundle.readingSeed.title}
          items={bundle.fromReading}
          testId="recs-from-reading"
        />
      ) : null}

      <div className="flex flex-wrap gap-3 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-gold-400" aria-hidden />
          Same author &amp; more from the library
        </span>
      </div>
    </section>
  )
}
