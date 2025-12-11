import { useMemo } from 'react';
import { Todo, FilterType, Category } from '@/types/todo';
import { TodoItem } from './TodoItem';
import { Heart, Sparkles } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  categoryFilter: Category | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  onAddSubtask: (todoId: string, title: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onDeleteSubtask: (todoId: string, subtaskId: string) => void;
}

export function TodoList({ todos, filter, categoryFilter, onToggle, onDelete, onUpdate, onAddSubtask, onToggleSubtask, onDeleteSubtask }: TodoListProps) {
  const filteredTodos = useMemo(() => {
    let result = todos;
    
    switch (filter) {
      case 'active':
        result = result.filter(t => !t.completed);
        break;
      case 'completed':
        result = result.filter(t => t.completed);
        break;
    }
    
    if (categoryFilter) {
      result = result.filter(t => t.category === categoryFilter);
    }
    
    return result;
  }, [todos, filter, categoryFilter]);

  if (filteredTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 mb-6">
          <Heart className="h-16 w-16 text-primary/40" />
          <Sparkles className="absolute top-2 right-2 h-6 w-6 text-accent-foreground animate-pulse" />
        </div>
        <h3 className="text-xl font-serif font-semibold text-foreground/80 mb-2">
          {categoryFilter 
            ? 'No tasks here yet' 
            : filter === 'all' 
              ? 'Your task list is empty' 
              : filter === 'active' 
                ? 'Nothing to do!' 
                : 'No completed tasks'}
        </h3>
        <p className="text-muted-foreground max-w-xs">
          {filter === 'all' && !categoryFilter 
            ? '✨ Add your first task and start your productive day!' 
            : filter === 'completed' 
              ? '💪 Complete some tasks to see them here' 
              : '🎉 Great job! Time to add more goals'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTodos.map((todo, index) => (
        <div
          key={todo.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onAddSubtask={onAddSubtask}
            onToggleSubtask={onToggleSubtask}
            onDeleteSubtask={onDeleteSubtask}
          />
        </div>
      ))}
    </div>
  );
}
