import { FilterType } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TodoFiltersProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
  hasCompleted: boolean;
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
];

export function TodoFilters({ 
  filter, 
  onFilterChange, 
  onClearCompleted,
  hasCompleted 
}: TodoFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
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
  );
}
