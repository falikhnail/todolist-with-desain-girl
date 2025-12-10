import { CheckCircle2 } from 'lucide-react';

interface TodoHeaderProps {
  activeCount: number;
  completedCount: number;
}

export function TodoHeader({ activeCount, completedCount }: TodoHeaderProps) {
  const total = activeCount + completedCount;
  const progressPercent = total > 0 ? (completedCount / total) * 100 : 0;

  return (
    <header className="text-center mb-8">
      <div className="inline-flex items-center justify-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          TaskFlow
        </h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Stay organized, get things done
      </p>
      
      {total > 0 && (
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{completedCount} of {total} tasks done</span>
            <span className="text-primary font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
