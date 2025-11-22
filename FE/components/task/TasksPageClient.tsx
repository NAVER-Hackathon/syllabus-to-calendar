'use client';

import { useState, useEffect } from 'react';
import { TaskList } from './TaskList';
import { TaskFilters } from './TaskFilters';
import { TaskSort, SortField, SortDirection } from './TaskSort';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { TaskListSkeleton } from './TaskListSkeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  type: 'assignment' | 'exam' | 'milestone';
  course_id: string;
  course_name: string;
  course_color: string;
  course_icon: string;
  location?: string;
  time?: string;
  estimated_hours?: number;
}

interface Course {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

interface TasksPageClientProps {
  initialTasks: Task[];
  initialStats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
  courses: Course[];
}

export function TasksPageClient({ initialTasks, initialStats, courses }: TasksPageClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Filter and sort state
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [courseFilter, setCourseFilter] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('due_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Load filters from session storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStatus = sessionStorage.getItem('taskStatusFilter');
      const savedCourses = sessionStorage.getItem('taskCourseFilter');
      const savedSortField = sessionStorage.getItem('taskSortField');
      const savedSortDirection = sessionStorage.getItem('taskSortDirection');
      
      if (savedStatus) setStatusFilter(savedStatus as any);
      if (savedCourses) setCourseFilter(JSON.parse(savedCourses));
      if (savedSortField) setSortField(savedSortField as SortField);
      if (savedSortDirection) setSortDirection(savedSortDirection as SortDirection);
    }
  }, []);

  // Save filters to session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('taskStatusFilter', statusFilter);
      sessionStorage.setItem('taskCourseFilter', JSON.stringify(courseFilter));
      sessionStorage.setItem('taskSortField', sortField);
      sessionStorage.setItem('taskSortDirection', sortDirection);
    }
  }, [statusFilter, courseFilter, sortField, sortDirection]);

  const refreshTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (courseFilter.length > 0) {
        params.append('courses', courseFilter.join(','));
      }
      params.append('sort', sortField);
      params.append('direction', sortDirection);

      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data.tasks);
      setStats(data.stats);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh tasks when filters or sort change
  useEffect(() => {
    refreshTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, courseFilter, sortField, sortDirection]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Tasks
            </h1>
            <p className="text-gray-500 max-w-2xl leading-relaxed">
              {stats.total > 0
                ? `You have ${stats.total} ${stats.total === 1 ? 'task' : 'tasks'} scheduled. Stay organized and track your progress across all your courses.`
                : 'Welcome to your task board. Upload a syllabus or add a milestone to start building your plan.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/chat">
              <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-200 shadow-sm transition-all hover:shadow-md">
                Ask Assistant
              </Button>
            </Link>
            <Button 
              className="gap-2 shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90" 
              onClick={() => router.push('/courses/new')}
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Stats Overview (Optional - can be expanded) */}
        {stats.total > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-sm font-medium text-gray-500 mb-1">Total Tasks</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-sm font-medium text-amber-600 mb-1">Pending</div>
              <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-sm font-medium text-blue-600 mb-1">In Progress</div>
              <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-sm font-medium text-emerald-600 mb-1">Completed</div>
              <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
            </div>
          </div>
        )}

        {/* Filters and Sort Bar */}
        {stats.total > 0 && (
          <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200/60 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1 w-full lg:w-auto">
                <TaskFilters
                  statusFilter={statusFilter}
                  courseFilter={courseFilter}
                  courses={courses}
                  onStatusChange={setStatusFilter}
                  onCourseChange={setCourseFilter}
                  stats={{
                    pending: stats.pending,
                    inProgress: stats.inProgress,
                    completed: stats.completed,
                  }}
                />
              </div>
              <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                <div className="h-8 w-px bg-gray-200 mx-2 hidden lg:block" />
                <TaskSort
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={(field, direction) => {
                    setSortField(field);
                    setSortDirection(direction);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="min-h-[400px]">
          {loading ? (
            <TaskListSkeleton count={6} />
          ) : (
            <TaskList 
              tasks={tasks} 
              onTaskUpdate={refreshTasks} 
              loading={loading}
              onAddTask={() => router.push('/courses/new')}
              onStatusChange={async (taskId, status) => {
                try {
                  const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status }),
                  });
                  if (response.ok) {
                    refreshTasks();
                  }
                } catch (error) {
                  console.error('Error updating task status:', error);
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

