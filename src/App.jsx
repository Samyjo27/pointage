import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard.jsx';
import MyHours from '@/pages/MyHours.jsx';
import Clocking from '@/pages/Clocking.jsx';
import AbsenceRequests from '@/pages/AbsenceRequests.jsx';
import EmployeeManagement from '@/pages/EmployeeManagement.jsx';
import DepartmentManagement from '@/pages/DepartmentManagement.jsx';
import BrowserExtension from '@/pages/BrowserExtension.jsx';
import Reports from '@/pages/Reports.jsx';
import Settings from '@/pages/Settings.jsx';
import Login from '@/pages/Login.jsx';
import TeamManagement from '@/pages/TeamManagement.jsx';
import SalaryManagement from '@/pages/SalaryManagement.jsx';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import Agenda from '@/pages/Agenda.jsx';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NetworkProvider>
          <Router>
            <AppContent />
          </Router>
        </NetworkProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();

  if (location.pathname === '/login') {
    return (
      <>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<Login />} />
          </Routes>
        </AnimatePresence>
        <Toaster />
      </>
    );
  }

  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<ProtectedRoute element={Dashboard} />} />
          <Route path="/my-hours" element={<ProtectedRoute element={MyHours} />} />
          <Route path="/clocking" element={<ProtectedRoute element={Clocking} />} />
          <Route path="/absence-requests" element={<ProtectedRoute element={AbsenceRequests} />} />
          <Route path="/employee-management" element={<ProtectedRoute element={EmployeeManagement} role="Admin" />} />
          <Route path="/department-management" element={<ProtectedRoute element={DepartmentManagement} role="Admin" />} />
          <Route path="/team-management" element={<ProtectedRoute element={TeamManagement} role="Manager" />} />
          <Route path="/salary-management" element={<ProtectedRoute element={SalaryManagement} role="Admin" />} />
          <Route path="/browser-extension" element={<ProtectedRoute element={BrowserExtension} />} />
          <Route path="/reports" element={<ProtectedRoute element={Reports} role="Admin" />} />
          <Route path="/agenda" element={<ProtectedRoute element={Agenda} />} />
          <Route path="/settings" element={<ProtectedRoute element={Settings} />} />
        </Routes>
      </AnimatePresence>
      <Toaster />
    </MainLayout>
  );
}

export default App;