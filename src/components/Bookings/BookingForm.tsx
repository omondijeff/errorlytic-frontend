import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CalendarIcon,
    ClockIcon,
    TruckIcon,
    WrenchScrewdriverIcon,
    ChatBubbleBottomCenterTextIcon,
    CheckIcon,
    UserIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    XMarkIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/apiClient';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useBooking, type Booking } from '../../context/BookingContext';
import { useNotification } from '../../context/NotificationContext';

interface BookingFormProps {
    onSuccess?: (booking: Booking) => void;
    onCancel?: () => void;
    initialData?: Partial<Booking>;
}

interface Client {
    _id?: string;
    id: string;
    name: string;
    email: string;
    phone?: string;
    type?: string;
}

interface Vehicle {
    _id: string;
    id: string;
    make: string;
    model: string;
    year: number;
    plate: string;
}

interface Analysis {
    _id: string;
    createdAt: string;
    summary?: {
        overview?: string;
        severity?: string;
    };
}

const serviceTypes = [
    { id: 'inspection', name: 'Inspection', icon: CheckIcon, color: 'bg-blue-500' },
    { id: 'repair', name: 'Repair', icon: WrenchScrewdriverIcon, color: 'bg-orange-500' },
    { id: 'maintenance', name: 'Maintenance', icon: ClockIcon, color: 'bg-green-500' },
    { id: 'diagnostic', name: 'Diagnostic', icon: ChatBubbleBottomCenterTextIcon, color: 'bg-purple-500' },
];

const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
];

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, onCancel, initialData }) => {
    const { createBooking, updateBooking } = useBooking();
    const { addNotification } = useNotification();
    const { user } = useSelector((state: RootState) => state.auth);
    const isGarage = user?.role === 'garage_admin' || user?.role === 'garage_user';

    const [loading, setLoading] = useState(false);
    const [loadingClients, setLoadingClients] = useState(false);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [loadingAnalyses, setLoadingAnalyses] = useState(false);

    const [clients, setClients] = useState<Client[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [analyses, setAnalyses] = useState<Analysis[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Walk-in mode
    const [isWalkIn, setIsWalkIn] = useState(false);
    const [walkInData, setWalkInData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: new Date().getFullYear(),
        vehiclePlate: '',
    });

    const [formData, setFormData] = useState({
        vehicleId: initialData?.vehicleId?._id || '',
        garageId: user?.orgId || '',
        clientId: initialData?.clientId?._id || '',
        analysisId: '',
        serviceType: initialData?.serviceType || 'inspection',
        scheduledDate: initialData?.scheduledDate ? new Date(initialData.scheduledDate).toISOString().split('T')[0] : '',
        scheduledTime: initialData?.scheduledDate ? new Date(initialData.scheduledDate).toTimeString().slice(0, 5) : '09:00',
        duration: initialData?.duration || 60,
        notes: initialData?.notes || '',
    });

    // Fetch garage's clients
    useEffect(() => {
        if (isGarage && !isWalkIn) {
            const fetchClients = async () => {
                setLoadingClients(true);
                try {
                    const response = await api.get('/vehicles/clients');
                    setClients(response.data.data || []);
                } catch (err) {
                    console.error('Failed to fetch clients:', err);
                    // Fallback to auth/clients endpoint
                    try {
                        const fallbackResponse = await api.get('/auth/clients');
                        setClients(fallbackResponse.data.data || []);
                    } catch {
                        addNotification('Failed to load clients', 'error');
                    }
                } finally {
                    setLoadingClients(false);
                }
            };
            fetchClients();
        }
    }, [isGarage, isWalkIn]);

    // Fetch vehicles when client is selected
    useEffect(() => {
        if (formData.clientId && !isWalkIn) {
            const fetchClientVehicles = async () => {
                setLoadingVehicles(true);
                setVehicles([]);
                setAnalyses([]);
                setFormData(prev => ({ ...prev, vehicleId: '', analysisId: '' }));
                try {
                    const response = await api.get(`/vehicles?ownerId=${formData.clientId}`);
                    setVehicles(response.data.data || []);
                } catch (err) {
                    console.error('Failed to fetch client vehicles:', err);
                }
                setLoadingVehicles(false);
            };
            fetchClientVehicles();
        }
    }, [formData.clientId, isWalkIn]);

    // Fetch analyses when vehicle is selected
    useEffect(() => {
        if (formData.vehicleId && !isWalkIn) {
            const fetchVehicleAnalyses = async () => {
                setLoadingAnalyses(true);
                setAnalyses([]);
                try {
                    const response = await api.get(`/analysis?vehicleId=${formData.vehicleId}`);
                    setAnalyses(response.data.data || []);
                } catch (err) {
                    console.error('Failed to fetch analyses:', err);
                }
                setLoadingAnalyses(false);
            };
            fetchVehicleAnalyses();
        }
    }, [formData.vehicleId, isWalkIn]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const scheduledDateObj = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);

            let payload: any = {
                garageId: formData.garageId,
                serviceType: formData.serviceType,
                scheduledDate: scheduledDateObj.toISOString(),
                duration: formData.duration,
                notes: formData.notes,
            };

            if (isWalkIn) {
                // Walk-in booking with embedded client/vehicle info
                payload.isWalkIn = true;
                payload.clientInfo = {
                    name: walkInData.clientName,
                    email: walkInData.clientEmail,
                    phone: walkInData.clientPhone,
                };
                payload.vehicleInfo = {
                    make: walkInData.vehicleMake,
                    model: walkInData.vehicleModel,
                    year: walkInData.vehicleYear,
                    plate: walkInData.vehiclePlate,
                };
            } else {
                payload.clientId = formData.clientId;
                payload.vehicleId = formData.vehicleId;
                if (formData.analysisId) {
                    payload.analysisId = formData.analysisId;
                }
            }

            let result;
            if (initialData?._id) {
                result = await updateBooking(initialData._id, payload);
                addNotification('Booking updated successfully', 'success');
            } else {
                result = await createBooking(payload);
                addNotification('Booking scheduled successfully', 'success');
            }

            if (onSuccess) onSuccess(result);
        } catch (err: any) {
            addNotification(err.response?.data?.detail || 'Failed to save booking', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedClient = clients.find(c => c._id === formData.clientId || c.id === formData.clientId);
    const selectedVehicle = vehicles.find(v => v._id === formData.vehicleId || v.id === formData.vehicleId);

    const minDate = new Date().toISOString().split('T')[0];

    const canSubmit = isWalkIn
        ? walkInData.clientName && walkInData.clientPhone && walkInData.vehiclePlate && formData.scheduledDate
        : formData.clientId && formData.vehicleId && formData.scheduledDate;

    return (
        <div className="bg-white rounded-2xl shadow-xl w-[95vw] max-w-[1400px] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] px-10 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {initialData?._id ? 'Update Booking' : 'Schedule New Booking'}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {isWalkIn ? 'Walk-in customer booking' : 'Book service for an existing client'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Toggle buttons for booking type */}
                        <div className="flex bg-white/10 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setIsWalkIn(false)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isWalkIn
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                <UserIcon className="h-4 w-4 inline mr-2" />
                                Existing Client
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsWalkIn(true)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isWalkIn
                                        ? 'bg-[#EA6A47] text-white shadow-sm'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                <PlusIcon className="h-4 w-4 inline mr-2" />
                                Walk-in
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    {/* Left Column - Client & Vehicle Selection */}
                    <div className="xl:col-span-2 space-y-8">
                        {isWalkIn ? (
                            /* Walk-in Form */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-5">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-[#EA6A47]" />
                                        Client Information
                                    </h3>
                                    <input
                                        type="text"
                                        placeholder="Client Name *"
                                        value={walkInData.clientName}
                                        onChange={(e) => setWalkInData({ ...walkInData, clientName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number *"
                                        value={walkInData.clientPhone}
                                        onChange={(e) => setWalkInData({ ...walkInData, clientPhone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email (Optional)"
                                        value={walkInData.clientEmail}
                                        onChange={(e) => setWalkInData({ ...walkInData, clientEmail: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                    />
                                </div>
                                <div className="space-y-5">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <TruckIcon className="h-5 w-5 text-[#EA6A47]" />
                                        Vehicle Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Make *"
                                            value={walkInData.vehicleMake}
                                            onChange={(e) => setWalkInData({ ...walkInData, vehicleMake: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Model"
                                            value={walkInData.vehicleModel}
                                            onChange={(e) => setWalkInData({ ...walkInData, vehicleModel: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="number"
                                            placeholder="Year"
                                            value={walkInData.vehicleYear}
                                            onChange={(e) => setWalkInData({ ...walkInData, vehicleYear: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Plate Number *"
                                            value={walkInData.vehiclePlate}
                                            onChange={(e) => setWalkInData({ ...walkInData, vehiclePlate: e.target.value.toUpperCase() })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Existing Client Selection */
                            <div className="space-y-8">
                                {/* Client Selection */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-[#EA6A47]" />
                                        Select Client
                                    </h3>
                                    <div className="relative mb-4">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by name or email..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                        />
                                    </div>
                                    {loadingClients ? (
                                        <div className="text-center py-4">
                                            <div className="animate-spin h-6 w-6 border-2 border-[#EA6A47] border-t-transparent rounded-full mx-auto"></div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                                            {filteredClients.map((client) => (
                                                <button
                                                    key={client._id || client.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, clientId: client._id || client.id })}
                                                    className={`p-3 rounded-xl border-2 text-left transition-all ${formData.clientId === (client._id || client.id)
                                                            ? 'border-[#EA6A47] bg-orange-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <p className="font-medium text-gray-900 text-sm truncate">{client.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500 truncate">{client.email}</p>
                                                </button>
                                            ))}
                                            {filteredClients.length === 0 && (
                                                <p className="col-span-full text-gray-500 text-sm py-4 text-center">No clients found</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Vehicle Selection */}
                                {formData.clientId && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <TruckIcon className="h-5 w-5 text-[#EA6A47]" />
                                            Select Vehicle
                                        </h3>
                                        {loadingVehicles ? (
                                            <div className="text-center py-4">
                                                <div className="animate-spin h-6 w-6 border-2 border-[#EA6A47] border-t-transparent rounded-full mx-auto"></div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {vehicles.map((vehicle) => (
                                                    <button
                                                        key={vehicle._id || vehicle.id}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, vehicleId: vehicle._id || vehicle.id })}
                                                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.vehicleId === (vehicle._id || vehicle.id)
                                                                ? 'border-[#EA6A47] bg-orange-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <p className="font-medium text-gray-900">{vehicle.make} {vehicle.model}</p>
                                                        <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.plate}</p>
                                                    </button>
                                                ))}
                                                {vehicles.length === 0 && (
                                                    <p className="col-span-full text-gray-500 text-sm py-4 text-center">No vehicles for this client</p>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Analysis Reports */}
                                {formData.vehicleId && analyses.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <DocumentTextIcon className="h-5 w-5 text-[#EA6A47]" />
                                            Link Analysis Report (Optional)
                                        </h3>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {analyses.map((analysis) => (
                                                <button
                                                    key={analysis._id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, analysisId: formData.analysisId === analysis._id ? '' : analysis._id })}
                                                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${formData.analysisId === analysis._id
                                                            ? 'border-[#EA6A47] bg-orange-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {new Date(analysis.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${analysis.summary?.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                                                analysis.summary?.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                                                    'bg-green-100 text-green-700'
                                                            }`}>
                                                            {analysis.summary?.severity || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 truncate">{analysis.summary?.overview || 'No summary'}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Service details, customer requests, or special instructions..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent resize-none h-24"
                            />
                        </div>
                    </div>

                    {/* Right Column - Service & Schedule */}
                    <div className="space-y-6 xl:border-l xl:border-gray-200 xl:pl-10">
                        {/* Service Type */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Service Type</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {serviceTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, serviceType: type.id })}
                                        className={`p-3 rounded-xl border-2 text-center transition-all ${formData.serviceType === type.id
                                                ? 'border-[#EA6A47] bg-orange-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className={`h-8 w-8 ${type.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                            <type.icon className="h-4 w-4 text-white" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{type.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarIcon className="h-4 w-4 inline mr-1" />
                                Date
                            </label>
                            <input
                                type="date"
                                min={minDate}
                                value={formData.scheduledDate}
                                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                <ClockIcon className="h-4 w-4 inline mr-1" />
                                Time
                            </label>
                            <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, scheduledTime: time })}
                                        className={`py-2 text-sm rounded-lg transition-all ${formData.scheduledTime === time
                                                ? 'bg-[#EA6A47] text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                            <select
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                            >
                                <option value={30}>30 min</option>
                                <option value={60}>1 hour</option>
                                <option value={90}>1.5 hours</option>
                                <option value={120}>2 hours</option>
                                <option value={180}>3 hours</option>
                                <option value={240}>4 hours</option>
                                <option value={480}>Full day</option>
                            </select>
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-3">Booking Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Client</span>
                                    <span className="font-medium text-gray-900">
                                        {isWalkIn ? (walkInData.clientName || '—') : (selectedClient?.name || '—')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Vehicle</span>
                                    <span className="font-medium text-gray-900">
                                        {isWalkIn ? (walkInData.vehiclePlate || '—') : (selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.plate}` : '—')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Service</span>
                                    <span className="font-medium text-gray-900">{serviceTypes.find(s => s.id === formData.serviceType)?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date & Time</span>
                                    <span className="font-medium text-gray-900">
                                        {formData.scheduledDate ? `${formData.scheduledDate} ${formData.scheduledTime}` : '—'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !canSubmit}
                            className="w-full py-4 bg-[#EA6A47] text-white font-bold rounded-xl hover:bg-[#d85a37] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    <CalendarIcon className="h-5 w-5" />
                                    {initialData?._id ? 'Update Booking' : 'Schedule Booking'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
