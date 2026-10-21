import { getCookie, removeCookie, setCookie } from '@/utils/cookies'

/** Listening progress (resume) */
export interface ListeningState {
  audiobookId: string
  chapterId: string
  position: number
  playbackRate: number
}

/** Last opened ebook */
export interface ReadingState {
  ebookId: string
  openedAt: number
}

/** Player feature prefs — speed, volume, mute */
export interface PlayerPrefs {
  volume: number
  muted: boolean
  playbackRate: number
}

/** Saved favorites */
export interface FavoritesState {
  audiobookIds: string[]
  ebookIds: string[]
}

const LISTENING_KEY = 'ab_listening'
const READING_KEY = 'ab_reading'
const PREFS_KEY = 'ab_player_prefs'
const FAVORITES_KEY = 'ab_favorites'

const LEGACY_LISTENING = 'audiobooks-listening-state'
const LEGACY_READING = 'ebooks-reading-state'

const DEFAULT_PREFS: PlayerPrefs = {
  volume: 1,
  muted: false,
  playbackRate: 1,
}

function emit(name: string) {
  try {
    window.dispatchEvent(new Event(name))
  } catch {
    /* ignore */
  }
}

/** Read cookie first, then localStorage (migration / backup). */
function readPersisted(cookieKey: string, legacyLocalKey?: string): string | null {
  const fromCookie = getCookie(cookieKey)
  if (fromCookie) return fromCookie
  try {
    const fromLocal = localStorage.getItem(cookieKey)
    if (fromLocal) {
      setCookie(cookieKey, fromLocal)
      return fromLocal
    }
    if (legacyLocalKey) {
      const legacy = localStorage.getItem(legacyLocalKey)
      if (legacy) {
        setCookie(cookieKey, legacy)
        localStorage.setItem(cookieKey, legacy)
        return legacy
      }
    }
  } catch {
    /* ignore */
  }
  return null
}

function writePersisted(cookieKey: string, value: string) {
  setCookie(cookieKey, value)
  try {
    localStorage.setItem(cookieKey, value)
  } catch {
    /* ignore */
  }
}

function clearPersisted(cookieKey: string, legacyLocalKey?: string) {
  removeCookie(cookieKey)
  try {
    localStorage.removeItem(cookieKey)
    if (legacyLocalKey) localStorage.removeItem(legacyLocalKey)
  } catch {
    /* ignore */
  }
}

// —— Listening ——

export function getListeningState(): ListeningState | null {
  try {
    const raw = readPersisted(LISTENING_KEY, LEGACY_LISTENING)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isListeningState(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveListeningState(state: ListeningState): void {
  writePersisted(LISTENING_KEY, JSON.stringify(state))
  emit('ab-listening-changed')
}

export function clearListeningState(): void {
  clearPersisted(LISTENING_KEY, LEGACY_LISTENING)
  emit('ab-listening-changed')
}

// —— Reading ——

export function getReadingState(): ReadingState | null {
  try {
    const raw = readPersisted(READING_KEY, LEGACY_READING)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isReadingState(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveReadingState(ebookId: string): void {
  const state: ReadingState = { ebookId, openedAt: Date.now() }
  writePersisted(READING_KEY, JSON.stringify(state))
  emit('ab-reading-changed')
}

export function clearReadingState(): void {
  clearPersisted(READING_KEY, LEGACY_READING)
  emit('ab-reading-changed')
}

// —— Player prefs (speed / volume / mute) ——

export function getPlayerPrefs(): PlayerPrefs {
  try {
    const raw = readPersisted(PREFS_KEY)
    if (!raw) return { ...DEFAULT_PREFS }
    const parsed: unknown = JSON.parse(raw)
    if (!isPlayerPrefs(parsed)) return { ...DEFAULT_PREFS }
    return {
      volume: clamp(parsed.volume, 0, 1),
      muted: parsed.muted,
      playbackRate: parsed.playbackRate,
    }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export function savePlayerPrefs(prefs: Partial<PlayerPrefs>): void {
  const next = { ...getPlayerPrefs(), ...prefs }
  next.volume = clamp(next.volume, 0, 1)
  writePersisted(PREFS_KEY, JSON.stringify(next))
  emit('ab-prefs-changed')
}

// —— Favorites ——

export function getFavorites(): FavoritesState {
  try {
    const raw = readPersisted(FAVORITES_KEY)
    if (!raw) return { audiobookIds: [], ebookIds: [] }
    const parsed: unknown = JSON.parse(raw)
    if (!isFavoritesState(parsed)) return { audiobookIds: [], ebookIds: [] }
    return {
      audiobookIds: [...new Set(parsed.audiobookIds)],
      ebookIds: [...new Set(parsed.ebookIds)],
    }
  } catch {
    return { audiobookIds: [], ebookIds: [] }
  }
}

function writeFavorites(state: FavoritesState) {
  writePersisted(
    FAVORITES_KEY,
    JSON.stringify({
      audiobookIds: [...new Set(state.audiobookIds)].slice(0, 80),
      ebookIds: [...new Set(state.ebookIds)].slice(0, 80),
    }),
  )
  emit('ab-favorites-changed')
}

export function isFavoriteAudiobook(id: string): boolean {
  return getFavorites().audiobookIds.includes(id)
}

export function isFavoriteEbook(id: string): boolean {
  return getFavorites().ebookIds.includes(id)
}

export function toggleFavoriteAudiobook(id: string): boolean {
  const fav = getFavorites()
  const has = fav.audiobookIds.includes(id)
  writeFavorites({
    ...fav,
    audiobookIds: has
      ? fav.audiobookIds.filter((x) => x !== id)
      : [id, ...fav.audiobookIds],
  })
  return !has
}

export function toggleFavoriteEbook(id: string): boolean {
  const fav = getFavorites()
  const has = fav.ebookIds.includes(id)
  writeFavorites({
    ...fav,
    ebookIds: has
      ? fav.ebookIds.filter((x) => x !== id)
      : [id, ...fav.ebookIds],
  })
  return !has
}

// —— Guards ——

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function isListeningState(value: unknown): value is ListeningState {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.audiobookId === 'string' &&
    typeof v.chapterId === 'string' &&
    typeof v.position === 'number' &&
    typeof v.playbackRate === 'number'
  )
}

function isReadingState(value: unknown): value is ReadingState {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return typeof v.ebookId === 'string' && typeof v.openedAt === 'number'
}

function isPlayerPrefs(value: unknown): value is PlayerPrefs {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.volume === 'number' &&
    typeof v.muted === 'boolean' &&
    typeof v.playbackRate === 'number'
  )
}

function isFavoritesState(value: unknown): value is FavoritesState {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    Array.isArray(v.audiobookIds) &&
    Array.isArray(v.ebookIds) &&
    v.audiobookIds.every((x) => typeof x === 'string') &&
    v.ebookIds.every((x) => typeof x === 'string')
  )
}
