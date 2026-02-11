import React, { useRef, useEffect, useState } from 'react';
import './ScratchCard.css';
import './ScratchCard.pro.css';

const AUTO_REVEAL_THRESHOLD = 60;

function getPointerPos(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  } else {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
}

export default function ScratchCard({ width = 320, height = 180, onReveal, children }) {
  const canvasRef = useRef(null);
  const revealedRef = useRef(false);
  const checkTimerRef = useRef(null);
  const [scratched, setScratched] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const revealCard = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setIsCompleting(true);
    setProgress(100);
    setTimeout(() => {
      setScratched(true);
      setIsCompleting(false);
      if (onReveal) onReveal();
    }, 260);
  };

  const paintFoil = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f4cf59');
    gradient.addColorStop(0.4, '#ffe79c');
    gradient.addColorStop(0.7, '#d9ad2e');
    gradient.addColorStop(1, '#f6d978');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Soft diagonal shimmer.
    const sheen = ctx.createLinearGradient(0, height * 0.1, width, height * 0.9);
    sheen.addColorStop(0, 'rgba(255,255,255,0.0)');
    sheen.addColorStop(0.45, 'rgba(255,255,255,0.22)');
    sheen.addColorStop(0.5, 'rgba(255,255,255,0.38)');
    sheen.addColorStop(0.55, 'rgba(255,255,255,0.18)');
    sheen.addColorStop(1, 'rgba(255,255,255,0.0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, width, height);

    // Subtle metallic noise pattern.
    ctx.globalAlpha = 0.06;
    for (let i = 0; i < 1200; i += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 0.6 + Math.random() * 1.5;
      ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#7a5d11';
      ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    paintFoil(ctx);
    setProgress(0);
    setScratched(false);
    setIsDrawing(false);
    setIsCompleting(false);
    revealedRef.current = false;
    return () => clearTimeout(checkTimerRef.current);
  }, [width, height]);

  function handleStart(e) {
    if (scratched || isCompleting) return;
    setIsDrawing(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(8);
    }
    scratch(e);
    queueScratchCheck();
  }
  function handleMove(e) {
    if (!isDrawing || scratched || isCompleting) return;
    scratch(e);
    queueScratchCheck();
  }
  function handleEnd() {
    setIsDrawing(false);
    checkScratched();
  }
  function scratch(e) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    const pos = getPointerPos(e, canvas);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 18, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
  function queueScratchCheck() {
    if (checkTimerRef.current) return;
    checkTimerRef.current = setTimeout(() => {
      checkTimerRef.current = null;
      checkScratched();
    }, 110);
  }
  function checkScratched() {
    if (revealedRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, width, height);
    let clear = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] < 64) clear++;
    }
    const percent = clear / (width * height) * 100;
    setProgress(Math.min(100, percent));
    if (percent >= AUTO_REVEAL_THRESHOLD) {
      revealCard();
    }
  }

  return (
    <div className="scratch-card-shell" style={{ width }}>
      <div className="scratch-card-ui">
        <p className="scratch-card-title">Raspa para descubrir nuestra sorpresa</p>
        <div
          className="scratch-card-progress"
          role="progressbar"
          aria-label="Progreso de raspado"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div className="scratch-card-progress-bar" style={{ width: `${Math.round(progress)}%` }} />
        </div>
        <p className="scratch-card-percent">{Math.round(progress)}%</p>
      </div>

      <div className="scratch-card-container" style={{ width, height }}>
        <div className={`scratch-card-content ${scratched ? 'revealed' : ''}`}>{children}</div>
        {!scratched && (
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={`scratch-card-canvas ${isCompleting ? 'is-completing' : ''}`}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            aria-label="Area para raspar"
          />
        )}
        {!scratched && (
          <>
            <div className="scratch-card-label">Raspa aquí</div>
            <button type="button" className="scratch-reveal-btn" onClick={revealCard}>
              Revelar sin raspar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
