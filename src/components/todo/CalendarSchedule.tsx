import { useState, useMemo } from 'react';
import { Todo, categoryConfig } from '@/types/todo';
import { cn } from '@/lib/utils';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  addDays, isSameMonth, isSameDay, isToday, addMonths, subMonths 
} from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CalendarScheduleProps {
  todos: Todo[];
  onToggle: (id: string) => void;
}

export function CalendarSchedule({ todos, onToggle }: CalendarScheduleProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const todosByDate = useMemo(() => {
    const map = new Map<string, Todo[]>();
    todos.forEach(todo => {
      if (todo.dueDate) {
        const key = format(todo.dueDate, 'yyyy-MM-dd');
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(todo);
      }
    });
    return map;
  }, [todos]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const selectedDateTodos = selectedDate
    ? todosByDate.get(format(selectedDate, 'yyyy-MM-dd')) || []
    : [];

  const getCategoryDots = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    const dayTodos = todosByDate.get(key) || [];
    const categories = [...new Set(dayTodos.map(t => t.category))];
    return categories.slice(0, 3);
  };

  const getCompletionRatio = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    const dayTodos = todosByDate.get(key) || [];
    if (dayTodos.length === 0) return null;
    const completed = dayTodos.filter(t => t.completed).length;
    return { completed, total: dayTodos.length, allDone: completed === dayTodos.length };
  };

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full hover:bg-secondary/50"
          onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </Button>
        <h3 className="text-lg font-serif font-semibold gradient-text">
          {format(currentMonth, 'MMMM yyyy', { locale: localeId })}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full hover:bg-secondary/50"
          onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);
          const ratio = getCompletionRatio(day);
          const dots = getCategoryDots(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(day)}
              className={cn(
                'relative flex flex-col items-center justify-start p-1 rounded-xl aspect-square transition-all duration-200',
                'hover:bg-secondary/40 hover:scale-105',
                !inMonth && 'opacity-30',
                today && 'ring-2 ring-primary/40',
                isSelected && 'bg-primary/10 ring-2 ring-primary',
                ratio?.allDone && inMonth && 'bg-chart-4/10'
              )}
            >
              <span
                className={cn(
                  'text-sm font-medium leading-none mt-1',
                  today && 'text-primary font-bold',
                  !inMonth && 'text-muted-foreground',
                  isSelected && 'text-primary'
                )}
              >
                {format(day, 'd')}
              </span>

              {/* Task dots */}
              {dots.length > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {dots.map((cat, j) => (
                    <span
                      key={j}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        categoryConfig[cat]?.color.replace('text-', 'bg-') || 'bg-primary'
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Completion indicator */}
              {ratio && inMonth && (
                <div className="mt-auto mb-0.5">
                  {ratio.allDone ? (
                    <Sparkles className="h-3 w-3 text-chart-4" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {ratio.completed}/{ratio.total}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        {Object.entries(categoryConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                config.color.replace('text-', 'bg-')
              )}
            />
            <span className="text-xs text-muted-foreground">{config.emoji} {config.label}</span>
          </div>
        ))}
      </div>

      {/* Day Detail Dialog */}
      <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <DialogContent className="rounded-3xl border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl gradient-text flex items-center gap-2">
              <span>📅</span>
              {selectedDate && format(selectedDate, 'EEEE, d MMMM yyyy', { locale: localeId })}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {selectedDateTodos.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-3 block">🌸</span>
                <p className="text-muted-foreground text-sm">Tidak ada jadwal di hari ini</p>
                <p className="text-muted-foreground/60 text-xs mt-1">Tambah task dengan due date untuk melihatnya di sini</p>
              </div>
            ) : (
              selectedDateTodos.map(todo => {
                const catConfig = categoryConfig[todo.category];
                return (
                  <div
                    key={todo.id}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-2xl border border-border/30 bg-card transition-all',
                      'hover:border-primary/20 hover:shadow-sm',
                      todo.completed && 'opacity-60'
                    )}
                  >
                    <button
                      onClick={() => onToggle(todo.id)}
                      className={cn(
                        'shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                        todo.completed
                          ? 'border-primary'
                          : 'border-muted-foreground/30 hover:border-primary hover:scale-110'
                      )}
                      style={todo.completed ? { background: 'var(--gradient-primary)' } : {}}
                    >
                      {todo.completed && <Check className="h-3 w-3 text-primary-foreground" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium',
                        todo.completed && 'line-through text-muted-foreground'
                      )}>
                        {todo.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', catConfig?.bg, catConfig?.color)}>
                          {catConfig?.emoji} {catConfig?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
