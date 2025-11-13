'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, BookOpen, Inbox } from 'lucide-react';
import { EventApi } from '@fullcalendar/core';

interface EventDetailPanelProps {
    event: EventApi | null; // Sự kiện được chọn
}

// Hàm helper format ngày tháng (giống như trước)
export function formatEventDate(event: EventApi): string {
    if (event.allDay) {
        return new Date(event.start || 0).toLocaleString('vi-VN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }
    return new Date(event.start || 0).toLocaleString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function EventDetailPanel({ event }: EventDetailPanelProps) {
    // --- Trường hợp 1: Chưa chọn sự kiện ---
    if (!event) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center text-center text-gray-400 h-64">
                        <Inbox className="w-12 h-12 mb-4" />
                        <p className="font-medium">No event selected</p>
                        <p className="text-sm">Click an event on the calendar to see details.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // --- Trường hợp 2: Đã chọn sự kiện ---
    const { type, courseName } = event.extendedProps;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {/* 1. Tiêu đề (Tên sự kiện) */}
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    {courseName && (
                        <p className="text-base text-gray-500">
                            {courseName}
                        </p>
                    )}
                </div>

                {/* 2. Chi tiết sự kiện */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium">
                            {formatEventDate(event)}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Tag className="w-5 h-5 text-gray-500" />
                        <Badge variant={type === 'course' ? 'default' : 'secondary'}>
                            {type === 'course' && 'Khóa học'}
                            {type === 'assignment' && 'Bài tập'}
                            {type === 'exam' && 'Kỳ thi'}
                            {type === 'class' && 'Lịch học'}
                        </Badge>
                    </div>

                    {/* (Bạn có thể thêm mô tả hoặc các nút hành động ở đây) */}
                    {/* <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-gray-500 mt-1" />
                        <p className="text-sm">Mô tả sự kiện...</p>
                    </div> */}
                </div>
            </CardContent>
        </Card>
    );
}