import { createContext, useContext, useState, type ReactNode } from "react";
import api from "../services/apiClient";

interface Booking {
    _id: string;
    clientId: {
        _id: string;
        email: string;
        profile: { name: string };
    };
    garageId: {
        _id: string;
        name: string;
        contact: { email?: string; phone?: string };
    };
    vehicleId: {
        _id: string;
        make: string;
        model: string;
        year: number;
        plate: string;
    };
    serviceType: "inspection" | "repair" | "maintenance" | "diagnostic";
    scheduledDate: string;
    duration: number;
    status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
    notes?: string;
    garageNotes?: string;
    googleCalendarEventId?: string;
    quotationId?: string;
    analysisId?: string;
    createdAt: string;
    updatedAt: string;
}

interface BookingContextType {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
    fetchBookings: (filters?: Record<string, string>) => Promise<void>;
    createBooking: (bookingData: Partial<Booking>) => Promise<Booking>;
    updateBooking: (id: string, updates: Partial<Booking>) => Promise<Booking>;
    confirmBooking: (id: string) => Promise<Booking>;
    cancelBooking: (id: string, reason?: string) => Promise<Booking>;
    getUpcomingBookings: () => Promise<Booking[]>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = async (filters?: Record<string, string>) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await api.get(`/bookings${queryParams ? `?${queryParams}` : ""}`);
            setBookings(response.data.data);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch bookings";
            setError(errorMessage);
            console.error("Fetch bookings error:", err);
        } finally {
            setLoading(false);
        }
    };

    const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/bookings", bookingData);
            const newBooking = response.data.data;
            setBookings((prev) => [newBooking, ...prev]);
            return newBooking;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create booking";
            setError(errorMessage);
            console.error("Create booking error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateBooking = async (id: string, updates: Partial<Booking>): Promise<Booking> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/bookings/${id}`, updates);
            const updatedBooking = response.data.data;
            setBookings((prev) =>
                prev.map((booking) => (booking._id === id ? updatedBooking : booking))
            );
            return updatedBooking;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update booking";
            setError(errorMessage);
            console.error("Update booking error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const confirmBooking = async (id: string): Promise<Booking> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(`/bookings/${id}/confirm`);
            const confirmedBooking = response.data.data;
            setBookings((prev) =>
                prev.map((booking) => (booking._id === id ? confirmedBooking : booking))
            );
            return confirmedBooking;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to confirm booking";
            setError(errorMessage);
            console.error("Confirm booking error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id: string, reason?: string): Promise<Booking> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(`/bookings/${id}/cancel`, { reason });
            const cancelledBooking = response.data.data;
            setBookings((prev) =>
                prev.map((booking) => (booking._id === id ? cancelledBooking : booking))
            );
            return cancelledBooking;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to cancel booking";
            setError(errorMessage);
            console.error("Cancel booking error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getUpcomingBookings = async (): Promise<Booking[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/bookings/upcoming");
            return response.data.data;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch upcoming bookings";
            setError(errorMessage);
            console.error("Get upcoming bookings error:", err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    return (
        <BookingContext.Provider
            value={{
                bookings,
                loading,
                error,
                fetchBookings,
                createBooking,
                updateBooking,
                confirmBooking,
                cancelBooking,
                getUpcomingBookings,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error("useBooking must be used within a BookingProvider");
    }
    return context;
};

export type { Booking };
