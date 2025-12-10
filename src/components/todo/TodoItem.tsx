import { useState } from 'react';
import { Check, Trash2, Flag, Calendar, Pencil, X, Tag } from 'lucide-react';
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

const priorityConfig: Record<Priority, { bg: string; text: string }> = {
  low: { bg: 'bg-chart-5/10', text: 'text-chart-5' },
  medium: { bg: 'bg-chart-1/10', text: 'text-chart-1' },
  high: { bg: 'bg-destructive/10', text: 'text-destructive' },
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
    if (todo.completed) return { color: 'text-muted-foreground', label: format(todo.dueDate, 'MMM d') };
    if (isToday(todo.dueDate)) return { color: 'text-chart-1', label: 'Today' };
    if (isPast(todo.dueDate)) return { color: 'text-destructive', label: 'Overdue' };
    return { color: 'text-muted-foreground', label: format(todo.dueDate, 'MMM d') };
  };

  const dueDateStatus = getDueDateStatus();
  const catConfig = categoryConfig[todo.category];

  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 transition-all duration-200',
        'hover:shadow-md hover:border-border',
        todo.completed && 'opacity-60'
      )}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          'shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
          todo.completed
            ? 'bg-primary border-primary'
            : 'border-muted-foreground/30 hover:border-primary'
        )}
      >
        {todo.completed && <Check className="h-4 w-4 text-primary-foreground" />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="h-8 text-base"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <p
              className={cn(
                'text-base font-medium truncate transition-all',
                todo.completed && 'line-through text-muted-foreground'
              )}
            >
              {todo.title}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full',
                  catConfig.bg,
                  catConfig.color
                )}
              >
                <Tag className="h-3 w-3" />
                {catConfig.label}
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full',
                  priorityConfig[todo.priority].bg,
                  priorityConfig[todo.priority].text
                )}
              >
                <Flag className="h-3 w-3" />
                {todo.priority}
              </span>
              {dueDateStatus && (
                <span className={cn('inline-flex items-center gap-1 text-xs', dueDateStatus.color)}>
                  <Calendar className="h-3 w-3" />
                  {dueDateStatus.label}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(todo.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
