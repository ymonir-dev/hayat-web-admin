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
import PlatformSection from './pages/PlatformSection';

function Guard({children}:{children:ReactNode}){const a=useAuth();if(a.loading)return <div className="loading full">Loading Hayat…</div>;if(!a.platformAdmin&&!a.provider)return <Navigate to="/login" replace/>;return <>{children}</>}
function DashboardEntry(){const a=useAuth();if(a.platformAdmin)return <Navigate to="/platform" replace/>;if(!a.provider)return <Navigate to="/login" replace/>;return <RoleDashboard/>}
function RoleOnly({roles,children}:{roles:string[];children:ReactNode}){const a=useAuth();if(a.platformAdmin||!a.provider||!roles.includes(a.provider.role))return <Navigate to="/" replace/>;return <>{children}</>}
function PermissionOnly({code,children}:{code:string;children:ReactNode}){const a=useAuth();if(a.platformAdmin||!hasPermission(a.provider,code))return <Navigate to="/" replace/>;return <>{children}</>}
function PlatformOnly({children}:{children:ReactNode}){const a=useAuth();if(!a.platformAdmin)return <Navigate to="/" replace/>;return <>{children}</>}

function AppRoutes(){return <Routes>
  <Route path="/login" element={<Login/>}/>
  <Route element={<Guard><Shell/></Guard>}>
    <Route path="/" element={<DashboardEntry/>}/>
    <Route path="/platform" element={<PlatformOnly><PlatformAdmin/></PlatformOnly>}/>
    <Route path="/platform/hospitals" element={<PlatformOnly><PlatformSection section="hospitals"/></PlatformOnly>}/>
    <Route path="/platform/branches" element={<PlatformOnly><PlatformSection section="branches"/></PlatformOnly>}/>
    <Route path="/platform/staff" element={<PlatformOnly><PlatformSection section="staff"/></PlatformOnly>}/>
    <Route path="/platform/doctors" element={<PlatformOnly><PlatformSection section="doctors"/></PlatformOnly>}/>
    <Route path="/platform/appointments" element={<PlatformOnly><PlatformSection section="appointments"/></PlatformOnly>}/>
    <Route path="/platform/patients" element={<PlatformOnly><PlatformSection section="patients"/></PlatformOnly>}/>
    <Route path="/platform/departments" element={<PlatformOnly><PlatformSection section="departments"/></PlatformOnly>}/>
    <Route path="/platform/hr" element={<PlatformOnly><PlatformSection section="hr"/></PlatformOnly>}/>
    <Route path="/platform/finance" element={<PlatformOnly><PlatformSection section="finance"/></PlatformOnly>}/>
    <Route path="/platform/inventory" element={<PlatformOnly><PlatformSection section="inventory"/></PlatformOnly>}/>
    <Route path="/platform/reports" element={<PlatformOnly><PlatformSection section="reports"/></PlatformOnly>}/>
    <Route path="/platform/communication" element={<PlatformOnly><PlatformSection section="communication"/></PlatformOnly>}/>
    <Route path="/platform/settings" element={<PlatformOnly><PlatformSection section="settings"/></PlatformOnly>}/>

    <Route path="/owner" element={<RoleOnly roles={['owner']}><OwnerDashboard/></RoleOnly>}/>
    <Route path="/admin" element={<RoleOnly roles={['admin']}><AdminDashboard/></RoleOnly>}/>
    <Route path="/manager" element={<RoleOnly roles={['department_manager']}><ManagerDashboard/></RoleOnly>}/>
    <Route path="/audit" element={<RoleOnly roles={['auditor']}><AuditorDashboard/></RoleOnly>}/>
    <Route path="/staff" element={<PermissionOnly code="accounts.approve"><StaffAccess/></PermissionOnly>}/>
    <Route path="/branches" element={<PermissionOnly code="branches.view"><GenericData kind="branches"/></PermissionOnly>}/>
    <Route path="/doctors" element={<PermissionOnly code="doctors.view"><GenericData kind="doctors"/></PermissionOnly>}/>
    <Route path="/appointments" element={<PermissionOnly code="appointments.view"><GenericData kind="appointments"/></PermissionOnly>}/>
    <Route path="/services" element={<PermissionOnly code="services.view"><GenericData kind="services"/></PermissionOnly>}/>
    <Route path="/requests" element={<PermissionOnly code="requests.view"><GenericData kind="requests"/></PermissionOnly>}/>
    <Route path="/notifications" element={<PermissionOnly code="notifications.view"><GenericData kind="notifications"/></PermissionOnly>}/>
    <Route path="/hr" element={<RoleOnly roles={['hr','owner','admin']}><GenericData kind="hr"/></RoleOnly>}/>
    <Route path="/readiness" element={<PermissionOnly code="system.readiness.view"><SystemReadiness/></PermissionOnly>}/>
  </Route>
  <Route path="*" element={<Navigate to="/" replace/>}/>
</Routes>}
export default function App(){return <BrowserRouter><AuthProvider><AppRoutes/></AuthProvider></BrowserRouter>}
