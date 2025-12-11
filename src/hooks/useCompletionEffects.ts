import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

export const useCompletionEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playCompletionSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
      oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, []);

  const triggerConfetti = useCallback(() => {
    // Pink/rose themed confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ec4899', '#f472b6', '#f9a8d4', '#fce7f3', '#fbbf24', '#a78bfa'],
      shapes: ['circle', 'star'],
      scalar: 1.2,
    });
  }, []);

  const celebrate = useCallback(() => {
    playCompletionSound();
    triggerConfetti();
  }, [playCompletionSound, triggerConfetti]);

  return { celebrate, playCompletionSound, triggerConfetti };
};
