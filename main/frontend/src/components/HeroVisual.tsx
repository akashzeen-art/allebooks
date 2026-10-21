import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getEbookById } from '@/data/ebooks'
import { toCoverSrc } from '@/utils/cover'
import { cn } from '@/utils/cn'
import styles from './HeroVisual.module.css'

const POSITIONS = ['back', 'mid', 'front'] as const

/** Distinct classics for the hero fan. */
const HERO_COVER_IDS = [
  'pride-and-prejudice',
  'dracula',
  'alice-s-adventures-in-wonderland',
] as const

/**
 * Atmospheric right-side stage: floating covers.
 */
export function HeroVisual() {
  const covers = HERO_COVER_IDS.map((id) => getEbookById(id)).filter(
    (book): book is NonNullable<typeof book> => Boolean(book?.cover),
  )

  if (covers.length === 0) return null

  return (
    <div className={styles.stage} data-testid="hero-visual">
      <div className={styles.glow} aria-hidden />

      <ul className={styles.fan} data-testid="hero-visual-covers">
        {covers.map((book, i) => {
          const slot = POSITIONS[i] ?? 'mid'
          return (
            <li key={book.id} className={cn(styles.cover, styles[slot])}>
              <Link
                to={`/ebook/${book.id}`}
                className={styles.coverLink}
                aria-label={`${book.title} by ${book.author}`}
              >
                <img
                  src={toCoverSrc(book.cover!)}
                  alt=""
                  className={styles.coverImg}
                  loading="eager"
                  decoding="async"
                />
              </Link>
            </li>
          )
        })}
      </ul>

      <div className={styles.cues} aria-hidden>
        <span className={styles.cue}>
          <BookOpen className={styles.cueIcon} />
          Read
        </span>
      </div>
    </div>
  )
}
