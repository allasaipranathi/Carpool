import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import FindRide from './pages/FindRide';
import OfferRide from './pages/OfferRide';
import RideDetails from './pages/RideDetails';
import MyTrips from './pages/MyTrips';
import MyRides from './pages/MyRides';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

// Layout with persistent Navbar and Footer
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

// Root index redirect for authenticated vs non-authenticated users
const RootRouter = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? (
    <Layout>
      <Home />
    </Layout>
  ) : (
    <Layout>
      <Landing />
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Root Landing / Home */}
            <Route path="/" element={<RootRouter />} />

            {/* Public Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Application Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/find-ride"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FindRide />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/offer-ride"
              element={
                <ProtectedRoute>
                  <Layout>
                    <OfferRide />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ride/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RideDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-trips"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyTrips />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-rides"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyRides />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Admin />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFound />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
