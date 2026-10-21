import { BookOpen } from 'lucide-react'
import { useCallback, useState } from 'react'
import { cn } from '@/utils/cn'
import { toCoverSrc } from '@/utils/cover'

interface CoverImageProps {
  src: string
  alt: string
  title?: string
  className?: string
  imgClassName?: string
  'data-testid'?: string
}

function getInitials(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

function markIfReady(
  img: HTMLImageElement | null,
  onReady: () => void,
  onFail: () => void,
) {
  if (!img) return
  if (img.complete) {
    if (img.naturalWidth > 0) onReady()
    else onFail()
  }
}

export function CoverImage({
  src,
  alt,
  title,
  className,
  imgClassName,
  'data-testid': testId,
}: CoverImageProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const label = title ?? alt
  const resolvedSrc = toCoverSrc(src)

  const setImgRef = useCallback((img: HTMLImageElement | null) => {
    markIfReady(
      img,
      () => {
        setFailed(false)
        setLoaded(true)
      },
      () => {
        setFailed(true)
        setLoaded(false)
      },
    )
  }, [])

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-navy-700/80',
        className,
      )}
      data-testid={testId}
    >
      {!failed ? (
        <img
          key={resolvedSrc}
          ref={setImgRef}
          src={resolvedSrc}
          alt={alt}
          loading="eager"
          decoding="async"
          onLoad={() => {
            setFailed(false)
            setLoaded(true)
          }}
          onError={() => {
            setFailed(true)
            setLoaded(false)
          }}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-200',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      ) : null}

      {(failed || !loaded) && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-navy-700 to-navy-900 text-gold-300"
          aria-hidden={failed ? undefined : true}
        >
          {failed ? (
            <>
              <BookOpen className="h-8 w-8 opacity-80" aria-hidden />
              <span className="font-playfair text-lg tracking-wide">
                {getInitials(label) || 'AB'}
              </span>
            </>
          ) : (
            <div className="h-10 w-10 animate-pulse rounded bg-white/10" />
          )}
        </div>
      )}
    </div>
  )
}
