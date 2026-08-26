import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { Checkout } from './pages/Checkout';
import { TicketView } from './pages/TicketView';
import { UserDashboard } from './pages/UserDashboard';
import { OperatorDashboard } from './pages/OperatorDashboard';
import { OperatorServices } from './pages/OperatorServices';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden w-full max-w-full">
          <Navbar />
          <main className="flex-1 w-full max-w-full overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRoles={['PASSENGER', 'OPERATOR', 'ADMIN']}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ticket/:pnr"
                element={
                  <ProtectedRoute allowedRoles={['PASSENGER', 'OPERATOR', 'ADMIN']}>
                    <TicketView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute allowedRoles={['PASSENGER', 'OPERATOR', 'ADMIN']}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/operator-services"
                element={
                  <ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
                    <OperatorServices />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/operator-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
                    <OperatorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
