import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CalendarIcon,
    ClockIcon,
    WrenchScrewdriverIcon,
    CheckCircleIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    TruckIcon,
} from '@heroicons/react/24/outline';
import { Helmet } from 'react-helmet-async';

interface GarageInfo {
    _id: string;
    name: string;
    contact?: {
        email?: string;
        phone?: string;
        address?: string;
    };
}

interface QuotationInfo {
    _id: string;
    vehicleInfo?: {
        make?: string;
        model?: string;
        year?: number;
        plate?: string;
    };
    totals?: {
        grand: number;
    };
    currency?: string;
}

const serviceTypes = [
    { id: 'repair', name: 'Repair Service', icon: WrenchScrewdriverIcon, description: 'Based on your quotation' },
    { id: 'inspection', name: 'Inspection', icon: CheckCircleIcon, description: 'General vehicle check' },
    { id: 'maintenance', name: 'Maintenance', icon: ClockIcon, description: 'Routine service' },
    { id: 'diagnostic', name: 'Diagnostic', icon: TruckIcon, description: 'Full diagnostic scan' },
];

const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

const BookingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const quotationId = searchParams.get('quotation');
    const garageId = searchParams.get('garage');

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [garage, setGarage] = useState<GarageInfo | null>(null);
    const [quotation, setQuotation] = useState<QuotationInfo | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: quotationId ? 'repair' : 'inspection',
        scheduledDate: '',
        scheduledTime: '09:00',
        notes: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch garage info if garageId provided
                if (garageId) {
                    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:7337/api'}/v1/organizations/${garageId}/public`);
                    if (response.ok) {
                        const data = await response.json();
                        setGarage(data.data);
                    }
                }

                // Fetch quotation info if quotationId provided
                if (quotationId) {
                    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:7337/api'}/v1/quotations/share/${quotationId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setQuotation(data.data);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [garageId, quotationId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:7337/api'}/v1/bookings/public`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    garageId,
                    quotationId,
                    scheduledDate: `${formData.scheduledDate}T${formData.scheduledTime}:00`,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to create booking');
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create booking');
        } finally {
            setSubmitting(false);
        }
    };

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split('T')[0];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EA6A47]"></div>
            </div>
        );
    }

    if (success) {
        return (
            <>
                <Helmet>
                    <title>Booking Confirmed | {garage?.name || 'Errorlytic'}</title>
                </Helmet>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
                    >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircleIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                        <p className="text-gray-600 mb-6">
                            Your service appointment has been scheduled. {garage?.name || 'The garage'} will contact you to confirm the details.
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm text-gray-500 mb-1">Scheduled for</p>
                            <p className="font-medium text-gray-900">
                                {new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })} at {formData.scheduledTime}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 bg-[#EA6A47] text-white rounded-xl font-semibold hover:bg-[#d85a37] transition-colors"
                        >
                            Back to Home
                        </button>
                    </motion.div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Schedule Service | {garage?.name || 'Errorlytic'}</title>
            </Helmet>
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Schedule Your Service
                        </h1>
                        {garage && (
                            <p className="text-gray-600">
                                Book an appointment with <span className="font-semibold text-[#EA6A47]">{garage.name}</span>
                            </p>
                        )}
                    </motion.div>

                    {/* Quotation Summary */}
                    {quotation?.vehicleInfo && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6"
                        >
                            <h2 className="text-sm font-medium text-gray-500 mb-3">Vehicle from Quotation</h2>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#EA6A47]/10 rounded-xl flex items-center justify-center">
                                    <TruckIcon className="h-6 w-6 text-[#EA6A47]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {quotation.vehicleInfo.make} {quotation.vehicleInfo.model} ({quotation.vehicleInfo.year})
                                    </p>
                                    <p className="text-sm text-gray-500">{quotation.vehicleInfo.plate}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Booking Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                    >
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
                                {error}
                            </div>
                        )}

                        {/* Contact Information */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                            placeholder="+254 700 000 000"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Type */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Type</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {serviceTypes.map((service) => (
                                    <button
                                        key={service.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, serviceType: service.id })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                                            formData.serviceType === service.id
                                                ? 'border-[#EA6A47] bg-[#EA6A47]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <service.icon className={`h-6 w-6 mb-2 ${
                                            formData.serviceType === service.id ? 'text-[#EA6A47]' : 'text-gray-400'
                                        }`} />
                                        <p className={`font-medium ${
                                            formData.serviceType === service.id ? 'text-[#EA6A47]' : 'text-gray-900'
                                        }`}>{service.name}</p>
                                        <p className="text-xs text-gray-500">{service.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferred Date & Time</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="date"
                                            required
                                            min={minDateStr}
                                            value={formData.scheduledDate}
                                            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <div className="relative">
                                        <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <select
                                            value={formData.scheduledTime}
                                            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent appearance-none"
                                        >
                                            {timeSlots.map((time) => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                placeholder="Any specific concerns or requests..."
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-[#EA6A47] text-white rounded-xl font-semibold hover:bg-[#d85a37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    <CalendarIcon className="h-5 w-5" />
                                    Schedule Appointment
                                </>
                            )}
                        </button>
                    </motion.form>

                    {/* Powered by */}
                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-400">
                            Powered by <span className="text-[#EA6A47] font-medium">Errorlytic</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingPage;
