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
const ebookByStem = new Map()
for (const b of ebooks) {
  ebookByStem.set(stem(b.title), b.title)
}

const both = []
const audioOnly = []
for (const t of audioTitles) {
  const hit = ebookByStem.get(stem(t))
  if (hit) both.push({ audio: t, ebook: hit })
  else audioOnly.push(t)
}

console.log('Moby Dick audiobook?', audioTitles.some((t) => /moby/i.test(t)) ? 'YES' : 'NO')
console.log(
  'Moby Dick ebook?',
  ebooks.filter((b) => /moby/i.test(b.title)).map((b) => b.title),
)
console.log('Audiobooks with same-title ebook:', both.length)
console.log('Audiobooks WITHOUT matching ebook:', audioOnly.length)
console.log('\nBoth (exact title match):')
both.forEach((x) => console.log('-', x.audio))
console.log('\nAudio only (no ebook with same title):')
audioOnly.forEach((t) => console.log('-', t))
