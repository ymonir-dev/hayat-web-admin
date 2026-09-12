import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import { actionsFor, ROLE_DESCRIPTIONS, ROLE_LABELS } from '../access';
import Icon from '../components/Icon';
import { Card } from '../components/ui';

const roleCards:Record<string,Array<{title:string;desc:string;to?:string;icon:string;permission?:string}>>={
 receptionist:[
  {title:"Today's Appointments",desc:'View bookings, check arrivals and manage appointment workflow.',to:'/appointments',icon:'calendar',permission:'appointments.view'},
  {title:'Patient Service Requests',desc:'Follow service requests and front-desk coordination.',to:'/requests',icon:'requests',permission:'requests.view'},
  {title:'Doctors & Availability',desc:'Quick access to doctor records used by reception.',to:'/doctors',icon:'doctor',permission:'doctors.view'},
  {title:'Notifications',desc:'See operational notices and updates assigned to you.',to:'/notifications',icon:'bell',permission:'notifications.view'},
 ],
 hr:[
  {title:'Employees & HR',desc:'Employee records, attendance, leave and HR operations.',to:'/hr',icon:'hr'},
  {title:'Staff Access',desc:'Review staff accounts when your permissions allow it.',to:'/staff',icon:'users',permission:'accounts.approve'},
  {title:'Notifications',desc:'HR notices, actions and platform messages.',to:'/notifications',icon:'bell',permission:'notifications.view'},
 ],
 accountant:[
  {title:'Service Requests',desc:'Review billable services and operational requests.',to:'/requests',icon:'requests',permission:'requests.view'},
  {title:'Services',desc:'Review service catalog and pricing information.',to:'/services',icon:'money',permission:'services.view'},
  {title:'Notifications',desc:'Finance-related notices and assigned actions.',to:'/notifications',icon:'bell',permission:'notifications.view'},
 ],
 cashier:[
  {title:'Appointments',desc:'Review appointments related to payment collection.',to:'/appointments',icon:'calendar',permission:'appointments.view'},
  {title:'Service Requests',desc:'Review service requests requiring cashier handling.',to:'/requests',icon:'money',permission:'requests.view'},
  {title:'Notifications',desc:'Payment and front-desk notices.',to:'/notifications',icon:'bell',permission:'notifications.view'},
 ],
 doctor_coordinator:[
  {title:'Doctors',desc:'Coordinate doctor records, schedules and availability.',to:'/doctors',icon:'doctor',permission:'doctors.view'},
  {title:'Appointments',desc:'Monitor doctor appointment workload.',to:'/appointments',icon:'calendar',permission:'appointments.view'},
  {title:'Notifications',desc:'Medical affairs and scheduling notices.',to:'/notifications',icon:'bell',permission:'notifications.view'},
 ],
 doctor:[
  {title:'My Appointments',desc:'Access appointment workflow available to your role.',to:'/appointments',icon:'calendar',permission:'appointments.view'},
  {title:'Service Requests',desc:'Review clinical service requests available to you.',to:'/requests',icon:'requests',permission:'requests.view'},
  {title:'Notifications',desc:'Clinical notices and updates.',to:'/notifications',icon:'bell',permission:'notifications.view'},
 ],
 nurse:[
  {title:'Appointments',desc:'View appointment information available to nursing staff.',to:'/appointments',icon:'calendar',permission:'appointments.view'},
  {title:'Service Requests',desc:'Access nursing-related service workflow.',to:'/requests',icon:'requests',permission:'requests.view'},
  {title:'Notifications',desc:'Nursing notices and operational updates.',to:'/notifications',icon:'bell',permission:'notifications.view'},
 ],
 lab_staff:[
  {title:'Investigation Services',desc:'Access laboratory services and investigation requests.',to:'/services',icon:'services',permission:'services.view'},
  {title:'Service Requests',desc:'Work with laboratory-related requests available to your role.',to:'/requests',icon:'requests',permission:'requests.view'},
  {title:'Notifications',desc:'Laboratory notices and assignments.',to:'/notifications',icon:'bell',permission:'notifications.view'},
 ],
 radiology_staff:[
  {title:'Radiology Services',desc:'Access radiology services available in the hospital.',to:'/services',icon:'services',permission:'services.view'},
  {title:'Service Requests',desc:'Work with imaging-related requests available to your role.',to:'/requests',icon:'requests',permission:'requests.view'},
  {title:'Notifications',desc:'Radiology notices and assignments.',to:'/notifications',icon:'bell',permission:'notifications.view'},
 ],
 pharmacy_staff:[
  {title:'Service Requests',desc:'Review pharmacy-related operational requests.',to:'/requests',icon:'requests',permission:'requests.view'},
  {title:'Services',desc:'Review available hospital services relevant to pharmacy workflow.',to:'/services',icon:'services',permission:'services.view'},
  {title:'Notifications',desc:'Pharmacy notices and assignments.',to:'/notifications',icon:'bell',permission:'notifications.view'},
 ],
 service_coordinator:[
  {title:'Services',desc:'Manage the services visible to your role.',to:'/services',icon:'services',permission:'services.view'},
  {title:'Service Requests',desc:'Coordinate home-service and package requests.',to:'/requests',icon:'requests',permission:'requests.view'},
  {title:'Appointments',desc:'Review appointment dependencies where permitted.',to:'/appointments',icon:'calendar',permission:'appointments.view'},
 ],
};

export default function RoleDashboard(){
 const a=useAuth(); const p=a.provider; if(!p)return null;
 const role=p.role; const permissions=new Set(p.permissions??[]);
 const cards=(roleCards[role]??[]).filter(c=>!c.permission||permissions.has(c.permission));
 const quick=actionsFor(p).slice(0,6);
 const accessList=useMemo(()=>Array.from(permissions).sort(),[p.permissions]);
 return <>
  <div className="welcome-row"><div><div className="eyebrow">YOUR WORKSPACE</div><h1>Welcome back, {p.full_name||ROLE_LABELS[role]||'Hayat User'} <span className="wave">👋</span></h1><p>{ROLE_DESCRIPTIONS[role]||'Your dashboard shows only the functions assigned to your account.'}</p></div><div className="workspace-role"><span>Position</span><strong>{ROLE_LABELS[role]||role.replaceAll('_',' ')}</strong>{p.department_name&&<small>{p.department_name}</small>}</div></div>
  <div className="feature-grid">{cards.map(c=><Link key={c.title} className="feature-card" to={c.to||'/'}><div className="feature-icon"><Icon name={c.icon} size={24}/></div><div><h3>{c.title}</h3><p>{c.desc}</p></div><Icon name="arrow" size={18}/></Link>)}</div>
  {quick.length>0&&<Card title="Quick actions"><div className="quick-grid">{quick.map(q=><Link className={`quick-action ${q.tone||''}`} to={q.to} key={q.label}><Icon name={q.icon} size={24}/><span>{q.label}</span></Link>)}</div></Card>}
  <div className="grid-2"><Card title="Your authority"><div className="authority-summary"><div className="authority-big">{accessList.length}</div><div><strong>Assigned permissions</strong><p>These permissions come from your Hayat role and backend policy. The web portal does not grant extra authority.</p></div></div></Card><Card title="Security rule"><div className="security-note"><Icon name="shield" size={28}/><div><strong>Role-based access is enforced</strong><p>You only see modules allowed by your role and permissions. Hidden modules are not part of your workspace.</p></div></div></Card></div>
 </>;
}
