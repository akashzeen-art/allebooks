import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/EmptyState'

export function NotFound() {
  return (
    <div
      className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 sm:px-6 lg:px-8"
      data-testid="not-found-page"
    >
      <p
        className="font-playfair text-6xl text-gold-400/80"
        data-testid="not-found-code"
      >
        404
      </p>
      <EmptyState
        title="Page not found"
        description="The page you’re looking for doesn’t exist or has moved."
        data-testid="not-found-message"
        className="mt-6 w-full max-w-lg border-0 bg-transparent py-8"
      />
      <Link
        to="/"
        className="mt-4 inline-flex h-11 items-center rounded-lg bg-gold-400 px-5 text-sm font-medium text-navy-950 shadow-glow transition-colors hover:bg-gold-300"
        data-testid="not-found-home-link"
      >
        Back to home
      </Link>
    </div>
  )
}
