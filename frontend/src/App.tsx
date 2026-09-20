import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { DemoProvider } from './components/demo/DemoContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { AshaDashboard } from './pages/asha/AshaDashboard';
import { MedicalOfficerDashboard } from './pages/mo/MedicalOfficerDashboard';
import { DistrictOfficerDashboard } from './pages/dho/DistrictOfficerDashboard';
import { ReferralFacilityDashboard } from './pages/referral/ReferralFacilityDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ChestXRayWorkstation } from './pages/mo/ChestXRayWorkstation';
import { FederatedLearningView } from './pages/admin/FederatedLearningView';
import './styles/tokens.css';
import './styles/global.css';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DemoProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Website & Auth */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/404" element={<NotFoundPage />} />

            {/* Authenticated Application Shell */}
            <Route element={<AppLayout />}>
              {/* Patient Portal */}
              <Route
                path="/patient/*"
                element={
                  <ProtectedRoute>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ASHA / ANM Frontline */}
              <Route
                path="/asha/*"
                element={
                  <ProtectedRoute>
                    <AshaDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Medical Officer OPD & Doctor Chest X-Ray AI (Phases 6-9) */}
              <Route
                path="/mo/chest-xray"
                element={
                  <ProtectedRoute allowedRoles={['medical_officer', 'system_admin', 'referral_facility']}>
                    <ChestXRayWorkstation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/chest-xray"
                element={
                  <ProtectedRoute allowedRoles={['medical_officer', 'system_admin', 'referral_facility']}>
                    <ChestXRayWorkstation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mo/*"
                element={
                  <ProtectedRoute allowedRoles={['medical_officer', 'system_admin']}>
                    <MedicalOfficerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/*"
                element={
                  <ProtectedRoute allowedRoles={['medical_officer', 'system_admin']}>
                    <MedicalOfficerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* District Health Officer & State Intelligence */}
              <Route
                path="/dho/*"
                element={
                  <ProtectedRoute>
                    <DistrictOfficerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/state/*"
                element={
                  <ProtectedRoute>
                    <DistrictOfficerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Referral Specialist Facility */}
              <Route
                path="/referral/*"
                element={
                  <ProtectedRoute>
                    <ReferralFacilityDashboard />
                  </ProtectedRoute>
                }
              />

              {/* System Administration & Federated Learning (Phases 10-11) */}
              <Route
                path="/admin/federated-learning"
                element={
                  <ProtectedRoute allowedRoles={['system_admin']}>
                    <FederatedLearningView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['system_admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </DemoProvider>
    </AuthProvider>
  );
};

export default App;
