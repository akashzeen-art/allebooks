import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

const HOME_VIDEO =
  'https://vz-61955f99-a46.b-cdn.net/500b484d-a8e9-4e38-9351-a0e1cea7cc59/play_480p.mp4'
const HOME_POSTER = '/assets/hero-headphones.png'

/**
 * Hero-scoped video (not viewport-fixed) so later sections + footer stay visible.
 */
export function HomeVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true

    const tryPlay = () => {
      void video
        .play()
        .then(() => setReady(true))
        .catch(() => {
          window.setTimeout(() => {
            void video.play().then(() => setReady(true)).catch(() => {})
          }, 400)
        })
    }

    const onPlaying = () => setReady(true)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('canplay', tryPlay)
    tryPlay()

    return () => {
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('canplay', tryPlay)
    }
  }, [])

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
      data-testid="home-video-background"
    >
      <video
        ref={videoRef}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
          ready ? 'opacity-100' : 'opacity-0',
        )}
        poster={HOME_POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={HOME_VIDEO} type="video/mp4" />
      </video>

      {!ready ? (
        <img
          src={HOME_POSTER}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      <div className="absolute inset-0 bg-navy-950/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/45 via-transparent to-navy-950/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(212,168,75,0.1),transparent_55%)]" />
    </div>
  )
}
