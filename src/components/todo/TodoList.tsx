import { useMemo } from 'react';
import { Todo, FilterType, Category } from '@/types/todo';
import { TodoItem } from './TodoItem';
import { ClipboardList } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  categoryFilter: Category | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
}

export function TodoList({ todos, filter, categoryFilter, onToggle, onDelete, onUpdate }: TodoListProps) {
  const filteredTodos = useMemo(() => {
    let result = todos;
    
    // Filter by status
    switch (filter) {
      case 'active':
        result = result.filter(t => !t.completed);
        break;
      case 'completed':
        result = result.filter(t => t.completed);
        break;
    }
    
    // Filter by category
    if (categoryFilter) {
      result = result.filter(t => t.category === categoryFilter);
    }
    
    return result;
  }, [todos, filter, categoryFilter]);

  if (filteredTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-muted/50 mb-4">
          <ClipboardList className="h-12 w-12 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-1">
          {categoryFilter 
            ? 'No tasks in this category' 
            : filter === 'all' 
              ? 'No tasks yet' 
              : filter === 'active' 
                ? 'No active tasks' 
                : 'No completed tasks'}
        </h3>
        <p className="text-sm text-muted-foreground/70">
          {filter === 'all' && !categoryFilter ? 'Add your first task to get started!' : 'Keep going, you\'re doing great!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
