import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DemoBanner } from './components/DemoBanner';
import { ToastContainer } from './components/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { TripWizardPage } from './pages/TripWizardPage';
import { ItineraryViewPage } from './pages/ItineraryViewPage';
import { SavedTripsPage } from './pages/SavedTripsPage';
import { TripEditPage } from './pages/TripEditPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading, isDemoMode } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Allow access if user is logged in or in demo mode
  if (!user && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout with dynamic sidebar
const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Certain pages like landing page or login don't show the persistent sidebar
  const isAuthOrLanding = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <DemoBanner />
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      <div className="flex-1 flex">
        {!isAuthOrLanding && (
          <Sidebar
            isMobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 overflow-x-hidden min-w-0">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Authenticated / Protected Pages */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plan"
              element={
                <ProtectedRoute>
                  <TripWizardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/itinerary/:tripId"
              element={
                <ProtectedRoute>
                  <ItineraryViewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <SavedTripsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:tripId/edit"
              element={
                <ProtectedRoute>
                  <TripEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <AppLayout />
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
