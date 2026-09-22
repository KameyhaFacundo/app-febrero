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
]

const marqueePhrases = [
  '21 de Septiembre',
  'Flores amarillas',
  'Primavera',
  'Nuestra historia',
  'Te quiero',
]

/* ───── Hooks ───── */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

function useTilt(max = 10) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return
    let raf
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(-py * max).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${(px * max).toFixed(2)}deg`)
        el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`)
      })
    }
    const onLeave = () => {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [max])
  return ref
}

/* ───── Scroll Progress ───── */

function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    let raf
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const bar = barRef.current
        if (!bar) return
        const h = document.documentElement.scrollHeight - window.innerHeight
        const p = h > 0 ? Math.min(1, window.scrollY / h) : 0
        bar.style.transform = `scaleX(${p})`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-bar" ref={barRef} />
    </div>
  )
}

/* ───── Aurora Background ───── */

function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora-blob b1" />
      <span className="aurora-blob b2" />
      <span className="aurora-blob b3" />
    </div>
  )
}

/* ───── Starfield ───── */

const starData = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2.4,
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

/* ───── Floating Petals ───── */

const flowerGlyphs = ['\u2740', '\u273F', '\u2741', '\u273E', '\u273D']

const petalData = Array.from({ length: 34 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 14,
  duration: 9 + Math.random() * 10,
  size: 10 + Math.random() * 22,
  opacity: 0.08 + Math.random() * 0.24,
  glyph: flowerGlyphs[i % flowerGlyphs.length],
  sway: (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 35),
}))

function FloatingPetals() {
  return (
    <div className="floating-petals" aria-hidden="true">
      {petalData.map(p => (
        <span
          key={p.id}
          className="fpetal"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            '--sway': `${p.sway}px`,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  )
}

/* ───── Flower Field (footer) ───── */

const fieldFlowerData = Array.from({ length: 13 }, (_, i) => ({
  id: i,
  scale: 0.8 + Math.random() * 1.1,
  delay: Math.random() * 2.4,
  glyph: flowerGlyphs[i % flowerGlyphs.length],
}))

function FlowerField() {
  return (
    <div className="flower-field" aria-hidden="true">
      {fieldFlowerData.map(f => (
        <span
          key={f.id}
          className="field-flower"
          style={{ '--s': f.scale, animationDelay: `${f.delay}s` }}
        >
          {f.glyph}
        </span>
      ))}
    </div>
  )
}

/* ───── Dedication ───── */

function Dedication() {
  const ref = useRef(null)
  const [bloom, setBloom] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setBloom(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section dedication-section" ref={ref}>
      <div className={`dedication-bloom intro-flower-wrap ${bloom ? 'show' : ''}`}>
        <Flower outer={10} inner={7} className="dedication-flower" />
      </div>
      <p className="dedication-title">Para la flor más linda del mundo</p>
      <p className="dedication-text">Esta flor es para vos {'\uD83C\uDF3C'}</p>
    </section>
  )
}

/* ───── Sunflower Bouquet ───── */

function Sunflower({ className = '', petals = 18 }) {
  return (
    <div className={`sunflower ${className}`}>
      <div className="sunflower-petals">
        {Array.from({ length: petals }, (_, i) => (
          <span
            key={i}
            className="sunflower-petal"
            style={{ '--i': i, '--step': `${360 / petals}deg` }}
          />
        ))}
      </div>
      <div className="sunflower-center" />
    </div>
  )
}

function SunflowerBouquet() {
  const ref = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShow(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`bouquet ${show ? 'show' : ''}`} aria-hidden="true">
      <div className="bouquet-stems">
        {[0, 1, 2, 3, 4].map(i => (
          <span key={i} className="stem" style={{ '--i': i }} />
        ))}
      </div>
      <span className="bouquet-leaf leaf-left" />
      <span className="bouquet-leaf leaf-right" />
      <Sunflower className="sf sf-3" petals={16} />
      <Sunflower className="sf sf-4" petals={16} />
      <Sunflower className="sf sf-1" petals={18} />
      <Sunflower className="sf sf-2" petals={18} />
      <Sunflower className="sf sf-main" petals={20} />
      <span className="bouquet-ribbon" />
    </div>
  )
}

/* ───── Cursor Petal Trail ───── */

function PetalCursor() {
  const hostRef = useRef(null)
  const lastRef = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return
    const onMove = (e) => {
      const now = performance.now()
      if (now - lastRef.current < 80) return
      lastRef.current = now
      const host = hostRef.current
      if (!host) return
      const el = document.createElement('span')
      el.className = 'cursor-petal'
      el.textContent = Math.random() > 0.5 ? '\u2740' : '\u273F'
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
      el.style.fontSize = `${8 + Math.random() * 12}px`
      el.style.setProperty('--dx', `${(Math.random() - 0.5) * 60}px`)
      el.style.setProperty('--rot', `${(Math.random() - 0.5) * 220}deg`)
      host.appendChild(el)
      window.setTimeout(() => el.remove(), 1200)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return <div ref={hostRef} className="cursor-petals" aria-hidden="true" />
}

/* ───── Fog Divider ───── */

function Fog() {
  return (
    <div className="fog-divider" aria-hidden="true">
      <div className="divider-garland">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <span key={i} className="divider-flower" style={{ '--i': i }}>
            {flowerGlyphs[i % flowerGlyphs.length]}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ───── FadeIn ───── */

function FadeIn({ children, className = '', delay = 0, variant = 'up' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`fade-in fade-${variant} ${visible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

/* ───── Split Text (word reveal) ───── */

function SplitText({ text, className = '', delay = 0, stagger = 0.055 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const words = text.split(' ')

  return (
    <span ref={ref} className={`split-text ${visible ? 'visible' : ''} ${className}`}>
      {words.map((w, i) => (
        <span className="split-word" key={i} style={{ transitionDelay: `${delay + i * stagger}s` }}>
          <span className="split-word-inner">
            {w}{i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </span>
  )
}

/* ───── Sparkle Burst ───── */

const sparkleData = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  angle: i * (360 / 14),
  dist: 45 + Math.random() * 40,
  delay: Math.random() * 0.15,
  size: 4 + Math.random() * 4,
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
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ───── Intro (Cinematic) ───── */

const moteData = Array.from({ length: 34 }, (_, i) => ({
  id: i,
  angle: (i / 34) * 360 + Math.random() * 10,
  dist: 120 + Math.random() * 260,
  delay: Math.random() * 0.6,
  size: 2 + Math.random() * 3.5,
}))

const grassData = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  h: 26 + Math.random() * 46,
  d: Math.random() * 2,
}))

function Flower({ outer = 8, inner = 0, className = '', style }) {
  const step = `${360 / outer}deg`
  const innerStep = `${360 / inner}deg`
  const innerOffset = `${180 / inner}deg`

  return (
    <div className={`intro-flower ${className}`} style={style}>
      <div className="flower-petals outer" style={{ '--step': step, '--offset': '0deg' }}>
        {Array.from({ length: outer }, (_, i) => (
          <span key={i} className="flower-petal" style={{ '--i': i }} />
        ))}
      </div>
      {inner > 0 && (
        <div className="flower-petals inner" style={{ '--step': innerStep, '--offset': innerOffset }}>
          {Array.from({ length: inner }, (_, i) => (
            <span key={i} className="flower-petal" style={{ '--i': i }} />
          ))}
        </div>
      )}
      <div className="flower-center">
        <span className="flower-pollen" />
      </div>
    </div>
  )
}

function IntroScreen({ onEnter }) {
  const [phase, setPhase] = useState(0)
  const isReady = phase >= 4

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 350),
      setTimeout(() => setPhase(2), 1700),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 4400),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleIntroKeyDown = (e) => {
    if (!isReady) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onEnter()
    }
  }

  return (
    <div
      className={`intro ${isReady ? 'ready' : ''}`}
      role="button"
      tabIndex={isReady ? 0 : -1}
      aria-disabled={!isReady}
      aria-label={isReady ? 'Abrir sorpresa de primavera' : 'Animacion de introduccion en progreso'}
      onClick={isReady ? onEnter : undefined}
      onKeyDown={handleIntroKeyDown}
    >
      <Aurora />
      <Starfield />
      <FloatingPetals />
      <div className="intro-glow" />
      <div className="intro-sweep" />

      <div className={`intro-motes ${phase >= 1 ? 'show' : ''}`} aria-hidden="true">
        {moteData.map(m => (
          <span
            key={m.id}
            className="mote"
            style={{
              '--angle': `${m.angle}deg`,
              '--dist': `${m.dist}px`,
              '--size': `${m.size}px`,
              animationDelay: `${m.delay}s`,
            }}
          />
        ))}
      </div>

      <p className={`intro-whisper ${phase >= 1 ? 'show' : ''}`}>
        Tengo algo para vos...
      </p>

      <div className={`intro-flower-wrap ${phase >= 2 ? 'show' : ''}`}>
        <div className="intro-garden">
          <Flower outer={4} className="flower-mini gf3" style={{ animationDelay: '0.9s' }} />
          <Flower outer={4} className="flower-mini gf4" style={{ animationDelay: '1.2s' }} />
          <Flower outer={5} className="flower-mini gf1" style={{ animationDelay: '0.4s' }} />
          <Flower outer={5} className="flower-mini gf2" style={{ animationDelay: '0.7s' }} />
          <Flower outer={9} inner={6} className="flower-main" />
        </div>
        <div className="intro-grass" aria-hidden="true">
          {grassData.map(g => (
            <span key={g.id} className="grass-blade" style={{ '--h': `${g.h}px`, '--d': `${g.d}s` }} />
          ))}
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
  const tiltRef = useTilt(11)

  const handleClick = () => {
    setRevealed(prev => {
      const next = !prev;
      setTimeout(() => onReveal(index, next), 0);
      if (next) {
        setSparkle(true);
        setTimeout(() => setSparkle(false), 750);
      }
      return next;
    });
  }

  return (
    <FadeIn delay={index * 0.07} variant="scale" className="reveal-card-wrapper">
      <button
        ref={tiltRef}
        type="button"
        className={`reveal-card ${revealed ? 'revealed' : ''}`}
        onClick={handleClick}
        aria-label={`Tarjeta ${index + 1} ${revealed ? 'revelada' : 'oculta'}`}
        aria-pressed={revealed}
      >
        <span className="reveal-front">
          <span className="reveal-spot" />
          <span className="reveal-number">{index + 1}</span>
          <span className="reveal-icon">{'\u273F'}</span>
          <span className="reveal-hint">Toca</span>
          <span className="reveal-shimmer" />
        </span>
        <span className="reveal-back">
          <span className="polaroid">
            <img src={src} alt={`Recuerdo ${index + 1}`} loading="lazy" />
          </span>
        </span>
        <SparkleBurst active={sparkle} />
      </button>
    </FadeIn>
  )
}

/* ───── Secret Message ───── */

function SecretMessage({ unlocked }) {
  return (
    <div className={`secret-message ${unlocked ? 'unlocked' : ''}`}>
      <div className="secret-glow" />
      <div className="secret-content">
        <p className="secret-label">{'\uD83C\uDF3C'} Mensaje secreto desbloqueado {'\uD83C\uDF3C'}</p>
        <p className="secret-text">
          Cada foto es un pedacito de nuestra historia. Gracias por hacerme
          tan feliz. Te amo infinitamente.
        </p>
        <div className="secret-flower">{'\u273F'}</div>
      </div>
    </div>
  )
}

/* ───── Celebration ───── */

function CelebrationBurst() {
  const [petals] = useState(() =>
    Array.from({ length: 44 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 3 + Math.random() * 2.5,
      size: 10 + Math.random() * 18,
      char: Math.random() > 0.5 ? '\u2740' : '\u273F',
      drift: (Math.random() - 0.5) * 120,
    }))
  )
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 7000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div className="celebration" aria-hidden="true">
      {petals.map(p => (
        <span
          key={p.id}
          className="celebration-petal"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  )
}

/* ───── Marquee ───── */

function Marquee() {
  const items = [...marqueePhrases, ...marqueePhrases]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((t, i) => (
          <span className="marquee-item" key={i}>
            <span className="marquee-flower">{'\u273F'}</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ───── Carousel ───── */

function Carousel({ photos, onPhotoClick }) {
  const trackRef = useRef(null)
  const drag = useRef({ active: false, startX: 0, scroll: 0, moved: false })

  const onPointerDown = (e) => {
    if (e.pointerType === 'touch') return
    const t = trackRef.current
    drag.current = { active: true, startX: e.clientX, scroll: t.scrollLeft, moved: false }
    t.classList.add('dragging')
  }
  const onPointerMove = (e) => {
    if (!drag.current.active) return
    const t = trackRef.current
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 5) drag.current.moved = true
    t.scrollLeft = drag.current.scroll - dx
  }
  const endDrag = () => {
    drag.current.active = false
    trackRef.current?.classList.remove('dragging')
  }

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {photos.map((src, i) => (
          <button
            key={i}
            type="button"
            className="carousel-slide"
            onClick={() => { if (!drag.current.moved) onPhotoClick(src) }}
            aria-label={`Abrir foto del carrusel ${i + 1}`}
          >
            <img src={src} alt={`Momento ${i + 1}`} loading="lazy" />
            <span className="carousel-shine" />
          </button>
        ))}
      </div>
      <div className="carousel-fade-left" />
      <div className="carousel-fade-right" />
    </div>
  )
}

/* ───── Gallery ───── */

function GalleryTile({ src, index, className, onPhotoClick }) {
  const tiltRef = useTilt(9)

  return (
    <FadeIn delay={(index % 6) * 0.06} variant="scale" className={`gallery-cell ${className}`}>
      <button
        ref={tiltRef}
        type="button"
        className="gallery-item"
        onClick={() => onPhotoClick(src)}
        aria-label={`Abrir foto de la galeria ${index + 1}`}
      >
        <span className="gallery-frame">
          <span className="gallery-spot" aria-hidden="true" />
          <img src={src} alt={`Foto ${index + 1}`} loading="lazy" />
          <span className="gallery-overlay" aria-hidden="true">
            <span className="gallery-icon">{'\u273F'}</span>
          </span>
        </span>
      </button>
    </FadeIn>
  )
}

function Gallery({ photos, onPhotoClick }) {
  const sizes = ['', 'tall', '', 'wide', '', '', 'tall', '', 'wide', '', '', '', 'tall', '']
  const shapes = ['arch', 'blob', 'petal', 'arch', 'squircle', 'blob', 'arch', 'petal', 'blob', 'arch', 'squircle', 'petal', 'arch', 'blob']

  return (
    <div className="gallery-grid">
      {photos.map((src, i) => (
        <GalleryTile
          key={i}
          src={src}
          index={i}
          onPhotoClick={onPhotoClick}
          className={`${sizes[i % sizes.length]} shape-${shapes[i % shapes.length]}`}
        />
      ))}
    </div>
  )
}

/* ───── Back To Top ───── */

function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let raf
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setShow(window.scrollY > 700))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <button
      type="button"
      className={`back-to-top ${show ? 'show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
    >
      {'\u273F'}
    </button>
  )
}

/* ───── Lightbox ───── */

function Lightbox({ src, onClose, allPhotos }) {
  const [offset, setOffset] = useState(0)
  const startX = useRef(0)
  const dialogRef = useRef(null)
  const lastActiveElementRef = useRef(null)

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

  const getFocusableElements = useCallback(() => {
    const root = dialogRef.current
    if (!root) return []

    return Array.from(
      root.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled'))
  }, [])

  useEffect(() => {
    lastActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'ArrowLeft') navigate(-1)
      if (e.key === 'Tab') {
        const focusables = getFocusableElements()
        if (focusables.length === 0) {
          e.preventDefault()
          dialogRef.current?.focus()
          return
        }

        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement

        if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    const focusables = getFocusableElements()
    if (focusables.length > 0) {
      focusables[0].focus()
    } else {
      dialogRef.current?.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      if (lastActiveElementRef.current?.focus) {
        lastActiveElementRef.current.focus()
      }
    }
  }, [getFocusableElements, navigate, onClose])

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1)
  }

  const currentIdx = allPhotos.indexOf(current)

  return (
    <div
      ref={dialogRef}
      className="lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de fotos"
      tabIndex={-1}
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Cerrar visor de fotos"
      >
        &times;
      </button>
      {currentIdx > 0 && (
        <button
          type="button"
          className="lb-arrow lb-prev"
          aria-label="Foto anterior"
          onClick={(e) => { e.stopPropagation(); navigate(-1) }}
        >
          {'\u2039'}
        </button>
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
        <button
          type="button"
          className="lb-arrow lb-next"
          aria-label="Foto siguiente"
          onClick={(e) => { e.stopPropagation(); navigate(1) }}
        >
          {'\u203A'}
        </button>
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
  const reducedMotion = useReducedMotion()

  const heroInnerRef = useRef(null)

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

  useEffect(() => {
    if (!showContent || reducedMotion) return
    let raf
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = heroInnerRef.current
        if (!el) return
        const y = window.scrollY
        el.style.transform = `translate3d(0, ${y * 0.28}px, 0)`
        el.style.opacity = `${Math.max(0, 1 - y / 620)}`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [showContent, reducedMotion])

  if (!entered) {
    return <IntroScreen onEnter={handleEnter} />
  }

  return (
    <div className={`app ${showContent ? 'show' : ''}`}>
      <ScrollProgress />
      <Aurora />
      <Starfield />
      <FloatingPetals />
      <PetalCursor />

      {/* Hero */}
      <header className="hero" id="inicio">
        <div className="hero-inner" ref={heroInnerRef}>
          <FadeIn>
            <p className="hero-badge">{'\uD83C\uDF3B'} 21 de Septiembre</p>
            <h1 className="hero-title">
              <span className="hero-title-line">Flores Amarillas</span>
              <span className="hero-title-line accent">para Vos</span>
            </h1>
            <SunflowerBouquet />
          </FadeIn>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line" />
        </div>
      </header>

      <Dedication />

      <Fog />

      <Marquee />

      {/* Reveal */}
      <section className="section reveal-section" id="recuerdos">
        <FadeIn>
          <h2 className="section-title"><SplitText text="Descubrí nuestros recuerdos" /></h2>
          <p className="section-desc">Toca cada tarjeta para revelar la foto</p>
        </FadeIn>
        <div className="reveal-grid">
          {revealPhotos.map((src, i) => (
            <RevealCard key={i} src={src} index={i} onReveal={handleReveal} />
          ))}
        </div>
        <SecretMessage unlocked={allRevealed} />
        {allRevealed && (
          <div className="scratch-wrap">
            <ScratchCard width={440} height={370}>
              <div className="secret-letter-card secret-letter-glow animate-in">
                <div className="secret-letter-header">
                  <span className="secret-letter-svg">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="12" width="36" height="24" rx="6" fill="#fff" stroke="#222" strokeWidth="2"/>
                      <path d="M6 12L24 30L42 12" stroke="#222" strokeWidth="2"/>
                      <path d="M24 30L12 18" stroke="#222" strokeWidth="2"/>
                      <path d="M24 30L36 18" stroke="#222" strokeWidth="2"/>
                      <path d="M24 17C24 13 30 13 30 17C30 21 24 25 24 25C24 25 18 21 18 17C18 13 24 13 24 17Z" fill="#f2a900" stroke="#222" strokeWidth="1.5"/>
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

      {/* Carousel */}
      <section className="section carousel-section" id="momentos">
        <FadeIn>
          <h2 className="section-title"><SplitText text="Momentos juntos" /></h2>
          <p className="section-desc">Deslizá para ver más {'\u2192'}</p>
        </FadeIn>
        <Carousel photos={carouselPhotos} onPhotoClick={setLightboxSrc} />
      </section>

      <Fog />

      {/* Gallery */}
      <section className="section gallery-section" id="galeria">
        <FadeIn>
          <h2 className="section-title"><SplitText text="Todos nuestros momentos" /></h2>
        </FadeIn>
        <Gallery photos={galleryPhotos} onPhotoClick={setLightboxSrc} />
      </section>

      {/* Footer */}
      <footer className="footer">
        <FlowerField />
        <FadeIn>
          <div className="footer-flower">{'\u273F'}</div>
          <p className="footer-text">Te quiero hoy y siempre</p>
        </FadeIn>
      </footer>

      {allRevealed && <CelebrationBurst />}
      <BackToTop />

      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} allPhotos={allPhotos} />
      )}
    </div>
  )
}

export default App
