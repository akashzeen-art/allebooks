import { ebooks, getEbookById, type Ebook } from '@/data/ebooks'
import { getReadingState } from '@/utils/storage'

export type RecKind = 'ebook'

export interface Recommendation {
  kind: RecKind
  id: string
  title: string
  author: string
  cover: string
  href: string
  reason: string
  score: number
  ebook?: Ebook
}

export interface RecommendationBundle {
  readingSeed: Ebook | null
  fromReading: Recommendation[]
}

function pushUnique(
  list: Recommendation[],
  seen: Set<string>,
  item: Recommendation,
  limit: number,
) {
  const key = `${item.kind}:${item.id}`
  if (seen.has(key) || list.length >= limit) return
  seen.add(key)
  list.push(item)
}

function recommendationsFromReading(
  seed: Ebook,
  limit: number,
  seen: Set<string>,
): Recommendation[] {
  const out: Recommendation[] = []

  // Prefer same-author titles, then fill with other catalog picks.
  const sameAuthor = ebooks
    .filter(
      (book) =>
        book.id !== seed.id &&
        book.author &&
        seed.author &&
        book.author.toLowerCase() === seed.author.toLowerCase(),
    )
    .sort((a, b) => a.title.localeCompare(b.title))

  for (const ebook of sameAuthor) {
    pushUnique(
      out,
      seen,
      {
        kind: 'ebook',
        id: ebook.id,
        title: ebook.title,
        author: ebook.author,
        cover: ebook.cover || '',
        href: `/ebook/${ebook.id}`,
        reason: `More by ${seed.author}`,
        score: 80,
        ebook,
      },
      limit,
    )
  }

  const others = ebooks
    .filter((book) => book.id !== seed.id && book.cover)
    .sort((a, b) => a.title.localeCompare(b.title))

  for (const ebook of others) {
    pushUnique(
      out,
      seen,
      {
        kind: 'ebook',
        id: ebook.id,
        title: ebook.title,
        author: ebook.author,
        cover: ebook.cover || '',
        href: `/ebook/${ebook.id}`,
        reason: 'More to read',
        score: 40,
        ebook,
      },
      limit,
    )
  }

  return out
}

/**
 * Build personalized rows from the last-opened ebook.
 */
export function getRecommendationBundle(perRow = 8): RecommendationBundle {
  const savedRead = getReadingState()
  const readingSeed = savedRead ? getEbookById(savedRead.ebookId) ?? null : null

  const seen = new Set<string>()
  if (readingSeed) seen.add(`ebook:${readingSeed.id}`)

  const fromReading = readingSeed
    ? recommendationsFromReading(readingSeed, perRow, seen)
    : []

  return { readingSeed, fromReading }
}
