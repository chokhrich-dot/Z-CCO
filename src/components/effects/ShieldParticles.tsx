import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { memo } from 'react';

interface ShieldParticlesProps {
  isAnimating?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ShieldParticles = memo(({ 
  isAnimating = true, 
  size = 'md',
  className = '' 
}: ShieldParticlesProps) => {
  const sizeClasses = {
    sm: { shield: 'w-12 h-12', lock: 'w-4 h-4', ring: 'inset-2' },
    md: { shield: 'w-20 h-20', lock: 'w-6 h-6', ring: 'inset-4' },
    lg: { shield: 'w-32 h-32', lock: 'w-10 h-10', ring: 'inset-6' },
  };

  const classes = sizeClasses[size];
  const particleCount = size === 'lg' ? 12 : size === 'md' ? 8 : 6;

  return (
    <div className={`relative ${className}`}>
      {/* Outer glow ring */}
      <motion.div
        className={`absolute ${classes.ring} rounded-full border-2 border-primary/30`}
        animate={isAnimating ? {
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Pulse rings */}
      {isAnimating && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-primary/20"
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{
            scale: [0.8, 1.5],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.6,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Orbiting particles */}
      {isAnimating && Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/80"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: '-4px',
            marginTop: '-4px',
          }}
          animate={{
            x: [
              Math.cos((i / particleCount) * Math.PI * 2) * 40,
              Math.cos(((i / particleCount) * Math.PI * 2) + Math.PI) * 40,
              Math.cos((i / particleCount) * Math.PI * 2) * 40,
            ],
            y: [
              Math.sin((i / particleCount) * Math.PI * 2) * 40,
              Math.sin(((i / particleCount) * Math.PI * 2) + Math.PI) * 40,
              Math.sin((i / particleCount) * Math.PI * 2) * 40,
            ],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 4,
            delay: (i / particleCount) * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Main shield */}
      <motion.div
        className="relative flex items-center justify-center"
        animate={isAnimating ? {
          rotate: [0, 5, -5, 0],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Shield className={`${classes.shield} text-primary drop-shadow-lg`} />
        <motion.div
          className="absolute"
          animate={isAnimating ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Lock className={`${classes.lock} text-primary-foreground`} />
        </motion.div>
      </motion.div>

      {/* Data streams */}
      {isAnimating && [0, 1, 2, 3].map((i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute w-0.5 h-8 bg-gradient-to-b from-primary/0 via-primary to-primary/0"
          style={{
            left: '50%',
            top: i % 2 === 0 ? '-20px' : 'auto',
            bottom: i % 2 === 1 ? '-20px' : 'auto',
            marginLeft: '-1px',
            transform: `rotate(${i * 90}deg)`,
            transformOrigin: i % 2 === 0 ? 'bottom center' : 'top center',
          }}
          animate={{
            opacity: [0, 1, 0],
            scaleY: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
});

ShieldParticles.displayName = 'ShieldParticles';
