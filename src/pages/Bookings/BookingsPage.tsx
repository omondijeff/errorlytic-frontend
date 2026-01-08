import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
    CalendarIcon,
    ListBulletIcon,
    PlusIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowPathIcon,
    FunnelIcon,
    TruckIcon,
} from '@heroicons/react/24/outline';
import type { RootState } from '../../store';
import { useBooking, type Booking } from '../../context/BookingContext';
import { useNotification } from '../../context/NotificationContext';
import BookingCalendar from '../../components/Bookings/BookingCalendar';
import BookingList from '../../components/Bookings/BookingList';
import BookingForm from '../../components/Bookings/BookingForm';
import GoogleCalendarConnect from '../../components/Bookings/GoogleCalendarConnect';
import ModernButton from '../../components/UI/ModernButton';

const BookingsPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { bookings, loading, fetchBookings, confirmBooking, cancelBooking } = useBooking();
    const { addNotification } = useNotification();
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [showForm, setShowForm] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Handle OAuth callback
    useEffect(() => {
        const calendarConnected = searchParams.get('calendar_connected');
        const error = searchParams.get('error');

        if (calendarConnected === 'true') {
            addNotification('Google Calendar connected successfully! Your bookings will now sync automatically.', 'success');
            // Clear the URL params
            setSearchParams({});
        } else if (error === 'calendar_connection_failed') {
            addNotification('Failed to connect Google Calendar. Please try again.', 'error');
            setSearchParams({});
        }
    }, [searchParams]);

    useEffect(() => {
        fetchBookings(filterStatus !== 'all' ? { status: filterStatus } : undefined);
    }, [filterStatus]);

    const handleCreateSuccess = () => {
        setShowForm(false);
        fetchBookings();
    };

    const handleCancelBooking = async (booking: Booking) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await cancelBooking(booking._id, 'Client requested cancellation');
            } catch (err) {
                console.error('Failed to cancel:', err);
            }
        }
    };

    const handleConfirmBooking = async (booking: Booking) => {
        try {
            await confirmBooking(booking._id);
        } catch (err) {
            console.error('Failed to confirm:', err);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight">Service Bookings</h1>
                    <p className="text-gray-500 mt-1">Manage your vehicle inspections and repairs</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="bg-white p-1 rounded-xl border border-gray-200 flex">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'calendar' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Calendar
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <ListBulletIcon className="h-4 w-4 mr-2" />
                            List View
                        </button>
                    </div>

                    <ModernButton
                        onClick={() => setShowForm(true)}
                        className="flex items-center px-6 py-2.5 bg-[#EA6A47] text-white rounded-xl font-bold shadow-lg shadow-orange-100 hover:scale-105"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        New Booking
                    </ModernButton>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-64 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                            <FunnelIcon className="h-4 w-4 mr-2 text-gray-400" />
                            Filter by Status
                        </h3>
                        <div className="space-y-2">
                            {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filterStatus === status ? 'bg-orange-50 text-[#EA6A47] font-bold' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <GoogleCalendarConnect />
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {loading && !bookings.length ? (
                        <div className="flex items-center justify-center h-[600px] bg-white rounded-2xl border border-gray-100 italic text-gray-400">
                            <ArrowPathIcon className="h-8 w-8 animate-spin mr-3" />
                            Loading bookings...
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {viewMode === 'calendar' ? (
                                <motion.div
                                    key="calendar"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                >
                                    <BookingCalendar
                                        bookings={bookings}
                                        onSelectEvent={(booking) => setSelectedBooking(booking)}
                                        onSelectSlot={() => setShowForm(true)}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <BookingList
                                        bookings={bookings}
                                        onCancel={handleCancelBooking}
                                        onConfirm={handleConfirmBooking}
                                        onView={(booking) => setSelectedBooking(booking)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Booking Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative z-10 my-8"
                        >
                            <BookingForm
                                onSuccess={handleCreateSuccess}
                                onCancel={() => setShowForm(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Booking Details Modal (Can be expanded later) */}
            <AnimatePresence>
                {selectedBooking && !showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBooking(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                                    <p className={`mt-1 text-sm font-bold uppercase tracking-wider ${selectedBooking.status === 'pending' ? 'text-amber-500' : 'text-blue-500'
                                        }`}>
                                        {selectedBooking.status.replace('_', ' ')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-all"
                                >
                                    <ChevronRightIcon className="h-6 w-6 text-gray-400 rotate-90" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm">
                                        <TruckIcon className="h-6 w-6 text-[#EA6A47]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-tight">Vehicle</p>
                                        <p className="font-bold text-gray-900">{selectedBooking.vehicleId.make} {selectedBooking.vehicleId.model} ({selectedBooking.vehicleId.plate})</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-tight mb-1">Date</p>
                                        <p className="font-bold text-gray-900">{new Date(selectedBooking.scheduledDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-tight mb-1">Time</p>
                                        <p className="font-bold text-gray-900">{new Date(selectedBooking.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-tight mb-1">Garage</p>
                                    <p className="font-bold text-gray-900">{selectedBooking.garageId.name}</p>
                                    <p className="text-sm text-gray-500">{selectedBooking.garageId.contact?.email}</p>
                                </div>

                                {selectedBooking.notes && (
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-tight mb-1">Notes</p>
                                        <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                                <ModernButton
                                    onClick={() => setSelectedBooking(null)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200"
                                >
                                    Close
                                </ModernButton>
                                {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                                    <ModernButton
                                        onClick={() => {
                                            handleCancelBooking(selectedBooking);
                                            setSelectedBooking(null);
                                        }}
                                        className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 border border-red-100"
                                    >
                                        Cancel Booking
                                    </ModernButton>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookingsPage;
