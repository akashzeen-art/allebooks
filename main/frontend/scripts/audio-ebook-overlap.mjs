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

const audioSrc = fs.readFileSync('src/data/audiobooks.ts', 'utf8')
const audioTitles = []
for (const b of audioSrc.split(/\{\s*id:/).slice(1)) {
  const tm = b.match(/title:\s*'((?:\\'|[^'])*)'/)
  if (tm) audioTitles.push(tm[1].replace(/\\'/g, "'"))
}

const ebookSrc = fs.readFileSync('src/data/ebooks.ts', 'utf8')
const em = ebookSrc.match(/export const ebooks: Ebook\[\] = (\[[\s\S]*?\])\n\nexport function/)
const ebooks = JSON.parse(em[1])

const ebookKeys = new Map(ebooks.map((b) => [stem(b.title), b.title]))

const withEbook = []
const withoutEbook = []
for (const t of audioTitles) {
  const k = stem(t)
  // fuzzy: ebook title contains audio title or vice versa for moby etc
  let match = ebookKeys.get(k)
  if (!match) {
    for (const [ek, et] of ebookKeys) {
      if (ek.includes(k) || k.includes(ek)) {
        match = et
        break
      }
    }
  }
  if (match) withEbook.push({ audio: t, ebook: match })
  else withoutEbook.push(t)
}

const mobyAudio = audioTitles.filter((t) => /moby/i.test(t))
const mobyEbook = ebooks.filter((b) => /moby/i.test(b.title)).map((b) => b.title)

console.log(
  JSON.stringify(
    {
      mobyDickAudio: mobyAudio.length ? mobyAudio : 'NOT in audiobooks',
      mobyDickEbook: mobyEbook.length ? mobyEbook : 'NOT in ebooks',
      audiobooksThatAlsoHaveEbook: withEbook.length,
      audiobooksWithoutEbook: withoutEbook.length,
      withEbookList: withEbook,
      withoutEbookList: withoutEbook,
    },
    null,
    2,
  ),
)
