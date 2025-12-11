import { useMemo } from 'react';

const quotes = [
  { text: "You are capable of amazing things!", author: "Believe in yourself" },
  { text: "Small steps every day lead to big changes.", author: "Progress" },
  { text: "Today is a perfect day to start something new.", author: "New beginnings" },
  { text: "You are stronger than you think.", author: "Inner strength" },
  { text: "Every accomplishment starts with the decision to try.", author: "Courage" },
  { text: "Be proud of how far you have come.", author: "Self-love" },
  { text: "Your only limit is your mind.", author: "Mindset" },
  { text: "Make today so awesome that yesterday gets jealous.", author: "Motivation" },
  { text: "You deserve all the good things coming your way.", author: "Abundance" },
  { text: "Take it one task at a time, you got this!", author: "Focus" },
  { text: "Believe you can and you are halfway there.", author: "Confidence" },
  { text: "The secret of getting ahead is getting started.", author: "Action" },
  { text: "You are doing better than you think.", author: "Encouragement" },
  { text: "Dream big, work hard, stay focused.", author: "Determination" },
];

export function DailyQuote() {
  const todayQuote = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return quotes[dayOfYear % quotes.length];
  }, []);

  return (
    <div className="text-center py-3 px-4 rounded-xl bg-accent/30 backdrop-blur-sm border border-border/20">
      <p className="text-sm md:text-base text-foreground/90 italic">
        "{todayQuote.text}"
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        — {todayQuote.author} ✨
      </p>
    </div>
  );
}
