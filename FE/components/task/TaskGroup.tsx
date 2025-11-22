'use client';

import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDetail } from './TaskDetail';
import { useState } from 'react';

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

interface TaskGroupProps {
  title: string;
  count: number;
  tasks: Task[];
  onTaskUpdate?: () => void;
  onStatusChange?: (taskId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  onAddTask?: () => void;
}

export function TaskGroup({ title, count, tasks, onTaskUpdate, onStatusChange, onAddTask }: TaskGroupProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = () => {
    setSelectedTask(null);
    if (onTaskUpdate) {
      onTaskUpdate();
    }
  };

  if (tasks.length === 0) return null;

  return (
    <>
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Group Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">
              {title}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
              {count}
            </span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task)}
            />
          ))}
          
          {/* Add Task Button Card */}
          <div 
            onClick={onAddTask}
            className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-white hover:border-primary/50 hover:shadow-sm transition-all duration-200 cursor-pointer min-h-[180px]"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-primary/20 transition-all duration-200 shadow-sm">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-semibold text-gray-500 group-hover:text-primary transition-colors">Add New Task</span>
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </>
  );
}

