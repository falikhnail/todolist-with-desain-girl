export type Priority = 'low' | 'medium' | 'high';

export type Category = 'work' | 'personal' | 'shopping' | 'health' | 'selfcare' | 'goals';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: Date;
  dueDate?: Date;
}

export type FilterType = 'all' | 'active' | 'completed';

export const categoryConfig: Record<Category, { label: string; emoji: string; color: string; bg: string }> = {
  work: { label: 'Work', emoji: '💼', color: 'text-chart-3', bg: 'bg-chart-3/15' },
  personal: { label: 'Personal', emoji: '💖', color: 'text-chart-1', bg: 'bg-chart-1/15' },
  shopping: { label: 'Shopping', emoji: '🛍️', color: 'text-chart-2', bg: 'bg-chart-2/15' },
  health: { label: 'Health', emoji: '🌸', color: 'text-chart-4', bg: 'bg-chart-4/15' },
  selfcare: { label: 'Self Care', emoji: '✨', color: 'text-accent-foreground', bg: 'bg-accent' },
  goals: { label: 'Goals', emoji: '🎯', color: 'text-chart-5', bg: 'bg-chart-5/15' },
};
