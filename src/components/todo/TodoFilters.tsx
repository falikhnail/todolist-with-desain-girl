import { FilterType, Category, categoryConfig } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface TodoFiltersProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  categoryFilter: Category | null;
  onCategoryFilterChange: (category: Category | null) => void;
  onClearCompleted: () => void;
  hasCompleted: boolean;
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
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
    <div className="space-y-3 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
          {filters.map(f => (
            <Button
              key={f.value}
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange(f.value)}
              className={cn(
                'px-4 h-8 text-sm transition-all',
                filter === f.value
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {f.label}
            </Button>
          ))}
        </div>
        
        {hasCompleted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCompleted}
            className="text-muted-foreground hover:text-destructive h-8"
          >
            Clear completed
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(([key, config]) => (
          <button
            key={key}
            onClick={() => onCategoryFilterChange(categoryFilter === key ? null : key)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              categoryFilter === key
                ? cn(config.bg, config.color, 'ring-2 ring-offset-1 ring-current')
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            <span className={cn('w-2 h-2 rounded-full', config.bg, categoryFilter === key ? 'bg-current' : '')} />
            {config.label}
            {categoryFilter === key && <X className="h-3 w-3 ml-1" />}
          </button>
        ))}
      </div>
    </div>
  );
}
