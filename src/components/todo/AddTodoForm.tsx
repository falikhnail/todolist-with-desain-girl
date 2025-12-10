import { useState } from 'react';
import { Plus, Calendar, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Priority, Category, categoryConfig } from '@/types/todo';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddTodoFormProps {
  onAdd: (title: string, priority: Priority, category: Category, dueDate?: Date) => void;
}

const priorityConfig = {
  low: { label: 'Low', color: 'text-chart-4', emoji: '🌱' },
  medium: { label: 'Medium', color: 'text-chart-5', emoji: '⭐' },
  high: { label: 'High', color: 'text-primary', emoji: '🔥' },
};

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('personal');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, priority, category, dueDate);
      setTitle('');
      setPriority('medium');
      setDueDate(undefined);
    }
  };

  const categories = Object.entries(categoryConfig) as [Category, typeof categoryConfig[Category]][];
  const priorities = Object.entries(priorityConfig) as [Priority, typeof priorityConfig[Priority]][];

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50" />
            <Input
              type="text"
              placeholder="What would you like to accomplish today?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="h-14 pl-12 pr-4 text-base bg-card border-border/50 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 rounded-2xl shadow-sm placeholder:text-muted-foreground/60"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'h-10 gap-2 rounded-full border-border/50 hover:bg-secondary/50',
                    categoryConfig[category].color
                  )}
                >
                  <span>{categoryConfig[category].emoji}</span>
                  <span className="hidden sm:inline">{categoryConfig[category].label}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 rounded-2xl" align="start">
                <div className="space-y-1">
                  {categories.map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setCategory(key);
                        setIsCategoryOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all',
                        'hover:bg-muted/70',
                        category === key && 'bg-muted'
                      )}
                    >
                      <span className="text-lg">{config.emoji}</span>
                      <span className="font-medium">{config.label}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={isPriorityOpen} onOpenChange={setIsPriorityOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 gap-2 rounded-full border-border/50 hover:bg-secondary/50"
                >
                  <span>{priorityConfig[priority].emoji}</span>
                  <span className="hidden sm:inline">{priorityConfig[priority].label}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-44 p-2 rounded-2xl" align="start">
                <div className="space-y-1">
                  {priorities.map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setPriority(key);
                        setIsPriorityOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all',
                        'hover:bg-muted/70',
                        priority === key && 'bg-muted'
                      )}
                    >
                      <span className="text-lg">{config.emoji}</span>
                      <span className="font-medium">{config.label}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'h-10 gap-2 rounded-full border-border/50 hover:bg-secondary/50',
                    dueDate ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {dueDate ? format(dueDate, 'MMM d') : 'Due date'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    setDueDate(date);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                  className="pointer-events-auto rounded-2xl"
                />
              </PopoverContent>
            </Popover>

            <Button
              type="submit"
              className="h-10 px-6 gap-2 rounded-full ml-auto shadow-sm glow-effect"
              style={{ background: 'var(--gradient-primary)' }}
              disabled={!title.trim()}
            >
              <Plus className="h-5 w-5" />
              <span>Add Task</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
