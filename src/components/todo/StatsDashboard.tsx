import { useMemo } from 'react';
import { Todo, categoryConfig, Category } from '@/types/todo';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, CheckCircle2, Clock, Target } from 'lucide-react';

interface StatsDashboardProps {
  todos: Todo[];
}

export function StatsDashboard({ todos }: StatsDashboardProps) {
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Tasks by category
    const byCategory = Object.keys(categoryConfig).map(cat => {
      const catTodos = todos.filter(t => t.category === cat);
      return {
        name: categoryConfig[cat as Category].emoji + ' ' + categoryConfig[cat as Category].label,
        value: catTodos.length,
        completed: catTodos.filter(t => t.completed).length,
      };
    }).filter(c => c.value > 0);

    // Weekly data (last 7 days)
    const weeklyData = [];
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayTodos = todos.filter(t => {
        const created = new Date(t.createdAt);
        return created >= date && created < nextDate;
      });
      
      weeklyData.push({
        day: days[date.getDay()],
        created: dayTodos.length,
        completed: dayTodos.filter(t => t.completed).length,
      });
    }

    return { total, completed, active, completionRate, byCategory, weeklyData };
  }, [todos]);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--accent))'];

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Belum ada data untuk ditampilkan</p>
        <p className="text-sm">Tambahkan task untuk melihat statistik</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-accent/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-primary mb-1">
            <Target className="h-4 w-4" />
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
          <p className="text-xs text-muted-foreground">Total Tasks</p>
        </div>
        <div className="bg-chart-1/10 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-chart-1 mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-2xl font-bold">{stats.completed}</span>
          </div>
          <p className="text-xs text-muted-foreground">Selesai</p>
        </div>
        <div className="bg-chart-2/10 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-chart-2 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-2xl font-bold">{stats.active}</span>
          </div>
          <p className="text-xs text-muted-foreground">Aktif</p>
        </div>
        <div className="bg-chart-3/10 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-chart-3 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-2xl font-bold">{stats.completionRate}%</span>
          </div>
          <p className="text-xs text-muted-foreground">Completion Rate</p>
        </div>
      </div>

      {/* Category Distribution */}
      {stats.byCategory.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">📊 Tasks by Category</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.byCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.byCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {stats.byCategory.map((cat, index) => (
              <span key={cat.name} className="text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Activity */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">📈 Aktivitas Minggu Ini</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weeklyData}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number, name: string) => [value, name === 'created' ? 'Dibuat' : 'Selesai']}
              />
              <Bar dataKey="created" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="created" />
              <Bar dataKey="completed" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <span className="text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-chart-2" /> Dibuat
          </span>
          <span className="text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-chart-1" /> Selesai
          </span>
        </div>
      </div>
    </div>
  );
}
