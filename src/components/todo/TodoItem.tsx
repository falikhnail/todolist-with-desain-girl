import { useState } from 'react';
import { Check, Trash2, Pencil, X, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Todo, Priority, categoryConfig, SubTask } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format, isPast, isToday } from 'date-fns';
import { useCompletionSound } from '@/hooks/useCompletionSound';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  onAddSubtask: (todoId: string, title: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onDeleteSubtask: (todoId: string, subtaskId: string) => void;
}

const priorityConfig: Record<Priority, { bg: string; text: string; emoji: string }> = {
  low: { bg: 'bg-chart-4/10', text: 'text-chart-4', emoji: '🌱' },
  medium: { bg: 'bg-chart-5/10', text: 'text-chart-5', emoji: '⭐' },
  high: { bg: 'bg-primary/10', text: 'text-primary', emoji: '🔥' },
};

export function TodoItem({ todo, onToggle, onDelete, onUpdate, onAddSubtask, onToggleSubtask, onDeleteSubtask }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [newSubtask, setNewSubtask] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const { playCompletionSound } = useCompletionSound();

  const handleToggle = () => {
    if (!todo.completed) {
      playCompletionSound();
    }
    onToggle(todo.id);
  };

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

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(todo.id, newSubtask);
      setNewSubtask('');
      setIsAddingSubtask(false);
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const subtask = todo.subtasks.find(st => st.id === subtaskId);
    if (subtask && !subtask.completed) {
      playCompletionSound();
    }
    onToggleSubtask(todo.id, subtaskId);
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
  const completedSubtasks = todo.subtasks.filter(st => st.completed).length;
  const hasSubtasks = todo.subtasks.length > 0;

  return (
    <div
      className={cn(
        'group relative flex flex-col p-5 rounded-2xl bg-card border border-border/30 transition-all duration-300',
        'hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5',
        todo.completed && 'opacity-60 bg-muted/30'
      )}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
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
              <div className="flex items-center gap-2">
                {hasSubtasks && (
                  <button
                    onClick={() => setShowSubtasks(!showSubtasks)}
                    className="p-0.5 rounded hover:bg-muted/50 transition-colors"
                  >
                    {showSubtasks ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                )}
                <p
                  className={cn(
                    'text-base font-medium leading-relaxed transition-all',
                    todo.completed && 'line-through text-muted-foreground'
                  )}
                >
                  {todo.title}
                </p>
              </div>
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
                {hasSubtasks && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    ✅ {completedSubtasks}/{todo.subtasks.length}
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
              onClick={() => setIsAddingSubtask(true)}
              title="Add subtask"
            >
              <Plus className="h-4 w-4" />
            </Button>
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

      {/* Subtasks Section */}
      {(showSubtasks && hasSubtasks) || isAddingSubtask ? (
        <div className="mt-4 ml-11 space-y-2">
          {showSubtasks && todo.subtasks.map(subtask => (
            <div
              key={subtask.id}
              className="group/subtask flex items-center gap-3 p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <button
                onClick={() => handleToggleSubtask(subtask.id)}
                className={cn(
                  'shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  subtask.completed
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/30 hover:border-primary'
                )}
              >
                {subtask.completed && <Check className="h-3 w-3 text-primary-foreground" />}
              </button>
              <span
                className={cn(
                  'flex-1 text-sm',
                  subtask.completed && 'line-through text-muted-foreground'
                )}
              >
                {subtask.title}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 rounded-lg opacity-0 group-hover/subtask:opacity-100 text-muted-foreground hover:text-destructive"
                onClick={() => onDeleteSubtask(todo.id, subtask.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {isAddingSubtask && (
            <div className="flex gap-2">
              <Input
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                placeholder="Add a subtask..."
                className="h-9 text-sm rounded-xl"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddSubtask();
                  if (e.key === 'Escape') {
                    setIsAddingSubtask(false);
                    setNewSubtask('');
                  }
                }}
              />
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl" onClick={handleAddSubtask}>
                <Check className="h-4 w-4 text-primary" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-xl"
                onClick={() => {
                  setIsAddingSubtask(false);
                  setNewSubtask('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
