'use client';

import { useState } from 'react';
import {
    Calendar,
    MessageSquare,
    Download,
    Settings,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Circle, ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Task {
    id: string;
    title: string;
    type: 'study' | 'assignment' | 'review';
    duration: string;
    completed: boolean;
    parentItem: string;
}

interface Week {
    weekNumber: number;
    startDate: string;
    endDate: string;
    tasks: { [day: string]: Task[] };
}

export default function PlanPage() {
    const [currentWeek, setCurrentWeek] = useState(0);
    // Mock data 
    const weeks: Week[] = [
        {
            weekNumber: 1,
            startDate: '2025-11-10',
            endDate: '2025-11-16',
            tasks: {
                'Monday': [
                    {
                        id: 't1',
                        title: 'Read Chapter 3',
                        type: 'study',
                        duration: '2h',
                        completed: false,
                        parentItem: 'Chapter 3: Data Structures'
                    }
                ],
                'Wednesday': [
                    {
                        id: 't2',
                        title: 'Work on Project Proposal - Part 1',
                        type: 'assignment',
                        duration: '3h',
                        completed: false,
                        parentItem: 'Project Proposal'
                    }
                ],
                'Friday': [
                    {
                        id: 't3',
                        title: 'Review Chapter 3 notes',
                        type: 'review',
                        duration: '1h',
                        completed: false,
                        parentItem: 'Chapter 3: Data Structures'
                    },
                    {
                        id: 't4',
                        title: 'Work on Project Proposal - Part 2',
                        type: 'assignment',
                        duration: '2h',
                        completed: false,
                        parentItem: 'Project Proposal'
                    }
                ],
                'Sunday': [
                    {
                        id: 'cn',
                        title: 'Review Chapter 4 notes',
                        type: 'review',
                        duration: '2h',
                        completed: true,
                        parentItem: 'Chapter 4:Data Scient'
                    }
                ],
            }
        },
        {
            weekNumber: 2,
            startDate: '2025-11-17',
            endDate: '2025-11-23',
            tasks: {
                'Monday': [
                    {
                        id: 't5',
                        title: 'Final review Project Proposal',
                        type: 'assignment',
                        duration: '2h',
                        completed: false,
                        parentItem: 'Project Proposal'
                    }
                ],
                'Tuesday': [
                    {
                        id: 't6',
                        title: 'Start Midterm prep - Chapter 1',
                        type: 'study',
                        duration: '2h',
                        completed: false,
                        parentItem: 'Midterm Exam'
                    }
                ],
            }
        }
    ];

    const week = weeks[currentWeek];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const router = useRouter();
    const toggleTask = (taskId: string) => {
        console.log('Toggle task:', taskId);
    };

    const getTaskColor = (type: string) => {
        switch (type) {
            case 'study':
                return 'border-l-blue-500 bg-blue-50/50';
            case 'assignment':
                return 'border-l-orange-500 bg-orange-50/50';
            case 'review':
                return 'border-l-green-500 bg-green-50/50';
            default:
                return 'border-l-gray-500 bg-gray-50/50';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <h1 className="text-2xl font-bold text-slate-900">My Study Plan</h1>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" size="icon">
                                <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Download className="h-4 w-4" />
                                Export ICS
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="flex gap-6">
                    <div className={"flex-1"}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Week {week.weekNumber}</CardTitle>
                                        <CardDescription>
                                            {new Date(week.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(week.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                                            disabled={currentWeek === 0}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setCurrentWeek(Math.min(weeks.length - 1, currentWeek + 1))}
                                            disabled={currentWeek === weeks.length - 1}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {days.map(day => (
                                        <div key={day}>
                                            <h3 className="font-semibold text-slate-900 mb-3">{day}</h3>
                                            {week.tasks[day] && week.tasks[day].length > 0 ? (
                                                <div className="space-y-2">
                                                    {week.tasks[day].map(task => (
                                                        <div
                                                            key={task.id}
                                                            className={`p-4 border-l-4 rounded-lg ${getTaskColor(task.type)} transition-all hover:shadow-sm`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <button
                                                                    onClick={() => toggleTask(task.id)}
                                                                    className="mt-0.5"
                                                                >
                                                                    {task.completed ? (
                                                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                                    ) : (
                                                                        <Circle className="h-5 w-5 text-slate-400" />
                                                                    )}
                                                                </button>
                                                                <div className="flex-1">
                                                                    <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                                                        {task.title}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Badge variant="outline" className="text-xs capitalize">
                                                                            {task.type}
                                                                        </Badge>
                                                                        <span className="text-xs text-slate-500">{task.duration}</span>
                                                                        <span className="text-xs text-slate-400">•</span>
                                                                        <span className="text-xs text-slate-500">{task.parentItem}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-400 italic">No tasks scheduled</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
