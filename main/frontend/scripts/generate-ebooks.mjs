import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const thumbDir = path.join(root, 'public', 'ebooksthumbnails')
const thumbs = fs.readdirSync(thumbDir)

const urls = fs
  .readFileSync(path.join(__dirname, 'ebook-urls.txt'), 'utf8')
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith('#'))

/** Skip known true duplicates only (none currently) */
const SKIP_URLS = new Set([])

function stem(name) {
  return decodeURIComponent(name)
    .replace(/\.(pdf|jpe?g|png)$/i, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[’']/g, "'")
    .replace(/[—–−]/g, '-')
    .replace(/[_]+/g, ' ')
    .replace(/[-]+/g, ' ')
    .replace(/[;:,.!&()]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function compact(name) {
  return stem(name).replace(/[^a-z0-9\u0370-\u03ff\u4e00-\u9fff]+/gi, '')
}

function slugify(title) {
  const s = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90)
  return s || `ebook-${Math.random().toString(36).slice(2, 8)}`
}

const thumbByStem = new Map()
const thumbByCompact = new Map()
for (const t of thumbs) {
  thumbByStem.set(stem(t), t)
  thumbByCompact.set(compact(t), t)
}

function findThumb(fileName) {
  const base = decodeURIComponent(fileName).replace(/\.pdf$/i, '')

  // Exact filename match first (keeps distinct editions with similar titles)
  for (const ext of ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG']) {
    const candidate = base + ext
    if (thumbs.includes(candidate)) return candidate
  }

  const key = stem(fileName)
  const ckey = compact(fileName)

  // Manual aliases: PDF name ≠ thumbnail filename but same book
  const ALIASES = {
    harry: "Harry's Mad.jpg",
    'applied psychology driving power of thought being the third in a series of twelve volumes on the applications of psychology to the problems of personal and business efficiency free ebook digital':
      'Applied Psychology_ Driving Power of Thought Being the Third in a Series of Twelve Volumes on the Applications of Psychology to the Problems of Personal and Business Efficiency _ Free ebook _ Digitalb.jpeg',
    'the history of the five indian nations of canada which are dependent on the province of new york and are a barrier between the english and the french in that part of the world free ebook digitalb':
      'The History of the Five Indian Nations of Canada.jpeg',
  }
  if (ALIASES[key] && thumbs.includes(ALIASES[key])) {
    return ALIASES[key]
  }

  // Shortened cover names (e.g. long PDF title → short jpeg)
  if (key.startsWith('the history of the five indian nations of canada')) {
    const short = 'The History of the Five Indian Nations of Canada.jpeg'
    if (thumbs.includes(short)) return short
  }

  // Digital vs Digitalb suffix mismatch
  if (key.endsWith(' digital')) {
    const digitalb = key.slice(0, -' digital'.length) + ' digitalb'
    if (thumbByStem.has(digitalb)) return thumbByStem.get(digitalb)
  }

  if (thumbByStem.has(key)) return thumbByStem.get(key)
  if (thumbByCompact.has(ckey)) return thumbByCompact.get(ckey)

  // prefix match for truncated CDN names (e.g. War-from-the-Inside-...-for-t.pdf)
  const prefix = key.slice(0, 48)
  if (prefix.length >= 20) {
    for (const [k, t] of thumbByStem) {
      if (k.startsWith(prefix) || prefix.startsWith(k.slice(0, 48))) return t
    }
  }

  // Rich Little Poor Boy etc. — startswith first significant words
  const words = key.split(' ').filter(Boolean).slice(0, 5).join(' ')
  if (words.length >= 12) {
    for (const [k, t] of thumbByStem) {
      if (k.startsWith(words) || words.startsWith(k.split(' ').slice(0, 5).join(' '))) {
        return t
      }
    }
  }

  return null
}

const matched = []
const missing = []
const usedThumbs = new Set()
const seenIds = new Map()
const seenUrls = new Set()

function uniqueId(title) {
  let base = slugify(title) || 'ebook'
  const count = (seenIds.get(base) ?? 0) + 1
  seenIds.set(base, count)
  return count === 1 ? base : `${base}-${count}`
}

for (const fileUrl of urls) {
  if (SKIP_URLS.has(fileUrl)) continue
  if (seenUrls.has(fileUrl)) continue
  seenUrls.add(fileUrl)

  const fileName = decodeURIComponent(fileUrl.split('/').pop())
  const title = fileName.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
  const thumb = findThumb(fileName)
  const id = uniqueId(title)

  if (thumb) {
    usedThumbs.add(thumb)
    matched.push({
      id,
      title,
      author: 'Classic Library',
      category: 'Ebook',
      description: `Read ${title} as a PDF ebook.`,
      fileUrl,
      format: 'pdf',
      cover: `/ebooksthumbnails/${thumb}`,
    })
  } else {
    missing.push(title)
    matched.push({
      id,
      title,
      author: 'Classic Library',
      category: 'Ebook',
      description: `Read ${title} as a PDF ebook.`,
      fileUrl,
      format: 'pdf',
    })
  }
}

const outTs = `export type EbookFormat = 'epub' | 'pdf'

export interface Ebook {
  id: string
  title: string
  author: string
  category: string
  description: string
  /** Direct CDN / API file URL (.epub or .pdf) */
  fileUrl: string
  format: EbookFormat
  /** Optional local thumbnail under /ebooksthumbnails */
  cover?: string
}

/**
 * Ebook catalog — PDF CDN + local thumbnails.
 * Titles without a matching thumbnail have an empty cover (placeholder in UI).
 * Generated by scripts/generate-ebooks.mjs from scripts/ebook-urls.txt
 */
export const ebooks: Ebook[] = ${JSON.stringify(matched, null, 2)}

export function getEbookById(id: string): Ebook | undefined {
  return ebooks.find((book) => book.id === id)
}

/** Map CDN file URL → same-origin proxy path (avoids BunnyCDN CORS). */
export function ebookProxyPath(fileUrl: string): string {
  try {
    const url = new URL(fileUrl)
    return \`/ebook-proxy\${url.pathname}\${url.search}\`
  } catch {
    return fileUrl
  }
}

export function detectEbookFormat(fileUrl: string): EbookFormat {
  const pathOnly = fileUrl.split('?')[0]?.toLowerCase() ?? ''
  return pathOnly.endsWith('.pdf') ? 'pdf' : 'epub'
}
`

fs.writeFileSync(path.join(root, 'src', 'data', 'ebooks.ts'), outTs)

const report = {
  totalUrls: matched.length,
  withCover: matched.filter((m) => m.cover).length,
  missingThumbs: missing,
  unusedThumbs: thumbs.filter((t) => !usedThumbs.has(t)),
}

fs.writeFileSync(path.join(__dirname, 'ebook-match-report.json'), JSON.stringify(report, null, 2))

console.log('total', report.totalUrls)
console.log('withCover', report.withCover)
console.log('missing', report.missingThumbs.length)
if (report.missingThumbs.length) {
  console.log('--- missing thumbs ---')
  console.log(report.missingThumbs.join('\n'))
}
console.log('unused thumbs', report.unusedThumbs.length)
if (report.unusedThumbs.length) {
  console.log('--- unused thumbs ---')
  console.log(report.unusedThumbs.join('\n'))
}
