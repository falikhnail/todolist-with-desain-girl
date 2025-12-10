import { CheckCircle2, Sparkles } from 'lucide-react';

interface TodoHeaderProps {
  activeCount: number;
  completedCount: number;
}

export function TodoHeader({ activeCount, completedCount }: TodoHeaderProps) {
  const total = activeCount + completedCount;
  const progressPercent = total > 0 ? (completedCount / total) * 100 : 0;

  return (
    <header className="text-center mb-8 relative">
      {/* Decorative elements */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -top-2 left-1/4 w-20 h-20 bg-secondary/30 rounded-full blur-2xl" />
      <div className="absolute -top-2 right-1/4 w-24 h-24 bg-accent/30 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="inline-flex items-center justify-center gap-3 mb-4">
          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 glow-effect">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-accent-foreground animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
          <span className="gradient-text">TaskFlow</span>
        </h1>
        <p className="text-muted-foreground text-lg font-light">
          ✨ Organize your day beautifully ✨
        </p>
      </div>
      
      {total > 0 && (
        <div className="max-w-xs mx-auto mt-8">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted-foreground font-medium">
              {completedCount} of {total} tasks completed
            </span>
            <span className="text-primary font-semibold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3 bg-muted/50 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ 
                width: `${progressPercent}%`,
                background: 'var(--gradient-primary)'
              }}
            />
          </div>
          {progressPercent === 100 && (
            <p className="mt-3 text-sm text-primary font-medium animate-pulse">
              🎉 All tasks completed! You're amazing!
            </p>
          )}
        </div>
      )}
    </header>
  );
}
