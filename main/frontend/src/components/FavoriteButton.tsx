import { Heart } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useFavorites } from '@/context/FavoritesContext'
import { cn } from '@/utils/cn'

interface FavoriteButtonProps {
  kind?: 'ebook'
  id: string
  title: string
  className?: string
  size?: 'sm' | 'md'
}

export function FavoriteButton({
  id,
  title,
  className,
  size = 'md',
}: FavoriteButtonProps) {
  const { isEbookFavorite, toggleEbook } = useFavorites()

  const active = isEbookFavorite(id)

  const onClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleEbook(id)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-full border transition-all',
        size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
        active
          ? 'border-gold-400/50 bg-gold-400/20 text-gold-300'
          : 'border-white/15 bg-navy-950/70 text-text-muted hover:border-gold-400/40 hover:text-gold-200',
        className,
      )}
      aria-pressed={active}
      aria-label={
        active ? `Remove ${title} from favorites` : `Save ${title} to favorites`
      }
      data-testid={`favorite-ebook-${id}`}
    >
      <Heart
        className={cn(size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4', active && 'fill-current')}
        aria-hidden
      />
    </button>
  )
}
