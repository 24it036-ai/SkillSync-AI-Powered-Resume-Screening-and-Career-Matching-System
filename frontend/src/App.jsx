import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import StudentLayout from './layouts/StudentLayout';
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import ResumeUploadPage from './pages/student/ResumeUploadPage';
import ResumeAnalysisPage from './pages/student/ResumeAnalysisPage';
import AtsScorePage from './pages/student/AtsScorePage';
import JobMatchingPage from './pages/student/JobMatchingPage';
import SkillGapsPage from './pages/student/SkillGapsPage';
import RecommendedCoursesPage from './pages/student/RecommendedCoursesPage';
import SavedJobsPage from './pages/student/SavedJobsPage';
import ApplicationsPage from './pages/student/ApplicationsPage';
import NotificationsPage from './pages/student/NotificationsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentSettingsPage from './pages/student/StudentSettingsPage';

import RecruiterDashboardPlaceholder from './pages/recruiter/RecruiterDashboardPlaceholder';
import AdminDashboardPlaceholder from './pages/admin/AdminDashboardPlaceholder';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Student Routes */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentLayout>
                    <Routes>
                      <Route path="dashboard" element={<StudentDashboardPage />} />
                      <Route path="resume-upload" element={<ResumeUploadPage />} />
                      <Route path="resume-analysis" element={<ResumeAnalysisPage />} />
                      <Route path="ats-score" element={<AtsScorePage />} />
                      <Route path="job-matching" element={<JobMatchingPage />} />
                      <Route path="skill-gaps" element={<SkillGapsPage />} />
                      <Route path="courses" element={<RecommendedCoursesPage />} />
                      <Route path="saved-jobs" element={<SavedJobsPage />} />
                      <Route path="applications" element={<ApplicationsPage />} />
                      <Route path="notifications" element={<NotificationsPage />} />
                      <Route path="profile" element={<StudentProfilePage />} />
                      <Route path="settings" element={<StudentSettingsPage />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Recruiter Routes */}
            <Route
              path="/recruiter/*"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <Routes>
                    <Route path="dashboard" element={<RecruiterDashboardPlaceholder />} />
                    <Route path="*" element={<RecruiterDashboardPlaceholder />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboardPlaceholder />} />
                    <Route path="*" element={<AdminDashboardPlaceholder />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}
