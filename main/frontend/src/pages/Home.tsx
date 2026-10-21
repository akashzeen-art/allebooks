import { BookShelfShowcase } from '@/components/BookShelfShowcase'
import { HomeBookStore } from '@/components/HomeBookStore'
import { Hero } from '@/components/Hero'
import { HomeVideoBackground } from '@/components/HomeVideoBackground'

export function Home() {
  return (
    <div className="relative" data-testid="home-page">
      <div className="relative isolate">
        <HomeVideoBackground />
        <div className="relative z-10">
          <Hero />
        </div>
      </div>
      <div className="relative z-10 bg-navy-950">
        <BookShelfShowcase />
        <HomeBookStore />
      </div>
    </div>
  )
}
