'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { EventApi } from '@fullcalendar/core';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

import { EventDetailPanel } from './EventDetailPanel';

export default function CalendarPage() {
    const router = useRouter();
    const calendarRef = useRef<FullCalendar>(null);

    const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

    const handleEventClick = useCallback((clickInfo: any) => {
        console.log('Event clicked:', clickInfo.event.title);
        setSelectedEvent(clickInfo.event);
    }, []);

    const handleDateSelect = useCallback((selectInfo: any) => {
        setSelectedEvent(null); // bỏ chọn khi click ngày trống
        let calendarApi = selectInfo.view.calendar;
        calendarApi.changeView('timeGridDay', selectInfo.startStr);
    }, []);

    const handleEventDrop = useCallback((dropInfo: any) => {
        console.log('Event dropped:', dropInfo.event.title);
    }, []);

    return (
        <div className="p-6 h-screen flex flex-col">
            <div className="mb-4">
                <Button variant="ghost" size="sm" onClick={() => router.push('/courses')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Courses
                </Button>
            </div>

            <div className="flex flex-1 gap-6 min-h-0">

                <Card className="p-4 bg-white flex-[4] min-w-0">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        initialView="dayGridMonth"
                        height="100%"
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        nowIndicator={true}
                        eventClick={handleEventClick}
                        select={handleDateSelect}
                        eventDrop={handleEventDrop}
                        events={[]}

                        eventContent={(arg) => {
                            const { type, courseName } = arg.event.extendedProps;
                            return (
                                <div className="p-1 overflow-hidden text-xs">
                                    <b className="truncate block">{arg.event.title}</b>
                                    {courseName && (
                                        <span className="truncate block opacity-70">{courseName}</span>
                                    )}
                                </div>
                            );
                        }}
                    />
                </Card>
                <div className="flex-[1]">
                    <EventDetailPanel event={selectedEvent} />
                </div>
            </div>
        </div>
    );
}