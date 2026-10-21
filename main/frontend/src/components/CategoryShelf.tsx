import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getEbooksByCategory } from '@/data/ebooks'
import { CoverImage } from '@/components/CoverImage'
import { cn } from '@/utils/cn'
import styles from './CategoryShelf.module.css'

type ShelfTone = 'yoga' | 'cooking'

interface CategoryShelfProps {
  category: string
  tone: ShelfTone
  eyebrow: string
  title: string
  subtitle: string
  browseLabel: string
  testId: string
  limit?: number
}

export function CategoryShelf({
  category,
  tone,
  eyebrow,
  title,
  subtitle,
  browseLabel,
  testId,
  limit = 12,
}: CategoryShelfProps) {
  const books = getEbooksByCategory(category)
    .filter((book) => Boolean(book.cover))
    .slice(0, limit)

  if (books.length === 0) return null

  const featured = books.slice(0, 5)
  const rail = books.slice(5)
  const browseTo = `/ebooks?category=${encodeURIComponent(category)}`
  const total = getEbooksByCategory(category).length

  return (
    <section
      className={cn(styles.section, styles[tone])}
      aria-labelledby={`${testId}-heading`}
      data-testid={testId}
    >
      <div className={styles.glow} aria-hidden />
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <p className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden />
              {eyebrow}
            </p>
            <h2 id={`${testId}-heading`} className={styles.title}>
              {title}
            </h2>
            <p className={styles.subtitle}>{subtitle}</p>
            <div className={styles.meta}>
              <span>
                <strong>{total}</strong> titles
              </span>
              <span>PDF · Full-screen reader</span>
            </div>
            <Link
              to={browseTo}
              className={styles.cta}
              data-testid={`${testId}-browse-link`}
            >
              {browseLabel}
              <ArrowRight className={styles.ctaIcon} aria-hidden />
            </Link>
          </div>

          <div className={styles.stage}>
            <div className={styles.stageGlow} aria-hidden />
            <ul className={styles.fan} data-testid={`${testId}-featured`}>
              {featured.map((book) => (
                <li key={book.id}>
                  <Link
                    to={`/ebook/${book.id}`}
                    className={styles.card}
                    aria-label={`Read ${book.title}`}
                    data-testid={`${testId}-card-${book.id}`}
                  >
                    <div className={styles.coverWrap}>
                      <CoverImage
                        src={book.cover!}
                        alt={`Cover of ${book.title}`}
                        title={book.title}
                        className="h-full w-full"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {rail.length > 0 ? (
              <ul className={styles.rail} data-testid={`${testId}-rail`}>
                {rail.map((book) => (
                  <li key={book.id} className={styles.railItem}>
                    <Link
                      to={`/ebook/${book.id}`}
                      className={styles.railLink}
                      aria-label={`Read ${book.title}`}
                    >
                      <CoverImage
                        src={book.cover!}
                        alt=""
                        title={book.title}
                        className="h-full w-full"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
