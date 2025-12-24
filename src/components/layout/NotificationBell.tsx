import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationQueue, type Notification } from '@/hooks/useNotificationQueue';
import { useBlockchainEvents } from '@/hooks/useBlockchainEvents';

const notificationIcons: Record<Notification['type'], string> = {
  profile_submit: '📤',
  score_compute: '📊',
  decryption: '🔓',
  reward: '🎁',
  info: 'ℹ️',
  error: '❌',
};

const notificationColors: Record<Notification['type'], string> = {
  profile_submit: 'border-l-primary',
  score_compute: 'border-l-green-500',
  decryption: 'border-l-blue-500',
  reward: 'border-l-yellow-500',
  info: 'border-l-muted-foreground',
  error: 'border-l-destructive',
};

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    notifyProfileSubmit,
    notifyScoreComputed,
    notifyDecryptionRequested,
  } = useNotificationQueue();

  // Listen to blockchain events and create notifications
  const { events } = useBlockchainEvents();
  const processedEventsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    events.forEach((event) => {
      const eventKey = `${event.txHash}-${event.timestamp}`;
      if (processedEventsRef.current.has(eventKey)) return;
      processedEventsRef.current.add(eventKey);

      switch (event.type) {
        case 'EncryptedProfileSubmitted':
          notifyProfileSubmit(event.borrower || 'Unknown', event.txHash);
          break;
        case 'CreditScoreComputed':
          notifyScoreComputed(event.borrower || 'Unknown', String(event.tier || 'Unknown'), event.txHash);
          break;
        case 'DecryptionRequested':
          notifyDecryptionRequested(
            event.borrower || 'Unknown',
            event.lender || 'Unknown',
            event.txHash
          );
          break;
      }
    });
  }, [events, notifyProfileSubmit, notifyScoreComputed, notifyDecryptionRequested]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.txHash) {
      window.open(`https://sepolia.etherscan.io/tx/${notification.txHash}`, '_blank');
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearNotifications}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="max-h-96">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications yet</p>
                  <p className="text-xs mt-1">Blockchain events will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 border-l-4 ${notificationColors[notification.type]} ${
                        notification.read ? 'bg-background/50' : 'bg-secondary/30'
                      } hover:bg-secondary/50 transition-colors cursor-pointer`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">
                          {notificationIcons[notification.type]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-sm font-medium ${
                              notification.read ? 'text-muted-foreground' : 'text-foreground'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {notification.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {notification.txHash && (
                              <Badge variant="outline" className="text-xs">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Tx
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};