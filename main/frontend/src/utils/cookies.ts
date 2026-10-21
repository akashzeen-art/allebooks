/** Small cookie helpers — SameSite=Lax, 1 year default. */

const DEFAULT_DAYS = 365

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const prefix = `${encodeURIComponent(name)}=`
  const parts = document.cookie.split(';')
  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length))
    }
  }
  return null
}

export function setCookie(
  name: string,
  value: string,
  days: number = DEFAULT_DAYS,
): void {
  if (typeof document === 'undefined') return
  const maxAge = Math.max(0, Math.floor(days * 24 * 60 * 60))
  document.cookie = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'SameSite=Lax',
  ].join('; ')
}

export function removeCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0; SameSite=Lax`
}
