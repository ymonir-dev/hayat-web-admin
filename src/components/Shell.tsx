import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth, hasPermission } from '../auth';

const item = (to: string, label: string) => <NavLink className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} to={to}>{label}</NavLink>;

export default function Shell() {
  const auth = useAuth();
  const nav = useNavigate();
  const p = auth.provider;
  const role = p?.role ?? '';
  const isOwner = role === 'owner';
  const isAdmin = role === 'admin';
  const isManager = role === 'department_manager';
  const isAuditor = role === 'auditor';
  const isHR = role === 'hr';

  async function logout() { await supabase.auth.signOut(); nav('/login'); }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">H</div><div><strong>Hayat</strong><small>Admin & Operations</small></div></div>
      <nav>
        {auth.platformAdmin && item('/platform', 'Platform Administration')}
        {!auth.platformAdmin && item('/', 'Overview')}
        {isOwner && item('/owner', 'Owner Control Center')}
        {isAdmin && item('/admin', 'Hospital Administration')}
        {isManager && item('/manager', 'Department Management')}
        {isAuditor && item('/audit', 'Audit & Compliance')}
        {(isHR || isOwner || isAdmin) && item('/hr', 'Human Resources')}
        {!auth.platformAdmin && hasPermission(p,'accounts.approve') && item('/staff', 'Staff & Access')}
        {!auth.platformAdmin && hasPermission(p,'branches.view') && item('/branches', 'Branches')}
        {!auth.platformAdmin && hasPermission(p,'doctors.view') && item('/doctors', 'Doctors')}
        {!auth.platformAdmin && hasPermission(p,'appointments.view') && item('/appointments', 'Appointments')}
        {!auth.platformAdmin && hasPermission(p,'services.view') && item('/services', 'Services')}
        {!auth.platformAdmin && hasPermission(p,'requests.view') && item('/requests', 'Service Requests')}
        {!auth.platformAdmin && hasPermission(p,'notifications.view') && item('/notifications', 'Notifications')}
        {!auth.platformAdmin && hasPermission(p,'system.readiness.view') && item('/readiness', 'System Readiness')}
      </nav>
      <div className="sidebar-footer"><button className="btn btn-secondary btn-block" onClick={logout}>Sign out</button></div>
    </aside>
    <main className="main"><header className="topbar"><div><strong>{auth.platformAdmin ? 'Hayat Platform' : (p?.full_name || 'Hayat Provider')}</strong><span>{auth.email}</span></div><div className="role-pill">{auth.platformAdmin ? 'Platform Super Admin' : (role.replaceAll('_',' ') || 'User')}</div></header><div className="content"><Outlet /></div></main>
  </div>;
}
