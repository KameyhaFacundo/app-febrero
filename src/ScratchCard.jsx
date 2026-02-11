import React, { useRef, useEffect, useState } from 'react';
import './ScratchCard.css';
import './ScratchCard.pro.css';

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
  const [scratched, setScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    // Fondo dorado
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, 0, width, height);
    // Efecto brillo
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(width/2, height/2, width/2.2, height/3, 0, 0, 2*Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
  }, [width, height]);

  function handleStart(e) {
    if (scratched) return;
    setIsDrawing(true);
    scratch(e);
  }
  function handleMove(e) {
    if (!isDrawing || scratched) return;
    scratch(e);
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
  function checkScratched() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, width, height);
    let clear = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] < 64) clear++;
    }
    const percent = clear / (width * height) * 100;
    if (percent > 55) {
      setScratched(true);
      if (onReveal) onReveal();
    }
  }

  return (
    <div className="scratch-card-container" style={{ width, height }}>
      <div className={`scratch-card-content ${scratched ? 'revealed' : ''}`}>{children}</div>
      {!scratched && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="scratch-card-canvas"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      )}
      {!scratched && <div className="scratch-card-label">Raspa aquí</div>}
    </div>
  );
}
