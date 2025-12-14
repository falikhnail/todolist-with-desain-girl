import { useState, useEffect } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { useReminders } from '@/hooks/useReminders';
import { TodoHeader } from '@/components/todo/TodoHeader';
import { AddTodoForm } from '@/components/todo/AddTodoForm';
import { TodoFilters } from '@/components/todo/TodoFilters';
import { TodoList } from '@/components/todo/TodoList';
import { StatsDashboard } from '@/components/todo/StatsDashboard';
import { FilterType, Category } from '@/types/todo';
import { Helmet } from 'react-helmet-async';
import { Heart, BarChart3, ListTodo, Bell } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
const {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    clearCompleted,
    completedCount,
    activeCount,
  } = useTodos();

  const { requestPermission } = useReminders(todos);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    setNotificationEnabled(granted);
    if (granted) {
      toast({
        title: "Notifikasi Aktif",
        description: "Anda akan menerima reminder untuk task dengan deadline",
      });
    } else {
      toast({
        title: "Notifikasi Ditolak",
        description: "Aktifkan notifikasi di pengaturan browser untuk menerima reminder",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

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
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="tasks" className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Statistik
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="mt-0">
                {!notificationEnabled && (
                  <div className="mb-4 p-3 bg-accent/50 rounded-xl flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Aktifkan notifikasi untuk reminder</span>
                    <Button size="sm" variant="outline" onClick={handleEnableNotifications} className="gap-2">
                      <Bell className="h-4 w-4" />
                      Aktifkan
                    </Button>
                  </div>
                )}
                
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
                  onAddSubtask={addSubtask}
                  onToggleSubtask={toggleSubtask}
                  onDeleteSubtask={deleteSubtask}
                />
              </TabsContent>
              
              <TabsContent value="stats" className="mt-0">
                <StatsDashboard todos={todos} />
              </TabsContent>
            </Tabs>
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
