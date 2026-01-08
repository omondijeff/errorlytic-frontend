import React from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import { startOfWeek } from 'date-fns';
import { getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { Booking } from '../../context/BookingContext';

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
    const events = bookings.map((booking) => ({
        id: booking._id,
        title: `${booking.serviceType.toUpperCase()} - ${booking.vehicleId.make} ${booking.vehicleId.model}`,
        start: new Date(booking.scheduledDate),
        end: new Date(new Date(booking.scheduledDate).getTime() + booking.duration * 60000),
        resource: booking,
    }));

    const eventStyleGetter = (event: any) => {
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

    return (
        <div className="h-[700px] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={(event) => onSelectEvent(event.resource as Booking)}
                onSelectSlot={onSelectSlot}
                selectable
                views={['month', 'week', 'day', 'agenda']}
                defaultView={Views.MONTH}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: ({ event }: { event: any }) => (
                        <div className="p-1 truncate">
                            {event.title}
                        </div>
                    ),
                }}
            />
        </div>
    );
};

export default BookingCalendar;
