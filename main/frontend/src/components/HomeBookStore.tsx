import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import {
  ebooks,
  getEbooksByCategory,
  getMixedShelfEbooks,
  type Ebook,
} from '@/data/ebooks'
import { toCoverSrc } from '@/utils/cover'
import { cn } from '@/utils/cn'
import styles from './HomeBookStore.module.css'

type GenreFilter = 'all' | 'Ebook' | 'Yoga' | 'Cooking'

const GENRES: { id: GenreFilter; label: string }[] = [
  { id: 'all', label: 'All Genres' },
  { id: 'Ebook', label: 'Classics' },
  { id: 'Yoga', label: 'Yoga' },
  { id: 'Cooking', label: 'Cooking' },
]

const TONES = [
  styles.tone0,
  styles.tone1,
  styles.tone2,
  styles.tone3,
  styles.tone4,
] as const

function categoryLabel(category: string) {
  if (category === 'Ebook') return 'Classics'
  return category
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function Stars() {
  return (
    <span className={styles.stars} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={styles.star} />
      ))}
    </span>
  )
}

function FeaturedCell({ book, tone }: { book: Ebook; tone: string }) {
  return (
    <article className={cn(styles.cell, tone)}>
      <div className={styles.bookImg}>
        <img
          src={toCoverSrc(book.cover!)}
          alt=""
          className={styles.bookPhoto}
          loading="lazy"
        />
      </div>
      <div className={styles.bookContent}>
        <h3 className={styles.bookTitle}>{book.title}</h3>
        <p className={styles.bookAuthor}>by {book.author}</p>
        <span className={styles.categoryChip}>
          {categoryLabel(book.category)}
        </span>
        <p className={styles.bookSum}>{book.description}</p>
        <Link to={`/ebook/${book.id}`} className={styles.seeBtn}>
          See The Book
        </Link>
      </div>
    </article>
  )
}

export function HomeBookStore() {
  const [genre, setGenre] = useState<GenreFilter>('all')

  const featured = useMemo(() => getMixedShelfEbooks(5), [])

  const authors = useMemo(() => {
    const names = new Map<string, string>()
    for (const book of ebooks) {
      if (!book.author || names.has(book.author)) continue
      if (book.author === 'Classic Library' || book.author === 'Yoga Library') {
        continue
      }
      names.set(book.author, book.category)
      if (names.size >= 6) break
    }
    // Fill with distinctive catalog authors if needed
    if (names.size < 6) {
      for (const book of ebooks) {
        if (!book.author || names.has(book.author)) continue
        names.set(book.author, book.category)
        if (names.size >= 6) break
      }
    }
    return [...names.entries()].map(([name, category]) => ({ name, category }))
  }, [])

  const yearBooks = useMemo(() => {
    const yoga = getEbooksByCategory('Yoga').filter((b) => b.cover).slice(0, 2)
    const cook = getEbooksByCategory('Cooking').filter((b) => b.cover).slice(0, 2)
    const classic = getEbooksByCategory('Ebook').filter((b) => b.cover).slice(0, 1)
    return [...yoga, ...cook, ...classic].slice(0, 5)
  }, [])

  const popular = useMemo(() => {
    const source =
      genre === 'all'
        ? getMixedShelfEbooks(6)
        : getEbooksByCategory(genre).filter((b) => Boolean(b.cover)).slice(0, 6)
    return source
  }, [genre])

  return (
    <section className={styles.store} data-testid="home-book-store" aria-label="Bookstore">
      <div className={styles.slide}>
        <div className={styles.track} data-testid="home-book-store-slide">
          {featured.map((book, i) => (
            <FeaturedCell
              key={book.id}
              book={book}
              tone={TONES[i % TONES.length]!}
            />
          ))}
        </div>
      </div>

      <div className={styles.main}>
        <aside className={styles.sidebar} aria-label="Spotlight">
          <div className={styles.sideBlock}>
            <h2 className={styles.sideTitle}>Authors to explore</h2>
            {authors.map((author) => (
              <Link
                key={author.name}
                to={`/ebooks?category=${encodeURIComponent(author.category)}`}
                className={styles.authorRow}
              >
                <span className={styles.authorAvatar} aria-hidden>
                  {initials(author.name)}
                </span>
                <span className={styles.authorName}>{author.name}</span>
              </Link>
            ))}
          </div>

          <div className={styles.sideBlock}>
            <h2 className={styles.sideTitle}>Featured picks</h2>
            {yearBooks.map((book) => (
              <Link
                key={book.id}
                to={`/ebook/${book.id}`}
                className={styles.yearRow}
              >
                <img
                  src={toCoverSrc(book.cover!)}
                  alt=""
                  className={styles.yearImg}
                  loading="lazy"
                />
                <div className={styles.yearMeta}>
                  <div className={styles.yearName}>{book.title}</div>
                  <div className={styles.yearAuthor}>by {book.author}</div>
                </div>
              </Link>
            ))}
          </div>
        </aside>

        <div className={styles.popular}>
          <div className={styles.menu}>
            <h2 className={styles.genreLabel}>Popular by Genre</h2>
            <div className={styles.types} role="tablist" aria-label="Genres">
              {GENRES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={genre === item.id}
                  className={cn(
                    styles.typeBtn,
                    genre === item.id && styles.typeBtnActive,
                  )}
                  onClick={() => setGenre(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.cards} data-testid="home-book-store-cards">
            {popular.map((book) => (
              <Link
                key={book.id}
                to={`/ebook/${book.id}`}
                className={styles.card}
                aria-label={`Read ${book.title}`}
              >
                <div className={styles.cardTop}>
                  <img
                    src={toCoverSrc(book.cover!)}
                    alt=""
                    className={styles.cardImg}
                    loading="lazy"
                  />
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardName}>{book.title}</h3>
                    <p className={styles.cardBy}>by {book.author}</p>
                    <span className={styles.cardChip}>
                      {categoryLabel(book.category)}
                    </span>
                    <p className={styles.cardSum}>{book.description}</p>
                  </div>
                </div>
                <div className={styles.cardFoot}>
                  <Stars />
                  <span>{categoryLabel(book.category)} · PDF</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
