import { Link } from 'react-router-dom'
import { getMixedShelfEbooks } from '@/data/ebooks'
import { toCoverSrc } from '@/utils/cover'
import styles from './BookShelfShowcase.module.css'

export function BookShelfShowcase() {
  const shelf = getMixedShelfEbooks(24)

  if (shelf.length === 0) return null

  return (
    <section
      className={styles.section}
      aria-labelledby="bookshelf-heading"
      data-testid="bookshelf-showcase-section"
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>On the shelf</p>
        <h2 id="bookshelf-heading" className={styles.title}>
          A wall of stories
        </h2>
        <p className={styles.subtitle}>
          A mix of classics, yoga, and cooking — tap a cover to open the ebook
          and start reading.
        </p>
      </div>

      <ul className={styles.shelf} data-testid="bookshelf-showcase-grid">
        {shelf.map((book) => (
          <li key={book.id} className={styles.cell}>
            <Link
              to={`/ebook/${book.id}`}
              className={styles.link}
              aria-label={`${book.title} by ${book.author}`}
            >
              <img
                className={styles.cover}
                src={toCoverSrc(book.cover!)}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
