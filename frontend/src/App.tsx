
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { store } from './store';
import { NotificationProvider } from './context/NotificationContext';
import { BookingProvider } from './context/BookingContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AuthInitializer from './components/Auth/AuthInitializer';
import LandingPage from './pages/Public/LandingPage';
import HowItWorksPage from './pages/Public/HowItWorksPage';
import WhoIsItForPage from './pages/Public/WhoIsItForPage';
import PrivacyPolicyPage from './pages/Public/PrivacyPolicyPage';
import TermsOfServicePage from './pages/Public/TermsOfServicePage';
import ContactPage from './pages/Public/ContactPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AnalysisPage from './pages/Analysis/AnalysisPage';
import DiagnosticSummaryPage from './pages/Analysis/DiagnosticSummaryPage';
import DiagnosticSummaryOverviewPage from './pages/Analysis/DiagnosticSummaryOverviewPage';
import VCDSReportViewerPage from './pages/Reports/VCDSReportViewerPage';
import UsersPage from './pages/Users/UsersPage';
import ProfilePage from './pages/Profile/ProfilePage';
import UserManagement from './pages/SuperAdmin/UserManagement';
import OrganizationsPage from './pages/SuperAdmin/OrganizationsPage';
import SystemAnalyticsPage from './pages/SuperAdmin/SystemAnalyticsPage';
import ActivityLogsPage from './pages/SuperAdmin/ActivityLogsPage';
import BillingPage from './pages/SuperAdmin/BillingPage';
import PlatformSettingsPage from './pages/SuperAdmin/PlatformSettingsPage';
import APIManagementPage from './pages/SuperAdmin/APIManagementPage';
import PricingManagementPage from './pages/SuperAdmin/PricingManagementPage';
import CreditPurchasePage from './pages/Credits/CreditPurchasePage';
import BookingsPage from './pages/Bookings/BookingsPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/who-is-it-for" element={<WhoIsItForPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected App Routes - Unified for all users including super admin */}
        <Route path="/app" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="analysis" element={<AnalysisPage />} />
          <Route path="analysis/:id" element={<DiagnosticSummaryPage />} />
          <Route path="diagnostic-summary" element={<DiagnosticSummaryOverviewPage />} />
          <Route path="reports/:id" element={<VCDSReportViewerPage />} />
          <Route path="users" element={<UsersPage />} />

          {/* Credits Routes */}
          <Route path="credits" element={<CreditPurchasePage />} />

          {/* Super Admin Routes */}
          <Route path="user-management" element={<UserManagement />} />
          <Route path="organizations" element={<OrganizationsPage />} />
          <Route path="analytics" element={<SystemAnalyticsPage />} />
          <Route path="activity-logs" element={<ActivityLogsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="pricing" element={<PricingManagementPage />} />
          <Route path="platform-settings" element={<PlatformSettingsPage />} />
          <Route path="api-management" element={<APIManagementPage />} />

          <Route path="profile" element={<ProfilePage />} />
          <Route path="bookings" element={<BookingsPage />} />
        </Route>

        {/* Redirect old super admin routes to unified routes */}
        <Route path="/superadmin/*" element={<Navigate to="/app/dashboard" replace />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <BookingProvider>
              <Router>
                <AuthInitializer />
                <div className="min-h-screen bg-black">
                  <AnimatedRoutes />
                </div>
              </Router>
            </BookingProvider>
          </NotificationProvider>
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  );
}

export default App;