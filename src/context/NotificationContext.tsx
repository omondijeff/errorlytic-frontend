
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import NotificationContainer from '../components/UI/NotificationContainer';

interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

interface NotificationContextType {
    addNotification: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification }}>
            {children}
            <NotificationContainer notifications={notifications} onClose={removeNotification} />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
