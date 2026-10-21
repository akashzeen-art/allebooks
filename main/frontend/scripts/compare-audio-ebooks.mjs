import fs from 'node:fs'

function stem(t) {
  return String(t)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const ebookSrc = fs.readFileSync('src/data/ebooks.ts', 'utf8')
const em = ebookSrc.match(/export const ebooks: Ebook\[\] = (\[[\s\S]*?\])\n\nexport function/)
const ebooks = JSON.parse(em[1])

const audioSrc = fs.readFileSync('src/data/audiobooks.ts', 'utf8')
const audioTitles = []
const blocks = audioSrc.split(/\{\s*id:/)
for (const b of blocks.slice(1)) {
  const tm = b.match(/title:\s*'((?:\\'|[^'])*)'/)
  if (tm) audioTitles.push(tm[1].replace(/\\'/g, "'"))
}

const audioMap = new Map()
for (const t of audioTitles) {
  const k = stem(t)
  if (!audioMap.has(k)) audioMap.set(k, t)
}
const ebookMap = new Map()
for (const b of ebooks) {
  const k = stem(b.title)
  if (!ebookMap.has(k)) ebookMap.set(k, b.title)
}

const overlap = []
for (const [k, t] of ebookMap) {
  if (audioMap.has(k)) overlap.push({ ebook: t, audio: audioMap.get(k) })
}

console.log(
  JSON.stringify(
    {
      audiobooks: audioTitles.length,
      ebooks: ebooks.length,
      similarTitles: overlap.length,
      sampleOverlap: overlap.slice(0, 12),
    },
    null,
    2,
  ),
)
