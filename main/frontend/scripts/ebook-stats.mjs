import fs from 'node:fs'
import path from 'node:path'

const src = fs.readFileSync('src/data/ebooks.ts', 'utf8')
const m = src.match(/export const ebooks: Ebook\[\] = (\[[\s\S]*?\])\n\nexport function/)
const books = JSON.parse(m[1])
const thumbs = fs.readdirSync('public/ebooksthumbnails')

function stem(name) {
  return decodeURIComponent(name)
    .replace(/\.(pdf|jpe?g|png)$/i, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[’']/g, "'")
    .replace(/[—–−]/g, '-')
    .replace(/[_-]+/g, ' ')
    .replace(/[;:,.!&()]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

const missingThumb = books.filter((b) => !b.cover).map((b) => b.title)
const usedCovers = new Set(books.filter((b) => b.cover).map((b) => path.basename(b.cover)))
const unusedThumbs = thumbs.filter((t) => !usedCovers.has(t))

const byNorm = new Map()
const byUrl = new Map()
for (const b of books) {
  const n = stem(b.title)
  if (!byNorm.has(n)) byNorm.set(n, [])
  byNorm.get(n).push(b.title)
  if (!byUrl.has(b.fileUrl)) byUrl.set(b.fileUrl, [])
  byUrl.get(b.fileUrl).push(b.title)
}
const titleDups = [...byNorm.entries()].filter(([, a]) => a.length > 1)
const urlDups = [...byUrl.entries()].filter(([, a]) => a.length > 1)

console.log(
  JSON.stringify(
    {
      totalEbooks: books.length,
      withThumbnail: books.filter((b) => b.cover).length,
      missingThumbnails: missingThumb.length,
      missingThumbnailTitles: missingThumb,
      totalThumbnailFiles: thumbs.length,
      thumbnailsWithoutPdfUrl: unusedThumbs.length,
      thumbnailsWithoutPdfUrlFiles: unusedThumbs,
      repeatSimilarTitles: titleDups.length,
      repeatTitleDetails: titleDups.map(([, a]) => a),
      repeatExactUrls: urlDups.length,
    },
    null,
    2,
  ),
)
