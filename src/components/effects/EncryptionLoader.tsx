import { motion } from 'framer-motion';
import { Lock, Unlock, Shield } from 'lucide-react';
import { memo } from 'react';

interface EncryptionLoaderProps {
  phase: 'encrypting' | 'submitting' | 'decrypting' | 'complete';
  message?: string;
}

export const EncryptionLoader = memo(({ phase, message }: EncryptionLoaderProps) => {
  const phases = {
    encrypting: {
      icon: Lock,
      color: 'text-primary',
      label: message || 'Encrypting data with FHE...',
    },
    submitting: {
      icon: Shield,
      color: 'text-primary',
      label: message || 'Submitting to blockchain...',
    },
    decrypting: {
      icon: Unlock,
      color: 'text-green-400',
      label: message || 'Processing decryption via Relayer...',
    },
    complete: {
      icon: Shield,
      color: 'text-green-400',
      label: message || 'Complete!',
    },
  };

  const currentPhase = phases[phase];
  const Icon = currentPhase.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {/* Animated icon container */}
      <div className="relative">
        {/* Spinning ring */}
        {phase !== 'complete' && (
          <motion.div
            className="absolute inset-0 border-2 border-primary/30 rounded-full"
            style={{ margin: '-8px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-full"
          style={{ margin: '-4px' }}
          animate={{
            scale: phase !== 'complete' ? [1, 1.3, 1] : 1,
            opacity: phase !== 'complete' ? [0.5, 0, 0.5] : 0.3,
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Main icon */}
        <motion.div
          animate={phase !== 'complete' ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Icon className={`w-12 h-12 ${currentPhase.color}`} />
        </motion.div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {['encrypting', 'submitting', 'decrypting', 'complete'].map((p, i) => {
          const phaseIndex = ['encrypting', 'submitting', 'decrypting', 'complete'].indexOf(phase);
          const isActive = i === phaseIndex;
          const isPast = i < phaseIndex;

          return (
            <motion.div
              key={p}
              className={`w-2 h-2 rounded-full ${
                isPast || isActive ? 'bg-primary' : 'bg-muted'
              }`}
              animate={isActive ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          );
        })}
      </div>

      {/* Label */}
      <motion.p
        className="text-sm text-muted-foreground text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={phase}
      >
        {currentPhase.label}
      </motion.p>

      {/* Binary data stream effect */}
      {phase !== 'complete' && (
        <div className="flex gap-1 font-mono text-xs text-primary/60 overflow-hidden h-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.5, delay: i * 0.05, repeat: Infinity }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
});

EncryptionLoader.displayName = 'EncryptionLoader';
