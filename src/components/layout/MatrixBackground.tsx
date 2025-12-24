import { useEffect, useRef } from 'react';

const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン₿Ξ◊∞≈≠∂∑∏√∫';

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  opacity: number;
}

export const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initColumns();
    };

    const initColumns = () => {
      const columns: Column[] = [];
      const columnWidth = 25;
      const numColumns = Math.ceil(canvas.width / columnWidth);

      for (let i = 0; i < numColumns; i++) {
        columns.push({
          x: i * columnWidth,
          y: Math.random() * canvas.height,
          speed: 0.5 + Math.random() * 2,
          chars: Array.from({ length: 20 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
          opacity: 0.1 + Math.random() * 0.4,
        });
      }
      columnsRef.current = columns;
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(48, 56, 65, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      columnsRef.current.forEach((col) => {
        col.chars.forEach((char, i) => {
          const y = col.y - i * 20;
          if (y > 0 && y < canvas.height) {
            const fade = 1 - i / col.chars.length;
            const isFirst = i === 0;
            
            if (isFirst) {
              ctx.fillStyle = `rgba(246, 201, 14, ${col.opacity * fade})`;
              ctx.shadowColor = 'rgba(246, 201, 14, 0.8)';
              ctx.shadowBlur = 10;
            } else {
              ctx.fillStyle = `rgba(246, 201, 14, ${col.opacity * fade * 0.5})`;
              ctx.shadowBlur = 0;
            }
            
            ctx.font = '14px "Source Code Pro", monospace';
            ctx.fillText(char, col.x, y);
          }
        });

        col.y += col.speed;
        if (col.y - col.chars.length * 20 > canvas.height) {
          col.y = 0;
          col.speed = 0.5 + Math.random() * 2;
          col.chars = Array.from({ length: 20 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]);
        }

        // Randomly change characters
        if (Math.random() < 0.02) {
          const randomIndex = Math.floor(Math.random() * col.chars.length);
          col.chars[randomIndex] = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      });

      ctx.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};
