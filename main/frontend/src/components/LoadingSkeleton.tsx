import { cn } from '@/utils/cn'

interface LoadingSkeletonProps {
  className?: string
  count?: number
  variant?: 'card' | 'list' | 'detail'
}

export function LoadingSkeleton({
  className,
  count = 4,
  variant = 'card',
}: LoadingSkeletonProps) {
  if (variant === 'detail') {
    return (
      <div
        className={cn('animate-pulse space-y-6', className)}
        data-testid="loading-skeleton-detail"
        aria-busy="true"
        aria-label="Loading"
      >
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="aspect-[2/3] w-full max-w-xs rounded-xl bg-navy-700/80" />
          <div className="flex-1 space-y-4">
            <div className="h-10 w-3/4 rounded bg-navy-700/80" />
            <div className="h-5 w-1/3 rounded bg-navy-700/60" />
            <div className="h-24 w-full rounded bg-navy-700/50" />
            <div className="h-11 w-40 rounded bg-navy-700/80" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div
        className={cn('space-y-3', className)}
        data-testid="loading-skeleton-list"
        aria-busy="true"
        aria-label="Loading"
      >
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-lg bg-navy-700/60"
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
        className,
      )}
      data-testid="loading-skeleton-grid"
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="aspect-[2/3] rounded-lg bg-navy-700/80" />
          <div className="h-4 w-4/5 rounded bg-navy-700/60" />
          <div className="h-3 w-1/2 rounded bg-navy-700/40" />
        </div>
      ))}
    </div>
  )
}
