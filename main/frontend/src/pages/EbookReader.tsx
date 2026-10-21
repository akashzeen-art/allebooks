import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ebookProxyPath, getEbookById } from '@/data/ebooks'
import { FavoriteButton } from '@/components/FavoriteButton'
import { saveReadingState } from '@/utils/storage'

/**
 * Full-screen PDF reader (in-app only — no download / new-tab actions).
 */
export function EbookReader() {
  const { id } = useParams<{ id: string }>()
  const ebook = id ? getEbookById(id) : undefined

  const objectUrlRef = useRef<string | null>(null)
  const [pdfSrc, setPdfSrc] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    if (!ebook) return

    let cancelled = false

    async function openPdf() {
      setStatus('loading')
      setError(null)
      setPdfSrc(null)

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }

      try {
        const proxyUrl = ebookProxyPath(ebook!.fileUrl)
        const res = await fetch(proxyUrl, {
          headers: { Accept: 'application/pdf,application/octet-stream,*/*' },
        })
        if (!res.ok) {
          throw new Error(`Could not open PDF (${res.status})`)
        }

        const buffer = await res.arrayBuffer()
        if (cancelled) return

        // Force PDF MIME — CDN often sends application/octet-stream
        const blob = new Blob([buffer], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)

        if (cancelled) {
          URL.revokeObjectURL(url)
          return
        }

        objectUrlRef.current = url
        setPdfSrc(url)
        setStatus('ready')
      } catch (err: unknown) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to open PDF')
        setStatus('error')
      }
    }

    void openPdf()

    return () => {
      cancelled = true
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [ebook, retryKey])

  useEffect(() => {
    if (!ebook) return
    saveReadingState(ebook.id)
  }, [ebook])

  useEffect(() => {
    if (!ebook) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [ebook])

  if (!ebook) {
    return <Navigate to="/ebooks" replace />
  }

  // Hide Chrome/Edge PDF chrome (download, print, open) — keep scrolling
  const viewerSrc = pdfSrc
    ? `${pdfSrc}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`
    : null

  return (
    <div
      className="fixed inset-0 z-[100000] flex flex-col bg-[#141018]"
      data-testid="ebook-reader-page"
      onContextMenu={(e) => e.preventDefault()}
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#141018] px-3 py-2.5 sm:px-5">
        <Link
          to="/ebooks"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/5 hover:text-gold-200"
          aria-label="Back to ebooks"
          data-testid="ebook-reader-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-playfair text-base text-text-heading sm:text-lg">
            {ebook.title}
          </p>
          <p className="flex items-center gap-1.5 truncate text-xs text-text-muted">
            <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden />
            PDF ebook
          </p>
        </div>
        <FavoriteButton kind="ebook" id={ebook.id} title={ebook.title} />
      </header>

      <div className="relative min-h-0 flex-1 bg-[#2a2a2a]">
        {status === 'loading' ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#141018] text-gold-200/90">
            <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
            <p className="text-sm">Opening PDF…</p>
          </div>
        ) : null}

        {status === 'error' ? (
          <div className="flex h-full items-center justify-center p-6">
            <div
              className="max-w-md rounded-lg border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              <p className="font-medium">Could not open PDF</p>
              <p className="mt-1 opacity-90">{error}</p>
              <button
                type="button"
                className="mt-3 inline-flex items-center rounded-lg border border-gold-400/40 px-3 py-1.5 text-gold-300 transition-colors hover:bg-gold-400/10"
                onClick={() => setRetryKey((k) => k + 1)}
              >
                Try again
              </button>
            </div>
          </div>
        ) : null}

        {status === 'ready' && viewerSrc ? (
          <iframe
            key={viewerSrc}
            src={viewerSrc}
            title={`${ebook.title} PDF`}
            className="block h-full w-full border-0 bg-white"
            data-testid="ebook-pdf-viewer"
          />
        ) : null}
      </div>
    </div>
  )
}
