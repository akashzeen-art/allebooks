import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { Ebooks } from '@/pages/Ebooks'
import { EbookReader } from '@/pages/EbookReader'
import { Favorites } from '@/pages/Favorites'
import { NotFound } from '@/pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="ebooks" element={<Ebooks />} />
        <Route path="ebook/:id" element={<EbookReader />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
