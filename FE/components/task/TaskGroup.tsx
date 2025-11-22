'use client';

import { TaskListItem } from './TaskListItem';
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
      <div className="mb-6">
        {/* Group Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {title}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
              {count}
            </span>
          </div>
        </div>

        {/* Table Layout */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left w-12"></th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell w-40">Lists</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Due Date</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell w-20">Priority</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <TaskListItem
                  key={task.id}
                  task={task}
                  onTaskClick={() => handleTaskClick(task)}
                  onStatusChange={(status) => {
                    if (onStatusChange) {
                      onStatusChange(task.id, status);
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
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

