import { useState } from 'react';
import { Check, Trash2, Calendar, Pencil, X, Heart } from 'lucide-react';
import { Todo, Priority, categoryConfig } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format, isPast, isToday } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
}

const priorityConfig: Record<Priority, { bg: string; text: string; emoji: string }> = {
  low: { bg: 'bg-chart-4/10', text: 'text-chart-4', emoji: '🌱' },
  medium: { bg: 'bg-chart-5/10', text: 'text-chart-5', emoji: '⭐' },
  high: { bg: 'bg-primary/10', text: 'text-primary', emoji: '🔥' },
};

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      onUpdate(todo.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const getDueDateStatus = () => {
    if (!todo.dueDate) return null;
    if (todo.completed) return { color: 'text-muted-foreground', label: format(todo.dueDate, 'MMM d'), emoji: '📅' };
    if (isToday(todo.dueDate)) return { color: 'text-chart-5', label: 'Today', emoji: '🌟' };
    if (isPast(todo.dueDate)) return { color: 'text-destructive', label: 'Overdue', emoji: '⚠️' };
    return { color: 'text-muted-foreground', label: format(todo.dueDate, 'MMM d'), emoji: '📅' };
  };

  const dueDateStatus = getDueDateStatus();
  const catConfig = categoryConfig[todo.category];

  return (
    <div
      className={cn(
        'group relative flex items-start gap-4 p-5 rounded-2xl bg-card border border-border/30 transition-all duration-300',
        'hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5',
        todo.completed && 'opacity-60 bg-muted/30'
      )}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          'shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all mt-0.5',
          todo.completed
            ? 'border-primary'
            : 'border-muted-foreground/30 hover:border-primary hover:scale-110'
        )}
        style={todo.completed ? { background: 'var(--gradient-primary)' } : {}}
      >
        {todo.completed && <Check className="h-4 w-4 text-primary-foreground" />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="h-10 text-base rounded-xl"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl" onClick={handleSave}>
              <Check className="h-4 w-4 text-primary" />
            </Button>
            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <p
              className={cn(
                'text-base font-medium leading-relaxed transition-all',
                todo.completed && 'line-through text-muted-foreground'
              )}
            >
              {todo.title}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium',
                  catConfig.bg,
                  catConfig.color
                )}
              >
                <span>{catConfig.emoji}</span>
                {catConfig.label}
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full',
                  priorityConfig[todo.priority].bg,
                  priorityConfig[todo.priority].text
                )}
              >
                <span>{priorityConfig[todo.priority].emoji}</span>
                {todo.priority}
              </span>
              {dueDateStatus && (
                <span className={cn('inline-flex items-center gap-1.5 text-xs', dueDateStatus.color)}>
                  <span>{dueDateStatus.emoji}</span>
                  {dueDateStatus.label}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(todo.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
