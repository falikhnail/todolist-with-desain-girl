import { useState, useEffect } from 'react';
import { Todo, Priority, Category, SubTask } from '@/types/todo';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch todos from database
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTodos: Todo[] = (data || []).map((todo) => ({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        priority: todo.priority as Priority,
        category: todo.category as Category,
        createdAt: new Date(todo.created_at),
        dueDate: todo.due_date ? new Date(todo.due_date) : undefined,
        subtasks: (todo.subtasks as unknown as SubTask[]) || [],
      }));

      setTodos(formattedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string, priority: Priority = 'medium', category: Category = 'personal', dueDate?: Date) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert({
          title: title.trim(),
          priority,
          category,
          due_date: dueDate?.toISOString() || null,
          subtasks: [] as unknown as Json,
        })
        .select()
        .single();

      if (error) throw error;

      const newTodo: Todo = {
        id: data.id,
        title: data.title,
        completed: data.completed,
        priority: data.priority as Priority,
        category: data.category as Category,
        createdAt: new Date(data.created_at),
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        subtasks: (data.subtasks as unknown as SubTask[]) || [],
      };

      setTodos(prev => [newTodo, ...prev]);
      toast.success('Task berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Gagal menambahkan task');
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;

      setTodos(prev =>
        prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error('Gagal mengupdate task');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(prev => prev.filter(t => t.id !== id));
      toast.success('Task berhasil dihapus');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Gagal menghapus task');
    }
  };

  const updateTodo = async (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate?.toISOString() || null;
      if (updates.subtasks !== undefined) dbUpdates.subtasks = updates.subtasks as unknown as Json;

      const { error } = await supabase
        .from('todos')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setTodos(prev =>
        prev.map(t => t.id === id ? { ...t, ...updates } : t)
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Gagal mengupdate task');
    }
  };

  const addSubtask = async (todoId: string, title: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    const newSubtask: SubTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
    };

    const updatedSubtasks = [...todo.subtasks, newSubtask];

    try {
      const { error } = await supabase
        .from('todos')
        .update({ subtasks: updatedSubtasks as unknown as Json })
        .eq('id', todoId);

      if (error) throw error;

      setTodos(prev =>
        prev.map(t => t.id === todoId ? { ...t, subtasks: updatedSubtasks } : t)
      );
    } catch (error) {
      console.error('Error adding subtask:', error);
      toast.error('Gagal menambahkan subtask');
    }
  };

  const toggleSubtask = async (todoId: string, subtaskId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    const updatedSubtasks = todo.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    try {
      const { error } = await supabase
        .from('todos')
        .update({ subtasks: updatedSubtasks as unknown as Json })
        .eq('id', todoId);

      if (error) throw error;

      setTodos(prev =>
        prev.map(t => t.id === todoId ? { ...t, subtasks: updatedSubtasks } : t)
      );
    } catch (error) {
      console.error('Error toggling subtask:', error);
      toast.error('Gagal mengupdate subtask');
    }
  };

  const deleteSubtask = async (todoId: string, subtaskId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    const updatedSubtasks = todo.subtasks.filter(st => st.id !== subtaskId);

    try {
      const { error } = await supabase
        .from('todos')
        .update({ subtasks: updatedSubtasks as unknown as Json })
        .eq('id', todoId);

      if (error) throw error;

      setTodos(prev =>
        prev.map(t => t.id === todoId ? { ...t, subtasks: updatedSubtasks } : t)
      );
    } catch (error) {
      console.error('Error deleting subtask:', error);
      toast.error('Gagal menghapus subtask');
    }
  };

  const clearCompleted = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);
    
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .in('id', completedIds);

      if (error) throw error;

      setTodos(prev => prev.filter(t => !t.completed));
      toast.success('Task selesai berhasil dihapus');
    } catch (error) {
      console.error('Error clearing completed:', error);
      toast.error('Gagal menghapus task selesai');
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.filter(t => !t.completed).length;

  return {
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
  };
}
