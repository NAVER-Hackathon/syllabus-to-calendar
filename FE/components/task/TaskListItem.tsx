'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, FileText, GraduationCap, Flag, AlertCircle, Link2 } from 'lucide-react';
import { COURSE_ICONS } from '@/constants/course-icons';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface TaskListItemProps {
  task: Task;
  onTaskClick: () => void;
  onStatusChange?: (status: 'pending' | 'in-progress' | 'completed') => void;
}

export function TaskListItem({ task, onTaskClick, onStatusChange }: TaskListItemProps) {
  const dueDate = new Date(task.due_date);
  const now = new Date();
  const isOverdue = dueDate < now && task.status !== 'completed';
  const isDueToday = dueDate.toDateString() === now.toDateString();
  const isDueTomorrow = dueDate.toDateString() === new Date(now.getTime() + 86400000).toDateString();

  // Type icons
  const typeIcons = {
    assignment: FileText,
    exam: GraduationCap,
    milestone: Flag,
  };

  const TypeIcon = typeIcons[task.type];

  // Priority flag colors - monochromatic
  const priorityFlagColors = {
    low: 'text-gray-300',
    medium: 'text-gray-500',
    high: 'text-gray-700',
  };

  const formatDate = (date: Date) => {
    if (isDueToday) return 'Today';
    if (isDueTomorrow) return 'Tomorrow';
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    // For dates within 7 days, show weekday
    const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays <= 7) {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
      });
    }
    
    // For dates beyond 7 days, show actual date
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange && task.type === 'assignment') {
      // Cycle through statuses: pending -> in-progress -> completed -> pending
      const statusOrder: ('pending' | 'in-progress' | 'completed')[] = ['pending', 'in-progress', 'completed'];
      const currentIndex = statusOrder.indexOf(task.status);
      const nextIndex = (currentIndex + 1) % statusOrder.length;
      onStatusChange(statusOrder[nextIndex]);
    }
  };

  // Convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <tr 
      className={cn(
        "hover:bg-gray-50/50 transition-colors cursor-pointer group",
        task.status === 'completed' && "opacity-60 bg-gray-50/30",
        isOverdue && "bg-red-50/30"
      )}
      onClick={onTaskClick}
    >
      {/* Checkbox */}
      <td className="px-4 py-2.5">
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={task.status === 'completed'}
            onCheckedChange={(checked) => {
              if (onStatusChange && task.type === 'assignment') {
                onStatusChange(checked ? 'completed' : 'pending');
              }
            }}
            className="cursor-pointer"
          />
        </div>
      </td>

      {/* Name */}
      <td className="px-4 py-2.5 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <TypeIcon className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
          <span className={cn(
            "text-sm font-medium text-gray-900 truncate",
            task.status === 'completed' && "line-through text-gray-500"
          )}>
            {task.title}
          </span>
          {task.description && (
            <Link2 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1" />
          )}
        </div>
      </td>

      {/* Lists (Course) */}
      <td className="px-4 py-2.5 hidden sm:table-cell overflow-hidden">
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700 truncate max-w-full">
          {task.course_name}
        </span>
      </td>

      {/* Due Date */}
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          {isOverdue && (
            <AlertCircle className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
          )}
          <span className={cn(
            "text-sm whitespace-nowrap",
            isOverdue && "text-gray-900 font-semibold",
            isDueToday && "text-gray-800 font-medium",
            !isOverdue && !isDueToday && "text-gray-600"
          )}>
            {formatDate(dueDate)}
          </span>
        </div>
      </td>

      {/* Priority */}
      <td className="px-4 py-2.5 hidden md:table-cell">
        <div className="flex items-center justify-center">
          {task.type === 'assignment' ? (
            <Flag className={cn("w-4 h-4", priorityFlagColors[task.priority])} />
          ) : (
            <span className="text-gray-300 text-sm">—</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={handleStatusClick}
          className={cn(
            "h-6 px-2.5 text-xs font-medium rounded-full border transition-all",
            task.status === 'pending' && "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
            task.status === 'in-progress' && "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200",
            task.status === 'completed' && "bg-gray-200 border-gray-300 text-gray-900 hover:bg-gray-300",
            task.type !== 'assignment' && "cursor-default bg-gray-50 border-gray-200 text-gray-500"
          )}
          disabled={task.type !== 'assignment'}
        >
          {task.status === 'in-progress' ? 'In Progress' : task.status === 'completed' ? 'Done' : 'To Do'}
        </Button>
      </td>
    </tr>
  );
}

