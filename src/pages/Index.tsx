import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { TodoHeader } from '@/components/todo/TodoHeader';
import { AddTodoForm } from '@/components/todo/AddTodoForm';
import { TodoFilters } from '@/components/todo/TodoFilters';
import { TodoList } from '@/components/todo/TodoList';
import { FilterType, Category } from '@/types/todo';
import { Helmet } from 'react-helmet-async';
import { Heart } from 'lucide-react';

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
        <meta name="description" content="Stay organized and get things done with TaskFlow, a beautiful and elegant task management app designed for you." />
      </Helmet>
      
      <div className="min-h-screen py-8 px-4 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-xl mx-auto relative">
          <TodoHeader activeCount={activeCount} completedCount={completedCount} />
          
          <main className="glass-card rounded-3xl p-5 md:p-8">
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
          
          <footer className="mt-8 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              Made with <Heart className="h-4 w-4 text-primary fill-primary" /> for you
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;
