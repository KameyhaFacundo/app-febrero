import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

const revealPhotos = [
  '/IMG-20240303-WA0008.jpg',
  '/IMG-20240621-WA0001.jpg',
  '/IMG-20240721-WA0018.jpg',
  '/20240801_150328.jpg',
  '/IMG-20241104-WA0000.jpg',
  '/IMG_20241215_115943.jpg',
  '/IMG-20241215-WA0111.jpg',
  '/IMG-20241225-WA0010.jpg',
]

const carouselPhotos = [
  '/IMG_20241222_002042.jpg',
  '/IMG_20250112_172223.jpg',
  '/IMG_20250112_173223.jpg',
  '/IMG_20250112_182457.jpg',
  '/IMG-20250119-WA0067.jpg',
  '/IMG-20250214-WA0012.jpg',
  '/WhatsApp Image 2026-02-11 at 09.18.47.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.18.47 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.18.48.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.18.48 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.18.48 (2).jpeg',
]

const galleryPhotos = [
  '/WhatsApp Image 2026-02-11 at 09.18.49.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.18.49 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.18.56.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.18.57.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.18.58.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.18.59.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.18.59 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.00.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.00 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.01.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.01 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.02.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.02 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.03.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.03 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.04.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.04 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.05.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.05 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.05 (2).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.06.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.07.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.07 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.08.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.09.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.09 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.10.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.10 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.11.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.11 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.11 (2).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.12.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.12 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.13.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.13 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.14.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.15.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.15 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.16.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.16 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.17.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.17 (1).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.17 (2).jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.18.jpeg',
  '/WhatsApp Image 2026-02-11 at 09.19.18 (1).jpeg',
]

const videoSrc = '/WhatsApp Video 2026-02-11 at 09.18.55.mp4'

/* ───── Helpers ───── */

function FloatingHearts() {
  return (
    <div className="floating-hearts" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="fheart"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${7 + Math.random() * 8}s`,
            fontSize: `${10 + Math.random() * 18}px`,
            opacity: 0.15 + Math.random() * 0.35,
          }}
        >
          {i % 3 === 0 ? '\u2764' : '\u2661'}
        </span>
      ))}
    </div>
  )
}

function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`fade-in ${visible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

/* ───── Intro ───── */

function IntroScreen({ onEnter }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`intro ${ready ? 'ready' : ''}`} onClick={onEnter}>
      <div className="intro-glow" />
      <div className="intro-envelope">
        <div className="envelope-flap" />
        <div className="envelope-body">
          <div className="envelope-heart">{'\u2764'}</div>
        </div>
      </div>
      <p className="intro-text">Toca para abrir</p>
      <div className="intro-ring" />
      <div className="intro-ring ring2" />
    </div>
  )
}

/* ───── Reveal Cards ───── */

function RevealCard({ src, index }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <FadeIn delay={index * 0.08} className="reveal-card-wrapper">
      <div
        className={`reveal-card ${revealed ? 'revealed' : ''}`}
        onClick={() => setRevealed(true)}
      >
        <div className="reveal-front">
          <div className="reveal-number">{index + 1}</div>
          <div className="reveal-icon">{'\u2764'}</div>
          <p className="reveal-hint">Toca</p>
        </div>
        <div className="reveal-back">
          <div className="polaroid">
            <img src={src} alt={`Recuerdo ${index + 1}`} loading="lazy" />
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

/* ───── Horizontal Carousel ───── */

function Carousel({ photos, onPhotoClick }) {
  const trackRef = useRef(null)

  return (
    <div className="carousel">
      <div className="carousel-track" ref={trackRef}>
        {photos.map((src, i) => (
          <div
            key={i}
            className="carousel-slide"
            onClick={() => onPhotoClick(src)}
          >
            <img src={src} alt={`Momento ${i + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
      <div className="carousel-fade-left" />
      <div className="carousel-fade-right" />
    </div>
  )
}

/* ───── Gallery ───── */

function Gallery({ photos, onPhotoClick }) {
  const sizes = ['', 'tall', '', 'wide', '', '', 'tall', '', 'wide', '', '', '', 'tall', '']

  return (
    <div className="gallery-grid">
      {photos.map((src, i) => (
        <FadeIn key={i} delay={(i % 6) * 0.07} className={`gallery-cell ${sizes[i % sizes.length]}`}>
          <div className="gallery-item" onClick={() => onPhotoClick(src)}>
            <img src={src} alt={`Foto ${i + 1}`} loading="lazy" />
            <div className="gallery-overlay">
              <span>{'\u2764'}</span>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  )
}

/* ───── Video ───── */

function VideoSection() {
  return (
    <FadeIn className="video-wrapper">
      <video
        className="video-player"
        src={videoSrc}
        controls
        playsInline
        preload="metadata"
        poster=""
      />
    </FadeIn>
  )
}

/* ───── Lightbox with swipe ───── */

function Lightbox({ src, onClose, allPhotos }) {
  const [current, setCurrent] = useState(src)
  const startX = useRef(0)

  useEffect(() => setCurrent(src), [src])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'ArrowLeft') navigate(-1)
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [current])

  const navigate = (dir) => {
    const idx = allPhotos.indexOf(current)
    if (idx === -1) return
    const next = idx + dir
    if (next >= 0 && next < allPhotos.length) setCurrent(allPhotos[next])
  }

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1)
  }

  const idx = allPhotos.indexOf(current)

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>&times;</button>
      {idx > 0 && (
        <button className="lb-arrow lb-prev" onClick={(e) => { e.stopPropagation(); navigate(-1) }}>{'\u2039'}</button>
      )}
      <img
        key={current}
        src={current}
        alt="Foto"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
      {idx < allPhotos.length - 1 && (
        <button className="lb-arrow lb-next" onClick={(e) => { e.stopPropagation(); navigate(1) }}>{'\u203A'}</button>
      )}
      <div className="lb-counter">{idx + 1} / {allPhotos.length}</div>
    </div>
  )
}

/* ───── App ───── */

function App() {
  const [entered, setEntered] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)

  const allPhotos = [...revealPhotos, ...carouselPhotos, ...galleryPhotos]

  const handleEnter = useCallback(() => {
    setEntered(true)
    setTimeout(() => setShowContent(true), 600)
  }, [])

  if (!entered) {
    return (
      <>
        <FloatingHearts />
        <IntroScreen onEnter={handleEnter} />
      </>
    )
  }

  return (
    <div className={`app ${showContent ? 'show' : ''}`}>
      <FloatingHearts />

      {/* Hero */}
      <header className="hero">
        <FadeIn>
          <p className="hero-date">14 de Febrero</p>
          <h1 className="hero-title">Feliz San Valentín</h1>
          <div className="hero-heart">{'\u2764'}</div>
          <p className="hero-subtitle">
            Cada momento a tu lado es un regalo que guardo en el corazón
          </p>
        </FadeIn>
        <div className="scroll-indicator">
          <div className="scroll-line" />
        </div>
      </header>

      {/* Reveal */}
      <section className="section reveal-section">
        <FadeIn>
          <h2 className="section-title">Descubrí nuestros recuerdos</h2>
          <p className="section-desc">Toca cada tarjeta para revelar la foto</p>
        </FadeIn>
        <div className="reveal-grid">
          {revealPhotos.map((src, i) => (
            <RevealCard key={i} src={src} index={i} />
          ))}
        </div>
      </section>

      {/* Love letter */}
      <section className="section message-section">
        <FadeIn>
          <div className="love-letter">
            <div className="letter-deco">{'\u2022'} {'\u2022'} {'\u2022'}</div>
            <p>
              No necesito un día especial para decirte lo que siento, pero hoy
              quiero que sepas que sos lo mejor que me pasó.
            </p>
            <div className="letter-heart">{'\u2764'}</div>
          </div>
        </FadeIn>
      </section>

      {/* Carousel */}
      <section className="section carousel-section">
        <FadeIn>
          <h2 className="section-title">Momentos juntos</h2>
          <p className="section-desc">Deslizá para ver más {'\u2192'}</p>
        </FadeIn>
        <Carousel photos={carouselPhotos} onPhotoClick={setLightboxSrc} />
      </section>

      {/* Video */}
      <section className="section video-section">
        <FadeIn>
          <h2 className="section-title">Nuestro video</h2>
        </FadeIn>
        <VideoSection />
      </section>

      {/* Gallery */}
      <section className="section gallery-section">
        <FadeIn>
          <h2 className="section-title">Todos nuestros momentos</h2>
        </FadeIn>
        <Gallery photos={galleryPhotos} onPhotoClick={setLightboxSrc} />
      </section>

      {/* Footer */}
      <footer className="footer">
        <FadeIn>
          <div className="footer-heart">{'\u2764'}</div>
          <p className="footer-text">Te quiero hoy y siempre</p>
        </FadeIn>
      </footer>

      {lightboxSrc && (
        <Lightbox
          src={lightboxSrc}
          onClose={() => setLightboxSrc(null)}
          allPhotos={allPhotos}
        />
      )}
    </div>
  )
}

export default App
