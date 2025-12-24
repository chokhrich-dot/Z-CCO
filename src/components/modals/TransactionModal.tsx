import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { EncryptionLoader } from '@/components/effects/EncryptionLoader';
import { Button } from '@/components/ui/button';

export type TransactionPhase = 'encrypting' | 'submitting' | 'decrypting' | 'complete' | 'error';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: TransactionPhase;
  txHash?: string | null;
  errorMessage?: string;
  title?: string;
}

export const TransactionModal = ({
  isOpen,
  onClose,
  phase,
  txHash,
  errorMessage,
  title = 'Transaction Status',
}: TransactionModalProps) => {
  const canClose = phase === 'complete' || phase === 'error';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={canClose ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                {canClose && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {phase === 'error' ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
                      <X className="w-8 h-8 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Transaction Failed</h3>
                      <p className="text-sm text-muted-foreground">
                        {errorMessage || 'An error occurred. Please try again.'}
                      </p>
                    </div>
                    <Button onClick={onClose} variant="outline" className="w-full">
                      Close
                    </Button>
                  </div>
                ) : (
                  <>
                    <EncryptionLoader phase={phase} />

                    {/* Transaction Hash */}
                    {txHash && phase === 'complete' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg"
                      >
                        <p className="text-sm text-muted-foreground mb-2">Transaction Hash:</p>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 font-mono text-xs text-primary hover:underline break-all"
                        >
                          {txHash.slice(0, 20)}...{txHash.slice(-20)}
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </motion.div>
                    )}

                    {phase === 'complete' && (
                      <div className="mt-6">
                        <Button onClick={onClose} variant="cta" className="w-full">
                          Done
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
