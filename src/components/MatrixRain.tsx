import React, { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0);
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';

    let frame = 0;
    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "VT323", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const dx = x - mouseRef.current.x;
        const dy = y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Larger radius for better visibility
        const radius = 450;
        let opacity = 0;
        if (distance < radius) {
          opacity = Math.pow(1 - distance / radius, 1.5);
        }

        if (opacity > 0.01) {
          ctx.fillStyle = `rgba(0, 250, 154, ${opacity})`;
          ctx.fillText(text, x, y);
        }

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      frame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
