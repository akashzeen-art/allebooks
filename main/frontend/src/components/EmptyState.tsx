import { BookX, type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
  'data-testid'?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = BookX,
  className,
  'data-testid': testId = 'empty-state',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-navy-800/30 px-6 py-16 text-center animate-fade-in',
        className,
      )}
      data-testid={testId}
      role="status"
    >
      <Icon className="mb-4 h-10 w-10 text-gold-400/70" aria-hidden />
      <h2 className="font-playfair text-xl text-text-heading">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-text-muted">{description}</p>
      ) : null}
    </div>
  )
}
