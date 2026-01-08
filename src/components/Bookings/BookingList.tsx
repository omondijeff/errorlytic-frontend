import React from 'react';
import { motion } from 'framer-motion';
import {
    CalendarIcon,
    ClockIcon,
    TruckIcon,
    MapPinIcon,
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import type { Booking } from '../../context/BookingContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface BookingListProps {
    bookings: Booking[];
    onCancel: (booking: Booking) => void;
    onConfirm?: (booking: Booking) => void;
    onView?: (booking: Booking) => void;
}

const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const BookingList: React.FC<BookingListProps> = ({ bookings, onCancel, onConfirm, onView }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const isGarage = user?.role === 'garage_user' || user?.role === 'garage_admin';

    if (bookings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No bookings found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking, index) => (
                <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div className="flex items-start space-x-4">
                        <div className="h-12 w-12 bg-[#EA6A47] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <TruckIcon className="h-6 w-6 text-[#EA6A47]" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-bold text-gray-900">
                                    {booking.vehicleId.make} {booking.vehicleId.model}
                                </h3>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[booking.status]}`}>
                                    {booking.status.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{booking.serviceType.toUpperCase()} - {booking.vehicleId.plate}</p>

                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                                <div className="flex items-center">
                                    <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                    {new Date(booking.scheduledDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                    <ClockIcon className="h-3.5 w-3.5 mr-1" />
                                    {new Date(booking.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="flex items-center">
                                    <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                                    {isGarage ? booking.clientId.profile.name : booking.garageId.name}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
                        {onView && (
                            <button
                                onClick={() => onView(booking)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                title="View Details"
                            >
                                <InformationCircleIcon className="h-5 w-5" />
                            </button>
                        )}

                        {isGarage && booking.status === 'pending' && onConfirm && (
                            <button
                                onClick={() => onConfirm(booking)}
                                className="flex items-center px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-all shadow-sm"
                            >
                                <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                                Confirm
                            </button>
                        )}

                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <button
                                onClick={() => onCancel(booking)}
                                className="flex items-center px-4 py-2 bg-red-50 text-red-500 text-xs font-bold rounded-lg hover:bg-red-100 transition-all"
                            >
                                <XCircleIcon className="h-4 w-4 mr-1.5" />
                                Cancel
                            </button>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default BookingList;
