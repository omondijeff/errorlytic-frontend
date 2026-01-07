import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarIcon,
    ClockIcon,
    TruckIcon,
    WrenchScrewdriverIcon,
    ChatBubbleBottomCenterTextIcon,
    BuildingOfficeIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    CheckIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/apiClient';
import { useBooking, type Booking } from '../../context/BookingContext';
import { useNotification } from '../../context/NotificationContext';

interface BookingFormProps {
    onSuccess?: (booking: Booking) => void;
    onCancel?: () => void;
    initialData?: Partial<Booking>;
}

const serviceTypes = [
    { id: 'inspection', name: 'Inspection', icon: CheckIcon, description: 'General vehicle health check' },
    { id: 'repair', name: 'Repair', icon: WrenchScrewdriverIcon, description: 'Fix known mechanical issues' },
    { id: 'maintenance', name: 'Maintenance', icon: ClockIcon, description: 'Routine service & oil change' },
    { id: 'diagnostic', name: 'Diagnostic', icon: ChatBubbleBottomCenterTextIcon, description: 'Identify warning lights' },
];

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, onCancel, initialData }) => {
    const { createBooking, updateBooking } = useBooking();
    const { addNotification } = useNotification();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [garages, setGarages] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        vehicleId: initialData?.vehicleId?._id || '',
        garageId: initialData?.garageId?._id || '',
        serviceType: initialData?.serviceType || 'inspection',
        scheduledDate: initialData?.scheduledDate ? new Date(initialData.scheduledDate).toISOString().split('T')[0] : '',
        scheduledTime: initialData?.scheduledDate ? new Date(initialData.scheduledDate).toTimeString().slice(0, 5) : '09:00',
        duration: initialData?.duration || 60,
        notes: initialData?.notes || '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehiclesRes, garagesRes] = await Promise.all([
                    api.get('/vehicles'),
                    api.get('/organizations/garages'),
                ]);
                setVehicles(vehiclesRes.data.data);
                setGarages(garagesRes.data.data);

                // If only one vehicle/garage, auto-select
                if (vehiclesRes.data.data.length === 1 && !formData.vehicleId) {
                    setFormData(prev => ({ ...prev, vehicleId: vehiclesRes.data.data[0].id }));
                }
                if (garagesRes.data.data.length === 1 && !formData.garageId) {
                    setFormData(prev => ({ ...prev, garageId: garagesRes.data.data[0]._id }));
                }
            } catch (err) {
                console.error('Failed to fetch form data:', err);
                addNotification('Failed to load vehicles or garages', 'error');
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const scheduledDateObj = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);

            const payload = {
                ...formData,
                scheduledDate: scheduledDateObj.toISOString(),
            };

            let result;
            if (initialData?._id) {
                result = await updateBooking(initialData._id, payload as any);
                addNotification('Booking updated successfully', 'success');
            } else {
                result = await createBooking(payload as any);
                addNotification('Booking scheduled successfully', 'success');
            }

            if (onSuccess) onSuccess(result);
        } catch (err: any) {
            addNotification(err.response?.data?.detail || 'Failed to save booking', 'error');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle</label>
                            <div className="grid grid-cols-1 gap-3">
                                {vehicles.map((vehicle) => (
                                    <label
                                        key={vehicle.id}
                                        className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all ${formData.vehicleId === vehicle.id
                                                ? 'border-[#EA6A47] bg-red-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            className="sr-only"
                                            name="vehicleId"
                                            value={vehicle.id}
                                            checked={formData.vehicleId === vehicle.id}
                                            onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                                        />
                                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                                            <TruckIcon className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{vehicle.carType}</p>
                                            <p className="text-sm text-gray-500">{vehicle.registrationNo}</p>
                                        </div>
                                        {formData.vehicleId === vehicle.id && (
                                            <div className="absolute top-4 right-4 text-[#EA6A47]">
                                                <CheckIcon className="h-6 w-6" />
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Garage</label>
                            <div className="grid grid-cols-1 gap-3">
                                {garages.map((garage) => (
                                    <label
                                        key={garage._id}
                                        className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all ${formData.garageId === garage._id
                                                ? 'border-[#EA6A47] bg-red-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            className="sr-only"
                                            name="garageId"
                                            value={garage._id}
                                            checked={formData.garageId === garage._id}
                                            onChange={(e) => setFormData({ ...formData, garageId: e.target.value })}
                                        />
                                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                                            <BuildingOfficeIcon className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{garage.name}</p>
                                            <p className="text-sm text-gray-500">{garage.contact?.address || garage.country}</p>
                                        </div>
                                        {formData.garageId === garage._id && (
                                            <div className="absolute top-4 right-4 text-[#EA6A47]">
                                                <CheckIcon className="h-6 w-6" />
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">What service do you need?</label>
                            <div className="grid grid-cols-2 gap-4">
                                {serviceTypes.map((type) => (
                                    <label
                                        key={type.id}
                                        className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all h-full ${formData.serviceType === type.id
                                                ? 'border-[#EA6A47] bg-red-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            className="sr-only"
                                            name="serviceType"
                                            value={type.id}
                                            checked={formData.serviceType === type.id}
                                            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
                                        />
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${formData.serviceType === type.id ? 'bg-[#EA6A47] text-white' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            <type.icon className="h-6 w-6" />
                                        </div>
                                        <p className="font-bold text-gray-900">{type.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Briefly describe the issue or service requirements..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent outline-none transition-all resize-none h-32"
                            />
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                                <input
                                    type="time"
                                    value={formData.scheduledTime}
                                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (minutes)</label>
                            <select
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent outline-none transition-all"
                            >
                                <option value={30}>30 minutes</option>
                                <option value={60}>1 hour</option>
                                <option value={90}>1.5 hours</option>
                                <option value={120}>2 hours</option>
                                <option value={180}>3 hours</option>
                                <option value={240}>4 hours</option>
                                <option value={480}>Full day (8 hours)</option>
                            </select>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mt-8">
                            <h4 className="font-bold text-[#EA6A47] mb-2 flex items-center">
                                <CalendarIcon className="h-5 w-5 mr-2" />
                                Booking Summary
                            </h4>
                            <div className="space-y-2 text-sm text-gray-700">
                                <p><span className="font-medium">Vehicle:</span> {vehicles.find(v => v.id === formData.vehicleId)?.carType || 'None selected'}</p>
                                <p><span className="font-medium">Garage:</span> {garages.find(g => g._id === formData.garageId)?.name || 'None selected'}</p>
                                <p><span className="font-medium">Service:</span> {serviceTypes.find(s => s.id === formData.serviceType)?.name}</p>
                                <p><span className="font-medium">Scheduled:</span> {formData.scheduledDate ? `${formData.scheduledDate} at ${formData.scheduledTime}` : 'Date not set'}</p>
                            </div>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-black">
                        {initialData?._id ? 'Update Booking' : 'Schedule Service'}
                    </h2>
                    <p className="text-gray-500">Step {step} of 3</p>
                </div>
                <div className="flex space-x-2">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 w-8 rounded-full transition-all duration-300 ${s <= step ? 'bg-[#EA6A47]' : 'bg-gray-100'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                    <div className="min-h-[400px]">
                        {renderStep()}
                    </div>
                </AnimatePresence>

                <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={step === 1 ? onCancel : prevStep}
                        className="flex items-center px-6 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-all"
                    >
                        <ChevronLeftIcon className="h-5 w-5 mr-2" />
                        {step === 1 ? 'Cancel' : 'Previous'}
                    </button>

                    {step < 3 ? (
                        <button
                            type="button"
                            disabled={step === 1 && (!formData.vehicleId || !formData.garageId)}
                            onClick={nextStep}
                            className="flex items-center px-8 py-3 bg-[#EA6A47] text-white font-bold rounded-xl hover:bg-[#d65d3e] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
                        >
                            Continue
                            <ChevronRightIcon className="h-5 w-5 ml-2" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={loading || !formData.scheduledDate}
                            className={`flex items-center px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200 ${loading ? 'animate-pulse' : ''
                                }`}
                        >
                            {loading ? 'Scheduling...' : 'Confirm Booking'}
                            {!loading && <CheckIcon className="h-5 w-5 ml-2" />}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
