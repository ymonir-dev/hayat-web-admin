import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth';
import { canSeeNav, NAV_ITEMS, ROLE_LABELS } from '../access';
import Icon from './Icon';

export default function Shell() {
  const auth = useAuth(); const nav = useNavigate(); const p = auth.provider; const [open,setOpen]=useState(false);
  async function logout() { await supabase.auth.signOut(); nav('/login'); }
  const roleLabel=auth.platformAdmin?'Platform Super Admin':ROLE_LABELS[p?.role??'']||(p?.role??'User').replaceAll('_',' ');
  const navItems=auth.platformAdmin ? [{to:'/platform',label:'Platform Administration',icon:'dashboard'}] : NAV_ITEMS.filter(i=>canSeeNav(p,i));
  return <div className="app-shell">
    <aside className={`sidebar ${open?'open':''}`}>
      <div className="brand"><div className="brand-mark">H</div><div><strong>Hayat</strong><small>Web Administration</small></div><button className="mobile-close" onClick={()=>setOpen(false)}><Icon name="close"/></button></div>
      <nav>{navItems.map(i=><NavLink onClick={()=>setOpen(false)} key={i.to} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} to={i.to}><Icon name={i.icon} size={19}/><span>{i.label}</span></NavLink>)}</nav>
      <div className="sidebar-help"><div className="help-icon">?</div><div><strong>Role secured</strong><small>Only authorized modules are shown.</small></div></div>
      <div className="sidebar-footer"><button className="signout" onClick={logout}><Icon name="logout" size={18}/>Sign out</button></div>
    </aside>
    {open&&<button className="sidebar-scrim" onClick={()=>setOpen(false)} aria-label="Close menu"/>}
    <main className="main">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setOpen(true)}><Icon name="menu"/></button><div className="global-search"><Icon name="search" size={18}/><span>Search modules, hospitals, staff, reports…</span><kbd>Ctrl K</kbd></div><div className="top-actions"><button className="top-icon" title="Notifications"><Icon name="bell" size={19}/></button><div className="user-chip"><div className="avatar">{(p?.full_name||auth.email||'H').slice(0,1).toUpperCase()}</div><div><strong>{p?.full_name||auth.email||'Hayat'}</strong><span>{roleLabel}</span></div></div></div></header>
      <div className="content"><Outlet /></div>
    </main>
  </div>;
}
