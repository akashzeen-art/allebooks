import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getFavorites,
  toggleFavoriteEbook,
  type FavoritesState,
} from '@/utils/storage'

interface FavoritesContextValue {
  favorites: FavoritesState
  isEbookFavorite: (id: string) => boolean
  toggleEbook: (id: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritesState>(() => getFavorites())

  useEffect(() => {
    const sync = () => setFavorites(getFavorites())
    window.addEventListener('ab-favorites-changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('ab-favorites-changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const isEbookFavorite = useCallback(
    (id: string) => favorites.ebookIds.includes(id),
    [favorites.ebookIds],
  )

  const toggleEbook = useCallback((id: string) => {
    toggleFavoriteEbook(id)
    setFavorites(getFavorites())
  }, [])

  const value = useMemo(
    () => ({
      favorites,
      isEbookFavorite,
      toggleEbook,
    }),
    [favorites, isEbookFavorite, toggleEbook],
  )

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return ctx
}
