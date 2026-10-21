import { useEffect, useState } from 'react'
import { BookOpen, Flame, Leaf } from 'lucide-react'
import styles from './EbookPreloader.module.css'

const DURATION_MS = 5000

const FLOATING_COVERS = [
  { src: '/ebooksthumbnails/Pride and Prejudice.jpg', className: styles.cover1 },
  { src: '/ebooksthumbnails/Dracula.jpg', className: styles.cover2 },
  { src: '/eyogabooks/9.png', className: styles.cover3 },
  { src: '/ecookbooks/6.png', className: styles.cover4 },
  { src: '/ebooksthumbnails/Alice\'s Adventures in Wonderland.jpg', className: styles.cover5 },
  { src: '/eyogabooks/1.png', className: styles.cover6 },
] as const

const STATUS_LINES = [
  'Shelving classics…',
  'Laying out yoga guides…',
  'Opening cookbooks…',
  'Turning the first page…',
  'Almost ready…',
]

const CATEGORIES = [
  { label: 'Classics', Icon: BookOpen },
  { label: 'Yoga', Icon: Leaf },
  { label: 'Cooking', Icon: Flame },
] as const

export function EbookPreloader() {
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setExiting(true)
    }, DURATION_MS)

    const hideTimer = window.setTimeout(() => {
      setVisible(false)
    }, DURATION_MS + 700)

    const statusTimer = window.setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_LINES.length)
    }, 900)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(hideTimer)
      window.clearInterval(statusTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`${styles.overlay} ${exiting ? styles.overlayHidden : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading eBooks library"
      data-testid="ebook-preloader"
    >
      <div className={styles.orbit} aria-hidden>
        {FLOATING_COVERS.map((cover) => (
          <img
            key={cover.src}
            src={cover.src}
            alt=""
            className={`${styles.floatCover} ${cover.className}`}
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={styles.spark}
            style={{ ['--i' as string]: i }}
          />
        ))}
      </div>

      <div className={styles.stage}>
        <img src="/eBookslogo.png" alt="eBooks" className={styles.logo} />

        <div className={styles.book} aria-hidden>
          <div className={`${styles.page} ${styles.pageLeft}`}>
            <div className={styles.pageLines}>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className={styles.spine} />
          <div className={`${styles.page} ${styles.pageRight}`}>
            <div className={styles.pageLines}>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className={styles.turningPage} />
        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>Opening the library</p>
          <h2 className={styles.title}>Your next chapter awaits</h2>
          <p className={styles.subtitle}>
            Classics, yoga, and cooking — pages ready to turn.
          </p>
        </div>

        <ul className={styles.categories} aria-hidden>
          {CATEGORIES.map(({ label, Icon }, i) => (
            <li
              key={label}
              className={styles.categoryChip}
              style={{ animationDelay: `${0.35 + i * 0.12}s` }}
            >
              <Icon className={styles.categoryIcon} />
              {label}
            </li>
          ))}
        </ul>

        <blockquote className={styles.quote}>
          “A reader lives a thousand lives before he dies.”
          <cite>— George R.R. Martin</cite>
        </blockquote>

        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} />
          </div>
          <p className={styles.progressLabel} key={statusIndex}>
            {STATUS_LINES[statusIndex]}
          </p>
        </div>
      </div>
    </div>
  )
}
