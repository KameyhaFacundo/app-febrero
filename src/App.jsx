import ScratchCard from './ScratchCard';
import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import './ScratchCard.pro.css'

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

/* ───── Starfield ───── */

const starData = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  delay: Math.random() * 5,
  duration: 2 + Math.random() * 4,
}))

function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      {starData.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ───── Floating Hearts ───── */

const heartData = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 10,
  duration: 8 + Math.random() * 8,
  size: 10 + Math.random() * 16,
  opacity: 0.1 + Math.random() * 0.25,
  filled: i % 3 === 0,
}))

function FloatingHearts() {
  return (
    <div className="floating-hearts" aria-hidden="true">
      {heartData.map(h => (
        <span
          key={h.id}
          className="fheart"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: `${h.size}px`,
            opacity: h.opacity,
          }}
        >
          {h.filled ? '\u2764' : '\u2661'}
        </span>
      ))}
    </div>
  )
}

/* ───── Fog Divider ───── */

function Fog() {
  return <div className="fog-divider" aria-hidden="true" />
}

/* ───── FadeIn ───── */

function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
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

/* ───── Typewriter ───── */

function Typewriter({ text, speed = 50, delay = 0 }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let i = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) clearInterval(interval)
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [started, text, speed, delay])

  return (
    <span ref={ref} className="typewriter">
      {displayed}
      <span className="typewriter-cursor">|</span>
    </span>
  )
}

/* ───── Sparkle Burst ───── */

const sparkleData = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  angle: i * 30,
  dist: 40 + Math.random() * 30,
  delay: Math.random() * 0.15,
}))

function SparkleBurst({ active }) {
  if (!active) return null
  return (
    <div className="sparkle-burst" aria-hidden="true">
      {sparkleData.map(s => (
        <div
          key={s.id}
          className="sparkle"
          style={{
            '--angle': `${s.angle}deg`,
            '--dist': `${s.dist}px`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ───── Day Counter ───── */

function DayCounter() {
  const startDate1 = new Date('2024-03-04')
  const now = new Date()
  const days1 = Math.floor((now - startDate1) / (1000 * 60 * 60 * 24))

  return (
    <FadeIn className="day-counter">
      <div className="counter-glow" />
      <div className="counter-content">
        <p className="counter-label">hace</p>
        <div className="counter-number">{days1}</div>
        <p className="counter-unit">días</p>
        <p className="counter-sub">y cada uno mejor que el anterior</p>
        <p className="counter-special">2do San Valentín juntos</p>
        <div className="counter-historic">
          <span style={{fontSize: '0.95em', opacity: 0.7}}>
            hace <b>{days1}</b> días (desde el 4/3/2024)
          </span>
        </div>
      </div>
    </FadeIn>
  )
}

/* ───── Intro (Dramatic) ───── */

function IntroScreen({ onEnter }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 4000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="intro" onClick={phase >= 3 ? onEnter : undefined}>
      <Starfield />
      <div className="intro-glow" />

      <p className={`intro-whisper ${phase >= 1 ? 'show' : ''}`}>
        Tengo algo para vos...
      </p>

      <div className={`intro-envelope-wrap ${phase >= 2 ? 'show' : ''}`}>
        <div className="intro-envelope">
          <div className="envelope-flap" />
          <div className="envelope-body">
            <div className="envelope-heart">{'\u2764'}</div>
          </div>
        </div>
      </div>

      <p className={`intro-text ${phase >= 3 ? 'show' : ''}`}>
        Toca para abrir
      </p>

      <div className={`intro-ring ${phase >= 3 ? 'show' : ''}`} />
      <div className={`intro-ring ring2 ${phase >= 3 ? 'show' : ''}`} />
    </div>
  )
}

/* ───── Reveal Cards ───── */

function RevealCard({ src, index, onReveal }) {

  const [revealed, setRevealed] = useState(false)
  const [sparkle, setSparkle] = useState(false)

  const handleClick = () => {
    setRevealed(prev => {
      const next = !prev;
      setTimeout(() => onReveal(index, next), 0);
      if (next) {
        setSparkle(true);
        setTimeout(() => setSparkle(false), 700);
      }
      return next;
    });
  }

  return (
    <FadeIn delay={index * 0.08} className="reveal-card-wrapper">
      <div
        className={`reveal-card ${revealed ? 'revealed' : ''}`}
        onClick={handleClick}
      >
        <div className="reveal-front">
          <div className="reveal-number">{index + 1}</div>
          <div className="reveal-icon">{'\u2764'}</div>
          <p className="reveal-hint">Toca</p>
          <div className="reveal-shimmer" />
        </div>
        <div className="reveal-back">
          <div className="polaroid">
            <img src={src} alt={`Recuerdo ${index + 1}`} loading="lazy" />
          </div>
        </div>
        <SparkleBurst active={sparkle} />
      </div>
    </FadeIn>
  )
}

/* ───── Secret Message ───── */

function SecretMessage({ unlocked }) {
  return (
    <div className={`secret-message ${unlocked ? 'unlocked' : ''}`}>
      <div className="secret-glow" />
      <div className="secret-content">
        <p className="secret-label">{'\u2728'} Mensaje secreto desbloqueado {'\u2728'}</p>
        <p className="secret-text">
          Cada foto es un pedacito de nuestra historia. Gracias por hacerme
          tan feliz. Te amo infinitamente.
        </p>
        <div className="secret-heart">{'\u2764'}</div>
      </div>
    </div>
  )
}

/* ───── Carousel ───── */

function Carousel({ photos, onPhotoClick }) {
  const trackRef = useRef(null)

  return (
    <div className="carousel">
      <div className="carousel-track" ref={trackRef}>
        {photos.map((src, i) => (
          <div key={i} className="carousel-slide" onClick={() => onPhotoClick(src)}>
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
      <video className="video-player" src={videoSrc} controls playsInline preload="metadata" />
    </FadeIn>
  )
}

/* ───── Lightbox ───── */

function Lightbox({ src, onClose, allPhotos }) {
  const [offset, setOffset] = useState(0)
  const startX = useRef(0)

  const baseIdx = allPhotos.indexOf(src)
  const idx = baseIdx === -1 ? 0 : baseIdx + offset
  const current = allPhotos[Math.max(0, Math.min(idx, allPhotos.length - 1))]

  const navigate = useCallback((dir) => {
    setOffset(prev => {
      const newIdx = baseIdx + prev + dir
      if (newIdx < 0 || newIdx >= allPhotos.length) return prev
      return prev + dir
    })
  }, [baseIdx, allPhotos.length])

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
  }, [navigate, onClose])

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1)
  }

  const currentIdx = allPhotos.indexOf(current)

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>&times;</button>
      {currentIdx > 0 && (
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
      {currentIdx < allPhotos.length - 1 && (
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
    const [revealedCards, setRevealedCards] = useState(new Set())

  const allPhotos = [...revealPhotos, ...carouselPhotos, ...galleryPhotos]
  const allRevealed = revealedCards.size === revealPhotos.length

  const handleEnter = useCallback(() => {
    setEntered(true)
    setTimeout(() => setShowContent(true), 600)
  }, [])

    const handleReveal = useCallback((index, revealed) => {
      setRevealedCards(prev => {
        const next = new Set(prev)
        if (revealed) {
          next.add(index)
        } else {
          next.delete(index)
        }
        return next
      })
    }, [])

  if (!entered) {
    return <IntroScreen onEnter={handleEnter} />
  }

  return (
    <div className={`app ${showContent ? 'show' : ''}`}>
      <Starfield />
      <FloatingHearts />

      {/* Hero */}
      <header className="hero">
        <FadeIn>
          <p className="hero-date">14 de Febrero</p>
          <h1 className="hero-title">Feliz San Valentín</h1>
          <div className="hero-heart">{'\u2764'}</div>
          <p className="hero-subtitle">
            <Typewriter text="Cada momento a tu lado es un regalo que guardo en el corazón..." speed={45} delay={800} />
          </p>
        </FadeIn>
        <div className="scroll-indicator">
          <div className="scroll-line" />
        </div>
      </header>

      <Fog />

      {/* Day counter */}
      <section className="section counter-section">
        <DayCounter />
      </section>

      <Fog />

      {/* Reveal */}
      <section className="section reveal-section">
        <FadeIn>
          <h2 className="section-title">Descubrí nuestros recuerdos</h2>
          <p className="section-desc">Toca cada tarjeta para revelar la foto</p>
        </FadeIn>
        <div className="reveal-grid">
          {revealPhotos.map((src, i) => (
            <RevealCard key={i} src={src} index={i} onReveal={handleReveal} />
          ))}
        </div>
          <SecretMessage unlocked={allRevealed} />
          {allRevealed && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
              <ScratchCard width={440} height={370}>
                <div className="secret-letter-card secret-letter-glow animate-in">
                  <div className="secret-letter-header">
                    <span className="secret-letter-svg">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="12" width="36" height="24" rx="6" fill="#fff" stroke="#222" strokeWidth="2"/>
                        <path d="M6 12L24 30L42 12" stroke="#222" strokeWidth="2"/>
                        <path d="M24 30L12 18" stroke="#222" strokeWidth="2"/>
                        <path d="M24 30L36 18" stroke="#222" strokeWidth="2"/>
                        <path d="M24 17C24 13 30 13 30 17C30 21 24 25 24 25C24 25 18 21 18 17C18 13 24 13 24 17Z" fill="#ff3366" stroke="#222" strokeWidth="1.5"/>
                      </svg>
                    </span>
                    <span className="secret-letter-title">Primer día</span>
                  </div>
                  <div className="secret-letter-img-wrap">
                    <img src="/primer dia.jpg" alt="Primer día juntos" className="secret-letter-img round" />
                  </div>
                  <div className="secret-letter-body">
                    <p>
                      <span className="secret-letter-highlight">Ese día comenzó nuestra historia</span>,<br/>
                      y desde entonces cada momento a tu lado es único.<br/>
                      <span className="secret-letter-highlight2">
                        Gracias por elegirme para ser tu compañero de aventuras.
                      </span>
                    </p>
                  </div>
                  <div className="secret-letter-footer">Te amo desde el primer día <span style={{fontSize:'1.2em'}}>💛</span></div>
                </div>
              </ScratchCard>
            </div>
          )}
      </section>

      <Fog />

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

      <Fog />

      {/* Carousel */}
      <section className="section carousel-section">
        <FadeIn>
          <h2 className="section-title">Momentos juntos</h2>
          <p className="section-desc">Deslizá para ver más {'\u2192'}</p>
        </FadeIn>
        <Carousel photos={carouselPhotos} onPhotoClick={setLightboxSrc} />
      </section>

      <Fog />

      {/* Video */}
      <section className="section video-section">
        <FadeIn>
          <h2 className="section-title">Nuestro video</h2>
        </FadeIn>
        <VideoSection />
      </section>

      <Fog />

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
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} allPhotos={allPhotos} />
      )}
    </div>
  )
}

export default App
