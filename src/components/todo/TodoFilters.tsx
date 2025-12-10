import { FilterType, Category, categoryConfig } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Sparkles } from 'lucide-react';

interface TodoFiltersProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  categoryFilter: Category | null;
  onCategoryFilterChange: (category: Category | null) => void;
  onClearCompleted: () => void;
  hasCompleted: boolean;
}

const filters: { value: FilterType; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '📋' },
  { value: 'active', label: 'To Do', emoji: '⏳' },
  { value: 'completed', label: 'Done', emoji: '✅' },
];

const categories = Object.entries(categoryConfig) as [Category, typeof categoryConfig[Category]][];

export function TodoFilters({ 
  filter, 
  onFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onClearCompleted,
  hasCompleted 
}: TodoFiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 p-1.5 bg-muted/30 rounded-2xl">
          {filters.map(f => (
            <Button
              key={f.value}
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange(f.value)}
              className={cn(
                'px-4 h-9 text-sm rounded-xl transition-all gap-2',
                filter === f.value
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
              )}
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
            </Button>
          ))}
        </div>
        
        {hasCompleted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCompleted}
            className="text-muted-foreground hover:text-destructive h-9 rounded-xl gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Clear done
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(([key, config]) => (
          <button
            key={key}
            onClick={() => onCategoryFilterChange(categoryFilter === key ? null : key)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
              categoryFilter === key
                ? cn(config.bg, config.color, 'ring-2 ring-offset-2 ring-offset-background ring-current shadow-sm')
                : 'bg-card/80 text-muted-foreground hover:bg-muted/50 border border-border/50'
            )}
          >
            <span>{config.emoji}</span>
            <span>{config.label}</span>
            {categoryFilter === key && <X className="h-3.5 w-3.5 ml-1" />}
          </button>
        ))}
      </div>
    </div>
  );
}
