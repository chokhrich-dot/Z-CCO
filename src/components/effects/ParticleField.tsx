import { motion } from 'framer-motion';
import { useEffect, useState, useCallback, memo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface ParticleFieldProps {
  count?: number;
  className?: string;
  color?: 'primary' | 'accent' | 'mixed';
}

export const ParticleField = memo(({ 
  count = 30, 
  className = '', 
  color = 'primary' 
}: ParticleFieldProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      });
    }
    setParticles(newParticles);
  }, [count]);

  useEffect(() => {
    generateParticles();
  }, [generateParticles]);

  const getColor = (index: number) => {
    if (color === 'mixed') {
      return index % 2 === 0 ? 'bg-primary/60' : 'bg-accent/40';
    }
    return color === 'primary' ? 'bg-primary/60' : 'bg-accent/40';
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${getColor(particle.id)}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -30, -60],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
});

ParticleField.displayName = 'ParticleField';
