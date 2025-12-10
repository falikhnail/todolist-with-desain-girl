import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { TodoHeader } from '@/components/todo/TodoHeader';
import { AddTodoForm } from '@/components/todo/AddTodoForm';
import { TodoFilters } from '@/components/todo/TodoFilters';
import { TodoList } from '@/components/todo/TodoList';
import { FilterType, Category } from '@/types/todo';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    completedCount,
    activeCount,
  } = useTodos();

  return (
    <>
      <Helmet>
        <title>TaskFlow - Beautiful Task Management</title>
        <meta name="description" content="Stay organized and get things done with TaskFlow, a beautiful and responsive task management app." />
      </Helmet>
      
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-xl mx-auto">
          <TodoHeader activeCount={activeCount} completedCount={completedCount} />
          
          <main className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-border/50">
            <AddTodoForm onAdd={addTodo} />
            
            <TodoFilters
              filter={filter}
              onFilterChange={setFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              onClearCompleted={clearCompleted}
              hasCompleted={completedCount > 0}
            />
            
            <TodoList
              todos={todos}
              filter={filter}
              categoryFilter={categoryFilter}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          </main>
          
          <footer className="mt-8 text-center text-sm text-muted-foreground">
            <p>Click a task to edit • Hover to delete</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;
