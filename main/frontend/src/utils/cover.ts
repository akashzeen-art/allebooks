/** Encode cover asset paths for reliable <img src> / CSS url usage. */
export function toCoverSrc(src: string): string {
  try {
    return encodeURI(decodeURI(src)).replace(/'/g, '%27')
  } catch {
    return encodeURI(src).replace(/'/g, '%27')
  }
}
