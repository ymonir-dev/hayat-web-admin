import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider, useAuth, hasPermission } from './auth';
import Shell from './components/Shell';

import Login from './pages/Login';
import RoleDashboard from './pages/RoleDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AuditorDashboard from './pages/AuditorDashboard';
import StaffAccess from './pages/StaffAccess';
import GenericData from './pages/GenericData';
import SystemReadiness from './pages/SystemReadiness';
import PlatformAdmin from './pages/PlatformAdmin';


function Guard({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (auth.loading) {
    return <div className="loading full">Loading Hayat…</div>;
  }

  if (!auth.platformAdmin && !auth.provider) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}


function DashboardEntry() {
  const auth = useAuth();

  if (auth.platformAdmin) {
    return <Navigate to="/platform" replace />;
  }

  if (!auth.provider) {
    return <Navigate to="/login" replace />;
  }

  return <RoleDashboard />;
}


function RoleOnly({
  roles,
  children,
}: {
  roles: string[];
  children: ReactNode;
}) {
  const auth = useAuth();

  if (
    auth.platformAdmin ||
    !auth.provider ||
    !roles.includes(auth.provider.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}


function PermissionOnly({
  code,
  children,
}: {
  code: string;
  children: ReactNode;
}) {
  const auth = useAuth();

  if (
    auth.platformAdmin ||
    !hasPermission(auth.provider, code)
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}


function PlatformOnly({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (!auth.platformAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}


function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        element={
          <Guard>
            <Shell />
          </Guard>
        }
      >

        {/* ROLE-BASED HOME DASHBOARD */}
        <Route
          path="/"
          element={<DashboardEntry />}
        />

        {/* PLATFORM SUPER ADMIN */}
        <Route
          path="/platform"
          element={
            <PlatformOnly>
              <PlatformAdmin />
            </PlatformOnly>
          }
        />

        {/* HOSPITAL OWNER */}
        <Route
          path="/owner"
          element={
            <RoleOnly roles={['owner']}>
              <OwnerDashboard />
            </RoleOnly>
          }
        />

        {/* HOSPITAL ADMIN / GM */}
        <Route
          path="/admin"
          element={
            <RoleOnly roles={['admin']}>
              <AdminDashboard />
            </RoleOnly>
          }
        />

        {/* DEPARTMENT MANAGER */}
        <Route
          path="/manager"
          element={
            <RoleOnly roles={['department_manager']}>
              <ManagerDashboard />
            </RoleOnly>
          }
        />

        {/* AUDITOR */}
        <Route
          path="/audit"
          element={
            <RoleOnly roles={['auditor']}>
              <AuditorDashboard />
            </RoleOnly>
          }
        />

        {/* STAFF ACCESS */}
        <Route
          path="/staff"
          element={
            <PermissionOnly code="accounts.approve">
              <StaffAccess />
            </PermissionOnly>
          }
        />

        {/* BRANCHES */}
        <Route
          path="/branches"
          element={
            <PermissionOnly code="branches.view">
              <GenericData kind="branches" />
            </PermissionOnly>
          }
        />

        {/* DOCTORS */}
        <Route
          path="/doctors"
          element={
            <PermissionOnly code="doctors.view">
              <GenericData kind="doctors" />
            </PermissionOnly>
          }
        />

        {/* APPOINTMENTS */}
        <Route
          path="/appointments"
          element={
            <PermissionOnly code="appointments.view">
              <GenericData kind="appointments" />
            </PermissionOnly>
          }
        />

        {/* SERVICES */}
        <Route
          path="/services"
          element={
            <PermissionOnly code="services.view">
              <GenericData kind="services" />
            </PermissionOnly>
          }
        />

        {/* SERVICE REQUESTS */}
        <Route
          path="/requests"
          element={
            <PermissionOnly code="requests.view">
              <GenericData kind="requests" />
            </PermissionOnly>
          }
        />

        {/* NOTIFICATIONS */}
        <Route
          path="/notifications"
          element={
            <PermissionOnly code="notifications.view">
              <GenericData kind="notifications" />
            </PermissionOnly>
          }
        />

        {/* HR */}
        <Route
          path="/hr"
          element={
            <RoleOnly roles={['hr', 'owner', 'admin']}>
              <GenericData kind="hr" />
            </RoleOnly>
          }
        />

        {/* SYSTEM READINESS */}
        <Route
          path="/readiness"
          element={
            <PermissionOnly code="system.readiness.view">
              <SystemReadiness />
            </PermissionOnly>
          }
        />

      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
