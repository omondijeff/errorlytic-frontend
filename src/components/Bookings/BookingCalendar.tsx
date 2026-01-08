import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import { startOfWeek } from 'date-fns';
import { getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { Booking } from '../../context/BookingContext';
import type { RootState } from '../../store';
import api from '../../services/apiClient';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface GoogleCalendarEvent {
    id: string;
    title: string;
    description?: string;
    start: string;
    end: string;
    location?: string;
    htmlLink?: string;
    isAllDay: boolean;
    source: 'google';
}

interface BookingCalendarProps {
    bookings: Booking[];
    onSelectEvent: (booking: Booking) => void;
    onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
    bookings,
    onSelectEvent,
    onSelectSlot,
}) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[]>([]);
    const [loadingGoogleEvents, setLoadingGoogleEvents] = useState(false);

    // Fetch Google Calendar events if connected
    useEffect(() => {
        const fetchGoogleEvents = async () => {
            if (!user?.googleCalendar?.isConnected) return;

            setLoadingGoogleEvents(true);
            try {
                const response = await api.get('/auth/google/calendar/events');
                if (response.data?.success) {
                    setGoogleEvents(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch Google Calendar events:', error);
            } finally {
                setLoadingGoogleEvents(false);
            }
        };

        fetchGoogleEvents();
    }, [user?.googleCalendar?.isConnected]);

    // Combine booking events with Google Calendar events
    const bookingEvents = bookings.map((booking) => ({
        id: booking._id,
        title: `${booking.serviceType.toUpperCase()} - ${booking.vehicleId.make} ${booking.vehicleId.model}`,
        start: new Date(booking.scheduledDate),
        end: new Date(new Date(booking.scheduledDate).getTime() + booking.duration * 60000),
        resource: booking,
        source: 'booking' as const,
    }));

    const googleCalendarEvents = googleEvents.map((event) => ({
        id: event.id,
        title: event.title || '(No title)',
        start: new Date(event.start),
        end: new Date(event.end),
        resource: event,
        source: 'google' as const,
    }));

    const allEvents = [...bookingEvents, ...googleCalendarEvents];

    const eventStyleGetter = (event: any) => {
        // Google Calendar events - show in a different color
        if (event.source === 'google') {
            return {
                style: {
                    backgroundColor: '#4285f4', // Google blue
                    borderRadius: '8px',
                    opacity: 0.7,
                    color: 'white',
                    border: '2px dashed #2563eb',
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    padding: '2px 6px',
                },
            };
        }

        // Booking events
        const status = event.resource.status;
        let backgroundColor = '#3b82f6'; // blue (confirmed)

        if (status === 'pending') backgroundColor = '#f59e0b'; // amber
        if (status === 'completed') backgroundColor = '#10b981'; // green
        if (status === 'cancelled') backgroundColor = '#ef4444'; // red
        if (status === 'in_progress') backgroundColor = '#8b5cf6'; // purple

        return {
            style: {
                backgroundColor,
                borderRadius: '8px',
                opacity: 0.8,
                color: 'white',
                border: 'none',
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: '500',
                padding: '2px 6px',
            },
        };
    };

    const handleSelectEvent = (event: any) => {
        if (event.source === 'google') {
            // For Google events, open in Google Calendar
            if (event.resource.htmlLink) {
                window.open(event.resource.htmlLink, '_blank');
            }
        } else {
            onSelectEvent(event.resource as Booking);
        }
    };

    return (
        <div className="h-[700px] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all">
            {/* Legend */}
            {user?.googleCalendar?.isConnected && (
                <div className="flex items-center gap-4 mb-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-[#EA6A47]"></span>
                        <span className="text-gray-600">Errorlytic Bookings</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-[#4285f4] border border-dashed border-blue-600"></span>
                        <span className="text-gray-600">Google Calendar</span>
                        {loadingGoogleEvents && <span className="text-gray-400 italic">(Loading...)</span>}
                    </div>
                </div>
            )}

            <Calendar
                localizer={localizer}
                events={allEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: user?.googleCalendar?.isConnected ? 'calc(100% - 32px)' : '100%' }}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={onSelectSlot}
                selectable
                views={['month', 'week', 'day', 'agenda']}
                defaultView={Views.MONTH}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: ({ event }: { event: any }) => (
                        <div className="p-1 truncate">
                            {event.source === 'google' && <span className="mr-1">📅</span>}
                            {event.title}
                        </div>
                    ),
                }}
            />
        </div>
    );
};

export default BookingCalendar;
