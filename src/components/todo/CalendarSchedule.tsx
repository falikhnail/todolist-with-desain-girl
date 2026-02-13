import { useState, useMemo } from 'react';
import { Todo, Priority, Category, categoryConfig } from '@/types/todo';
import { cn } from '@/lib/utils';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  addDays, isSameMonth, isSameDay, isToday, addMonths, subMonths 
} from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check, Sparkles, Plus, Trash2, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const priorityConfig = {
  low: { label: 'Low', emoji: '🌱' },
  medium: { label: 'Medium', emoji: '⭐' },
  high: { label: 'High', emoji: '🔥' },
};

interface CalendarScheduleProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  onAdd: (title: string, priority: Priority, category: Category, dueDate?: Date) => void;
}

export function CalendarSchedule({ todos, onToggle, onDelete, onUpdate, onAdd }: CalendarScheduleProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Add task form state
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newCategory, setNewCategory] = useState<Category>('personal');
  const [showAddForm, setShowAddForm] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

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

  const handleAddTask = () => {
    if (!newTitle.trim() || !selectedDate) return;
    onAdd(newTitle, newPriority, newCategory, selectedDate);
    setNewTitle('');
    setNewPriority('medium');
    setNewCategory('personal');
    setShowAddForm(false);
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      onUpdate(id, { title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedDate(null);
      setShowAddForm(false);
      setEditingId(null);
    }
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
            <span className={cn('w-2 h-2 rounded-full', config.color.replace('text-', 'bg-'))} />
            <span className="text-xs text-muted-foreground">{config.emoji} {config.label}</span>
          </div>
        ))}
      </div>

      {/* Day Detail Dialog with full CRUD */}
      <Dialog open={!!selectedDate} onOpenChange={handleDialogClose}>
        <DialogContent className="rounded-3xl border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl gradient-text flex items-center gap-2">
              <span>📅</span>
              {selectedDate && format(selectedDate, 'EEEE, d MMMM yyyy', { locale: localeId })}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {selectedDateTodos.length === 0 && !showAddForm ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-3 block">🌸</span>
                <p className="text-muted-foreground text-sm">Tidak ada jadwal di hari ini</p>
                <p className="text-muted-foreground/60 text-xs mt-1">Klik tombol + untuk menambahkan task</p>
              </div>
            ) : (
              selectedDateTodos.map(todo => {
                const catConfig = categoryConfig[todo.category];
                const isEditing = editingId === todo.id;

                return (
                  <div
                    key={todo.id}
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-2xl border border-border/30 bg-card transition-all',
                      'hover:border-primary/20 hover:shadow-sm',
                      todo.completed && 'opacity-60'
                    )}
                  >
                    <button
                      onClick={() => onToggle(todo.id)}
                      className={cn(
                        'shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5',
                        todo.completed
                          ? 'border-primary'
                          : 'border-muted-foreground/30 hover:border-primary hover:scale-110'
                      )}
                      style={todo.completed ? { background: 'var(--gradient-primary)' } : {}}
                    >
                      {todo.completed && <Check className="h-3 w-3 text-primary-foreground" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Input
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveEdit(todo.id)}
                            className="h-8 text-sm rounded-xl"
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => handleSaveEdit(todo.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => setEditingId(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 rounded-full hover:bg-secondary/50"
                          onClick={() => handleStartEdit(todo)}
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 rounded-full hover:bg-destructive/10"
                          onClick={() => onDelete(todo.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Add Task Form */}
            {showAddForm && (
              <div className="p-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 space-y-3">
                <Input
                  placeholder="Nama task baru..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                  className="h-10 rounded-xl"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Select value={newCategory} onValueChange={v => setNewCategory(v as Category)}>
                    <SelectTrigger className="h-9 rounded-xl text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.emoji} {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={newPriority} onValueChange={v => setNewPriority(v as Priority)}>
                    <SelectTrigger className="h-9 rounded-xl text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.emoji} {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl glow-effect"
                    style={{ background: 'var(--gradient-primary)' }}
                    onClick={handleAddTask}
                    disabled={!newTitle.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Tambah
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => { setShowAddForm(false); setNewTitle(''); }}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Add button */}
          {!showAddForm && (
            <Button
              variant="outline"
              className="w-full rounded-2xl border-dashed border-primary/30 hover:bg-primary/5 gap-2"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4" />
              Tambah Task
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
