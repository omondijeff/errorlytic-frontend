import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
    CalendarIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/apiClient';
import type { RootState } from '../../store';
import ModernButton from '../UI/ModernButton';
import { useNotification } from '../../context/NotificationContext';

const GoogleCalendarConnect: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();

    const handleConnect = async () => {
        setLoading(true);
        try {
            const response = await api.get('/auth/google/calendar/url');
            if (response.data?.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error('No authorization URL returned');
            }
        } catch (err) {
            console.error('Failed to get auth URL:', err);
            addNotification('Failed to connect to Google Calendar. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        if (!window.confirm('Are you sure you want to disconnect Google Calendar?')) return;

        setLoading(true);
        try {
            await api.post('/auth/google/calendar/disconnect');
            addNotification('Google Calendar disconnected successfully', 'success');
            // Refresh user data if needed (usually handled by global state update or page reload)
            window.location.reload();
        } catch (err) {
            console.error('Failed to disconnect:', err);
            addNotification('Failed to disconnect Google Calendar', 'error');
        } finally {
            setLoading(false);
        }
    };

    const isConnected = user?.googleCalendar?.isConnected;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-4 ${isConnected ? 'bg-green-50' : 'bg-blue-50'
                }`}>
                <CalendarIcon className={`h-8 w-8 ${isConnected ? 'text-green-500' : 'text-blue-500'
                    }`} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Google Calendar Integration</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                {isConnected
                    ? 'Your bookings are automatically synced with your Google Calendar.'
                    : 'Connect your Google account to automatically sync your service appointments.'}
            </p>

            {isConnected ? (
                <div className="flex flex-col w-full gap-3">
                    <div className="flex items-center justify-center py-2 px-4 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-100">
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Connected to Google Calendar
                    </div>
                    <button
                        onClick={handleDisconnect}
                        disabled={loading}
                        className="text-xs text-gray-400 hover:text-red-500 font-medium transition-all"
                    >
                        Disconnect Account
                    </button>
                </div>
            ) : (
                <ModernButton
                    onClick={handleConnect}
                    disabled={loading}
                    className="w-full py-3 bg-[#4285F4] text-white flex items-center justify-center font-bold rounded-xl hover:bg-[#357ae8] transition-all shadow-lg shadow-blue-100"
                >
                    {loading ? 'Connecting...' : 'Connect with Google'}
                    {!loading && <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />}
                </ModernButton>
            )}

            {!isConnected && (
                <p className="text-[10px] text-gray-400 mt-4 italic flex items-center">
                    <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                    You'll be redirected to Google for authorization
                </p>
            )}
        </div>
    );
};

export default GoogleCalendarConnect;
