import { useState, useMemo } from 'react';
import { Todo, Priority, Category, categoryConfig } from '@/types/todo';
import { cn } from '@/lib/utils';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  addDays, isSameMonth, isSameDay, isToday, addMonths, subMonths 
} from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check, Sparkles, Plus, Trash2, Pencil, X, Calendar as CalendarIcon } from 'lucide-react';
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
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newCategory, setNewCategory] = useState<Category>('personal');
  const [showAddForm, setShowAddForm] = useState(false);
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
    <div className="space-y-5">
      {/* Month Navigation - Elegant header */}
      <div className="flex items-center justify-between px-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-110"
          onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
        >
          <ChevronLeft className="h-5 w-5 text-primary" />
        </Button>
        <div className="text-center">
          <h3 className="text-xl font-serif font-semibold gradient-text capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: localeId })}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {todos.filter(t => t.dueDate && isSameMonth(t.dueDate, currentMonth)).length} task bulan ini
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-110"
          onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
        >
          <ChevronRight className="h-5 w-5 text-primary" />
        </Button>
      </div>

      {/* Weekday Headers - Styled */}
      <div className="grid grid-cols-7 gap-1 px-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - Enhanced */}
      <div className="grid grid-cols-7 gap-1.5 px-1">
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
                'relative flex flex-col items-center justify-start p-1.5 rounded-2xl aspect-square transition-all duration-300',
                'hover:scale-105 group',
                !inMonth && 'opacity-25',
                inMonth && !today && !isSelected && 'hover:bg-secondary/40 hover:shadow-sm',
                today && !isSelected && 'bg-primary/10 ring-2 ring-primary/30 shadow-sm',
                isSelected && 'ring-2 ring-primary shadow-md scale-105',
                ratio?.allDone && inMonth && !isSelected && 'bg-chart-4/10',
              )}
              style={isSelected ? { background: 'var(--gradient-primary)', opacity: 0.9 } : undefined}
            >
              <span
                className={cn(
                  'text-sm font-medium leading-none mt-1 transition-colors',
                  today && !isSelected && 'text-primary font-bold',
                  !inMonth && 'text-muted-foreground',
                  isSelected && 'text-primary-foreground font-bold',
                )}
              >
                {format(day, 'd')}
              </span>

              {dots.length > 0 && !isSelected && (
                <div className="flex gap-0.5 mt-1.5">
                  {dots.map((cat, j) => (
                    <span
                      key={j}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-125',
                        categoryConfig[cat]?.color.replace('text-', 'bg-') || 'bg-primary'
                      )}
                    />
                  ))}
                </div>
              )}

              {isSelected && dots.length > 0 && (
                <div className="flex gap-0.5 mt-1.5">
                  {dots.map((_, j) => (
                    <span key={j} className="w-1.5 h-1.5 rounded-full bg-primary-foreground/70" />
                  ))}
                </div>
              )}

              {ratio && inMonth && !isSelected && (
                <div className="mt-auto mb-0.5">
                  {ratio.allDone ? (
                    <Sparkles className="h-3 w-3 text-chart-4 animate-pulse" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {ratio.completed}/{ratio.total}
                    </span>
                  )}
                </div>
              )}
              {ratio && inMonth && isSelected && (
                <div className="mt-auto mb-0.5">
                  {ratio.allDone ? (
                    <Sparkles className="h-3 w-3 text-primary-foreground animate-pulse" />
                  ) : (
                    <span className="text-[10px] text-primary-foreground/80 font-semibold">
                      {ratio.completed}/{ratio.total}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend - More elegant */}
      <div className="flex flex-wrap gap-3 justify-center pt-3 pb-1">
        {Object.entries(categoryConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-default">
            <span className={cn('w-2 h-2 rounded-full', config.color.replace('text-', 'bg-'))} />
            <span className="text-[11px] text-muted-foreground font-medium">{config.emoji} {config.label}</span>
          </div>
        ))}
      </div>

      {/* Day Detail Dialog - Beautified */}
      <Dialog open={!!selectedDate} onOpenChange={handleDialogClose}>
        <DialogContent className="rounded-3xl border-border/30 max-w-md overflow-hidden p-0">
          {/* Dialog Header with gradient */}
          <div className="p-6 pb-4" style={{ background: 'var(--gradient-primary)' }}>
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-primary-foreground flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {selectedDate && format(selectedDate, 'EEEE', { locale: localeId })}
              </DialogTitle>
              <p className="text-primary-foreground/80 text-sm">
                {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: localeId })}
              </p>
              {selectedDateTodos.length > 0 && (
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground font-medium">
                    {selectedDateTodos.filter(t => t.completed).length}/{selectedDateTodos.length} selesai
                  </span>
                </div>
              )}
            </DialogHeader>
          </div>

          <div className="p-5 space-y-3 max-h-[50vh] overflow-y-auto">
            {selectedDateTodos.length === 0 && !showAddForm ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌸</span>
                </div>
                <p className="text-muted-foreground font-medium">Tidak ada jadwal</p>
                <p className="text-muted-foreground/60 text-xs mt-1">Klik tombol di bawah untuk menambahkan task</p>
              </div>
            ) : (
              selectedDateTodos.map((todo, index) => {
                const catConfig = categoryConfig[todo.category];
                const isEditing = editingId === todo.id;

                return (
                  <div
                    key={todo.id}
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-2xl border border-border/30 transition-all duration-300',
                      'hover:border-primary/20 hover:shadow-sm',
                      todo.completed && 'opacity-50',
                    )}
                    style={{
                      background: 'var(--gradient-card)',
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <button
                      onClick={() => onToggle(todo.id)}
                      className={cn(
                        'shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-0.5',
                        todo.completed
                          ? 'border-primary scale-100'
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
                          <Button size="sm" variant="ghost" className="h-8 px-2 hover:bg-chart-4/10" onClick={() => handleSaveEdit(todo.id)}>
                            <Check className="h-4 w-4 text-chart-4" />
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
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', catConfig?.bg, catConfig?.color)}>
                              {catConfig?.emoji} {catConfig?.label}
                            </span>
                            <span className="text-xs text-muted-foreground/60">
                              {priorityConfig[todo.priority]?.emoji}
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
                          className="h-7 w-7 p-0 rounded-full hover:bg-secondary/60 transition-all"
                          onClick={() => handleStartEdit(todo)}
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 rounded-full hover:bg-destructive/10 transition-all"
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

            {/* Add Task Form - Enhanced */}
            {showAddForm && (
              <div className="p-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 space-y-3">
                <Input
                  placeholder="✨ Nama task baru..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                  className="h-10 rounded-xl border-primary/20 focus:border-primary/40"
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
                    className="flex-1 rounded-xl text-primary-foreground glow-effect"
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

          {/* Add button - Floating style */}
          {!showAddForm && (
            <div className="px-5 pb-5">
              <Button
                variant="outline"
                className="w-full rounded-2xl border-dashed border-primary/30 hover:bg-primary/5 hover:border-primary/50 gap-2 h-11 transition-all duration-300"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Tambah Task</span>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
