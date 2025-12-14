import { useEffect, useRef, useCallback } from 'react';
import { Todo } from '@/types/todo';
import { toast } from '@/hooks/use-toast';

const REMINDER_INTERVALS = [
  { label: '1 hari sebelum', ms: 24 * 60 * 60 * 1000 },
  { label: '1 jam sebelum', ms: 60 * 60 * 1000 },
  { label: '30 menit sebelum', ms: 30 * 60 * 1000 },
  { label: 'Deadline!', ms: 0 },
];

// Notification sound
const playReminderSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Play two-tone reminder sound
  const playTone = (frequency: number, startTime: number, duration: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };
  
  const now = audioContext.currentTime;
  playTone(880, now, 0.2);
  playTone(1100, now + 0.25, 0.2);
  playTone(880, now + 0.5, 0.3);
};

// Request notification permission
const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Show browser notification
const showBrowserNotification = (title: string, body: string) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'todo-reminder',
    });
  }
};

// Show in-app toast
const showToastNotification = (title: string, description: string, isUrgent: boolean) => {
  toast({
    title,
    description,
    variant: isUrgent ? 'destructive' : 'default',
    duration: 10000,
  });
};

export const useReminders = (todos: Todo[]) => {
  const scheduledReminders = useRef<Map<string, NodeJS.Timeout[]>>(new Map());
  const shownReminders = useRef<Set<string>>(new Set());

  const clearAllReminders = useCallback(() => {
    scheduledReminders.current.forEach((timeouts) => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    });
    scheduledReminders.current.clear();
  }, []);

  const scheduleReminder = useCallback((todo: Todo, reminderLabel: string, timeUntilReminder: number) => {
    const reminderId = `${todo.id}-${reminderLabel}`;
    
    // Skip if already shown
    if (shownReminders.current.has(reminderId)) {
      return null;
    }

    const timeout = setTimeout(async () => {
      // Mark as shown
      shownReminders.current.add(reminderId);
      
      const isUrgent = reminderLabel === 'Deadline!' || reminderLabel === '30 menit sebelum';
      const title = `⏰ ${reminderLabel}`;
      const body = `Task: ${todo.title}`;
      
      // Play sound
      playReminderSound();
      
      // Show browser notification
      showBrowserNotification(title, body);
      
      // Show in-app toast
      showToastNotification(title, body, isUrgent);
    }, timeUntilReminder);

    return timeout;
  }, []);

  useEffect(() => {
    // Request permission on mount
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    // Clear existing reminders
    clearAllReminders();

    const now = Date.now();

    todos.forEach((todo) => {
      // Skip completed todos or todos without due date
      if (todo.completed || !todo.dueDate) {
        return;
      }

      const dueTime = new Date(todo.dueDate).getTime();
      const timeouts: NodeJS.Timeout[] = [];

      REMINDER_INTERVALS.forEach(({ label, ms }) => {
        const reminderTime = dueTime - ms;
        const timeUntilReminder = reminderTime - now;

        // Only schedule if reminder is in the future
        if (timeUntilReminder > 0) {
          const timeout = scheduleReminder(todo, label, timeUntilReminder);
          if (timeout) {
            timeouts.push(timeout);
          }
        }
      });

      if (timeouts.length > 0) {
        scheduledReminders.current.set(todo.id, timeouts);
      }
    });

    return () => {
      clearAllReminders();
    };
  }, [todos, clearAllReminders, scheduleReminder]);

  return {
    requestPermission: requestNotificationPermission,
  };
};
