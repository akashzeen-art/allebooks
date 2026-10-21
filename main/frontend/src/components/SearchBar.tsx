import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search by title, author, or category…',
  className,
  id = 'ebook-search',
}: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="sr-only">
        Search ebooks
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid="ebook-search-input"
        className="h-11 w-full rounded-lg border border-white/10 bg-navy-800/60 pl-10 pr-4 text-sm text-text-heading placeholder:text-text-muted transition-colors focus:border-gold-400/50 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
      />
    </div>
  )
}
