import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  type: 'profile_submit' | 'score_compute' | 'decryption' | 'reward' | 'info' | 'error';
  title: string;
  description: string;
  txHash?: string;
  timestamp: Date;
  read: boolean;
}

const STORAGE_KEY = 'cco_notifications';
const MAX_NOTIFICATIONS = 50;

export const useNotificationQueue = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const toastQueueRef = useRef<Notification[]>([]);
  const isProcessingRef = useRef(false);

  // Load from storage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Notification[];
        // Convert timestamp strings back to Date objects
        const withDates = parsed.map(n => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(withDates);
        setUnreadCount(withDates.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  // Save to storage when notifications change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      setUnreadCount(notifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }, [notifications]);

  // Process toast queue sequentially
  const processToastQueue = useCallback(async () => {
    if (isProcessingRef.current || toastQueueRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    
    while (toastQueueRef.current.length > 0) {
      const notification = toastQueueRef.current.shift();
      if (notification) {
        toast({
          title: notification.title,
          description: notification.description,
        });
        // Small delay between toasts
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    isProcessingRef.current = false;
  }, []);

  const addNotification = useCallback((
    type: Notification['type'],
    title: string,
    description: string,
    txHash?: string,
    showToast: boolean = true
  ) => {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type,
      title,
      description,
      txHash,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => {
      const updated = [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
      return updated;
    });

    if (showToast) {
      toastQueueRef.current.push(notification);
      processToastQueue();
    }

    return notification;
  }, [processToastQueue]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Helper functions for specific notification types
  const notifyProfileSubmit = useCallback((address: string, txHash?: string) => {
    return addNotification(
      'profile_submit',
      'Profile Submitted',
      `Encrypted profile submitted by ${address.slice(0, 8)}...`,
      txHash
    );
  }, [addNotification]);

  const notifyScoreComputed = useCallback((address: string, tier: string, txHash?: string) => {
    return addNotification(
      'score_compute',
      'Credit Score Computed',
      `Credit tier for ${address.slice(0, 8)}...: ${tier}`,
      txHash
    );
  }, [addNotification]);

  const notifyDecryptionRequested = useCallback((borrower: string, lender: string, txHash?: string) => {
    return addNotification(
      'decryption',
      'Decryption Requested',
      `Lender ${lender.slice(0, 8)}... requested access to ${borrower.slice(0, 8)}...`,
      txHash
    );
  }, [addNotification]);

  const notifyRewardEarned = useCallback((amount: number, action: string) => {
    return addNotification(
      'reward',
      'Reward Earned!',
      `You earned ${amount} CCO tokens for: ${action}`
    );
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    removeNotification,
    notifyProfileSubmit,
    notifyScoreComputed,
    notifyDecryptionRequested,
    notifyRewardEarned,
  };
};
