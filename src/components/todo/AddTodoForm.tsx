import { useState } from 'react';
import { Plus, Calendar, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Priority } from '@/types/todo';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddTodoFormProps {
  onAdd: (title: string, priority: Priority, dueDate?: Date) => void;
}

const priorityConfig = {
  low: { label: 'Low', color: 'text-chart-5' },
  medium: { label: 'Medium', color: 'text-chart-1' },
  high: { label: 'High', color: 'text-destructive' },
};

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, priority, dueDate);
      setTitle('');
      setPriority('medium');
      setDueDate(undefined);
    }
  };

  const cyclePriority = () => {
    const priorities: Priority[] = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(priority);
    setPriority(priorities[(currentIndex + 1) % 3]);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="h-12 pl-4 pr-4 text-base bg-card border-border focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0"
            onClick={cyclePriority}
            title={`Priority: ${priorityConfig[priority].label}`}
          >
            <Flag className={cn('h-5 w-5', priorityConfig[priority].color)} />
          </Button>
          
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'h-12 shrink-0 gap-2',
                  dueDate ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Calendar className="h-5 w-5" />
                <span className="hidden sm:inline">
                  {dueDate ? format(dueDate, 'MMM d') : 'Due'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={dueDate}
                onSelect={(date) => {
                  setDueDate(date);
                  setIsCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            type="submit"
            className="h-12 px-6 gap-2"
            disabled={!title.trim()}
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
