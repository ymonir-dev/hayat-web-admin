import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { JsonMap } from '../types';
import { Badge, Card, Loading, Table } from '../components/ui';
import Icon from '../components/Icon';

export default function PlatformAdmin(){
 const [loading,setLoading]=useState(true),[error,setError]=useState(''),[overview,setOverview]=useState<JsonMap>({}),[hospitals,setHospitals]=useState<JsonMap[]>([]),[accounts,setAccounts]=useState<JsonMap[]>([]);
 async function load(){setLoading(true);setError('');const [o,h,a]=await Promise.all([supabase.rpc('hayat_platform_overview'),supabase.rpc('hayat_platform_hospitals'),supabase.rpc('hayat_platform_accounts')]);const bad=[o,h,a].find(x=>x.error);if(bad?.error)setError(bad.error.message);else{setOverview(o.data??{});setHospitals(h.data??[]);setAccounts(a.data??[])}setLoading(false)}
 useEffect(()=>{load()},[]);
 async function hospitalStatus(id:string,active:boolean){const {error}=await supabase.rpc('hayat_platform_set_hospital_active',{p_hospital_id:id,p_active:active});if(error)setError(error.message);else load()}
 async function accountStatus(id:string,status:string){const {error}=await supabase.rpc('hayat_platform_set_provider_status',{p_account_id:id,p_status:status});if(error)setError(error.message);else load()}
 const active=Number(overview.active_hospitals??0),total=Number(overview.total_hospitals??0),inactive=Math.max(total-active,0); const activePct=total?Math.round(active/total*100):0;
 const recent=useMemo(()=>accounts.slice(0,5),[accounts]);
 if(loading)return <Loading/>;
 const tiles=[
  {label:'Total Hospitals',value:overview.total_hospitals??0,icon:'building',tone:'mint'},
  {label:'Active Hospitals',value:overview.active_hospitals??0,icon:'health',tone:'blue'},
  {label:'Provider Accounts',value:overview.provider_accounts??0,icon:'users',tone:'violet'},
  {label:'Pending Accounts',value:overview.pending_accounts??0,icon:'audit',tone:'orange'},
  {label:'Owners',value:overview.owners??0,icon:'shield',tone:'rose'},
  {label:'Branches',value:overview.branches??0,icon:'branches',tone:'slate'},
 ];
 return <>
  <div className="welcome-row"><div><div className="eyebrow">PLATFORM OVERVIEW</div><h1>Hayat Platform Administration</h1><p>Global oversight across hospitals, branches, owners and provider accounts.</p></div><button className="btn btn-secondary" onClick={load}>Refresh dashboard</button></div>
  {error&&<div className="error">{error}</div>}
  <div className="metric-grid">{tiles.map(t=><div className="metric-card" key={t.label}><div className={`metric-icon ${t.tone}`}><Icon name={t.icon} size={23}/></div><div><span>{t.label}</span><strong>{String(t.value)}</strong></div></div>)}</div>
  <div className="dashboard-grid dashboard-grid-3">
   <Card title="Hospital Status"><div className="status-chart"><div className="donut" style={{background:`conic-gradient(#26b889 0 ${activePct}%, #eef2f4 ${activePct}% 100%)`}}><div><strong>{total}</strong><span>Hospitals</span></div></div><div className="legend"><div><i className="dot active-dot"/><span>Active</span><strong>{active}</strong></div><div><i className="dot inactive-dot"/><span>Inactive</span><strong>{inactive}</strong></div></div></div></Card>
   <Card title="Quick Actions"><div className="quick-grid compact"><Link className="quick-action mint" to="#hospitals"><Icon name="building" size={24}/><span>Hospitals</span></Link><Link className="quick-action blue" to="#accounts"><Icon name="users" size={24}/><span>Accounts</span></Link><button className="quick-action violet" onClick={load}><Icon name="health" size={24}/><span>Refresh Data</span></button><Link className="quick-action orange" to="#accounts"><Icon name="audit" size={24}/><span>Pending Review</span></Link></div></Card>
   <Card title="System Access"><div className="system-list"><div><Icon name="shield"/><span>Platform Super Admin</span><Badge value="active"/></div><div><Icon name="health"/><span>Authentication</span><Badge value="operational"/></div><div><Icon name="building"/><span>Hospital Registry</span><Badge value="operational"/></div><div><Icon name="users"/><span>Role Security</span><Badge value="active"/></div></div></Card>
  </div>
  <div className="dashboard-grid dashboard-grid-2">
   <Card title="Recent Provider Accounts" action={<a href="#accounts" className="text-link">View all</a>}><div className="activity-list">{recent.length?recent.map((r,i)=><div className="activity-item" key={String(r.id??i)}><div className="activity-avatar">{String(r.full_name??r.email??'?').slice(0,1).toUpperCase()}</div><div><strong>{String(r.full_name??'Unnamed user')}</strong><span>{String(r.email??'')} · {String(r.role??'')}</span></div><Badge value={r.status}/></div>):<div className="empty">No provider accounts found.</div>}</div></Card>
   <Card title="Platform Summary"><div className="summary-bars"><div><span>Active hospitals</span><div className="bar"><i style={{width:`${activePct}%`}}/></div><strong>{activePct}%</strong></div><div><span>Approved providers</span><div className="bar"><i style={{width:`${accounts.length?Math.round(accounts.filter(a=>a.status==='approved').length/accounts.length*100):0}%`}}/></div><strong>{accounts.filter(a=>a.status==='approved').length}</strong></div><div><span>Pending providers</span><div className="bar"><i style={{width:`${accounts.length?Math.round(accounts.filter(a=>a.status==='pending').length/accounts.length*100):0}%`}}/></div><strong>{accounts.filter(a=>a.status==='pending').length}</strong></div></div></Card>
  </div>
  <div id="hospitals"><Card title="Hospitals / Clinics"><Table rows={hospitals} columns={[{key:'name',label:'Hospital'},{key:'is_active',label:'Status',render:r=><Badge value={r.is_active?'active':'inactive'}/>},{key:'branch_count',label:'Branches'},{key:'staff_count',label:'Staff'},{key:'owner_name',label:'Owner'},{key:'owner_email',label:'Owner email'},{key:'actions',label:'Action',render:r=><button className="btn btn-small btn-secondary" onClick={()=>hospitalStatus(String(r.id),!r.is_active)}>{r.is_active?'Deactivate':'Activate'}</button>}]} /></Card></div>
  <div id="accounts"><Card title="Provider Accounts"><Table rows={accounts} columns={[{key:'full_name',label:'Name'},{key:'email',label:'Email'},{key:'hospital_name',label:'Hospital'},{key:'role',label:'Role'},{key:'status',label:'Status',render:r=><Badge value={r.status}/>},{key:'actions',label:'Change',render:r=><select value={r.status} onChange={e=>accountStatus(String(r.id),e.target.value)}><option>pending</option><option>approved</option><option>suspended</option><option>rejected</option></select>}]} /></Card></div>
  <div className="brand-banner"><div className="brand-banner-icon">H</div><div><strong>Better Healthcare. Together.</strong><span>Manage. Support. Grow. — All in one platform.</span></div><div className="banner-logo">Hayat</div></div>
 </>;
}
