import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from '../access';
import Icon from '../components/Icon';

type ActionCard={title:string;subtitle:string;to:string;icon:string;permission?:string;tone:string};
type RoleConfig={headline:string;subheadline:string;metrics:Array<{label:string;value:string;note:string;icon:string;tone:string}>;actions:ActionCard[];focus:string[]};

const configs:Record<string,RoleConfig>={
  receptionist:{
    headline:'Front Desk Command Center',
    subheadline:'Appointments, patient arrival, check-in and reception workflow in one place.',
    metrics:[
      {label:"Today's Appointments",value:'Open',note:'View today’s booking list',icon:'calendar',tone:'mint'},
      {label:'Patient Queue',value:'Live',note:'Manage arrivals and waiting flow',icon:'users',tone:'blue'},
      {label:'Check-In',value:'Ready',note:'Handle patient arrival workflow',icon:'health',tone:'violet'},
      {label:'Service Requests',value:'Open',note:'Review reception requests',icon:'requests',tone:'orange'},
    ],
    actions:[
      {title:'Appointments',subtitle:'View, coordinate and manage bookings',to:'/appointments',icon:'calendar',permission:'appointments.view',tone:'mint'},
      {title:'Patient Check-In',subtitle:'Open the front-desk appointment workflow',to:'/appointments',icon:'health',permission:'appointments.view',tone:'blue'},
      {title:'Doctors & Availability',subtitle:'Find doctors available for patients',to:'/doctors',icon:'doctor',permission:'doctors.view',tone:'violet'},
      {title:'Service Requests',subtitle:'Follow patient and service requests',to:'/requests',icon:'requests',permission:'requests.view',tone:'orange'},
      {title:'Notifications',subtitle:'Read reception notices and updates',to:'/notifications',icon:'bell',permission:'notifications.view',tone:'slate'},
    ],
    focus:['Patient arrival & check-in','Booking coordination','Waiting queue','Doctor availability','Patient service requests']
  },
  doctor:{
    headline:'Doctor Workspace',subheadline:'Your clinical schedule and assigned workflow.',
    metrics:[{label:'Appointments',value:'Today',note:'Your available appointment workflow',icon:'calendar',tone:'mint'},{label:'Clinical Requests',value:'Open',note:'Assigned service requests',icon:'requests',tone:'blue'},{label:'Notifications',value:'Live',note:'Clinical notices',icon:'bell',tone:'violet'},{label:'Access',value:'Secure',note:'Role-based authority',icon:'shield',tone:'slate'}],
    actions:[{title:'My Appointments',subtitle:'Open appointment workflow',to:'/appointments',icon:'calendar',permission:'appointments.view',tone:'mint'},{title:'Clinical Requests',subtitle:'Review available requests',to:'/requests',icon:'requests',permission:'requests.view',tone:'blue'},{title:'Notifications',subtitle:'Clinical updates and notices',to:'/notifications',icon:'bell',permission:'notifications.view',tone:'slate'}],
    focus:['Assigned appointments','Clinical requests','Patient workflow','Clinical notifications']
  },
  nurse:{
    headline:'Nursing Workspace',subheadline:'Patient-support workflow and nursing operations.',
    metrics:[{label:'Patient Queue',value:'Live',note:'Nursing workflow',icon:'users',tone:'mint'},{label:'Appointments',value:'Open',note:'Available appointment context',icon:'calendar',tone:'blue'},{label:'Requests',value:'Open',note:'Nursing-related requests',icon:'requests',tone:'violet'},{label:'Notifications',value:'Live',note:'Operational updates',icon:'bell',tone:'slate'}],
    actions:[{title:'Appointments',subtitle:'View nursing appointment context',to:'/appointments',icon:'calendar',permission:'appointments.view',tone:'mint'},{title:'Service Requests',subtitle:'Nursing-related workflow',to:'/requests',icon:'requests',permission:'requests.view',tone:'blue'},{title:'Notifications',subtitle:'Nursing notices and updates',to:'/notifications',icon:'bell',permission:'notifications.view',tone:'slate'}],
    focus:['Patient support','Assigned nursing work','Escalations','Operational updates']
  },
  hr:{
    headline:'Human Resources Workspace',subheadline:'Employee administration, leave, access and workforce coordination.',
    metrics:[{label:'Employees',value:'Manage',note:'HR employee workspace',icon:'users',tone:'mint'},{label:'Leave & HR',value:'Open',note:'HR administration',icon:'hr',tone:'blue'},{label:'Access',value:'Controlled',note:'Permission-based staff access',icon:'shield',tone:'violet'},{label:'Notifications',value:'Live',note:'HR notices',icon:'bell',tone:'slate'}],
    actions:[{title:'HR & Leave',subtitle:'Open employee HR workflow',to:'/hr',icon:'hr',tone:'mint'},{title:'Staff & Access',subtitle:'Review staff access where authorized',to:'/staff',icon:'users',permission:'accounts.approve',tone:'blue'},{title:'Notifications',subtitle:'HR notices and assigned actions',to:'/notifications',icon:'bell',permission:'notifications.view',tone:'slate'}],
    focus:['Employee records','Leave workflow','Staff access','HR coordination']
  },
  cashier:{
    headline:'Cashier Workspace',subheadline:'Payment-related front-desk workflow and service requests.',
    metrics:[{label:'Appointments',value:'Open',note:'Payment-linked appointments',icon:'calendar',tone:'mint'},{label:'Payment Requests',value:'Open',note:'Cashier service workflow',icon:'money',tone:'blue'},{label:'Notifications',value:'Live',note:'Payment updates',icon:'bell',tone:'violet'},{label:'Access',value:'Secure',note:'Cashier-only authority',icon:'shield',tone:'slate'}],
    actions:[{title:'Appointments',subtitle:'Review appointments requiring cashier handling',to:'/appointments',icon:'calendar',permission:'appointments.view',tone:'mint'},{title:'Service Requests',subtitle:'Open payment-related requests',to:'/requests',icon:'money',permission:'requests.view',tone:'blue'},{title:'Notifications',subtitle:'Cashier notices and updates',to:'/notifications',icon:'bell',permission:'notifications.view',tone:'slate'}],
    focus:['Payment handling','Receipts','Appointment payment context','Cashier notices']
  }
};

function fallback(role:string):RoleConfig{
  return {headline:ROLE_LABELS[role]||'My Workspace',subheadline:ROLE_DESCRIPTIONS[role]||'Your role-based Hayat workspace.',metrics:[{label:'Workspace',value:'Ready',note:'Role-based dashboard',icon:'dashboard',tone:'mint'},{label:'Permissions',value:'Active',note:'Backend-controlled access',icon:'shield',tone:'blue'},{label:'Notifications',value:'Live',note:'Operational updates',icon:'bell',tone:'violet'},{label:'Security',value:'Protected',note:'Authorized modules only',icon:'health',tone:'slate'}],actions:[{title:'Notifications',subtitle:'Open your available notifications',to:'/notifications',icon:'bell',permission:'notifications.view',tone:'slate'}],focus:['Role-specific operations','Authorized modules','Secure access']};
}

export default function RoleDashboard(){
  const a=useAuth();
  const p=a.provider;
  if(!p)return null;
  const config=configs[p.role]??fallback(p.role);
  const permissions=new Set(p.permissions??[]);
  const actions=config.actions.filter(x=>!x.permission||permissions.has(x.permission));

  return <div className="role-dashboard-page">
    <section className="hero-panel">
      <div>
        <span className="hero-kicker">{ROLE_LABELS[p.role]||p.role.replaceAll('_',' ')}</span>
        <h1>{config.headline}</h1>
        <p>{config.subheadline}</p>
      </div>
      <div className="hero-person">
        <div className="hero-avatar">{(p.full_name||'H').slice(0,1).toUpperCase()}</div>
        <div><small>Signed in as</small><strong>{p.full_name||'Hayat User'}</strong>{p.department_name&&<span>{p.department_name}</span>}</div>
      </div>
    </section>

    <section className="dashboard-metrics">
      {config.metrics.map(m=><div className="dashboard-metric-card" key={m.label}>
        <div className={`dashboard-metric-icon ${m.tone}`}><Icon name={m.icon} size={22}/></div>
        <div><span>{m.label}</span><strong>{m.value}</strong><small>{m.note}</small></div>
      </div>)}
    </section>

    <section className="dashboard-section">
      <div className="section-heading"><div><span>QUICK ACTIONS</span><h2>What do you want to do?</h2></div><small>Only actions allowed for your account are shown.</small></div>
      <div className="action-card-grid">
        {actions.map(x=><Link to={x.to} className="action-card" key={x.title}>
          <div className={`action-card-icon ${x.tone}`}><Icon name={x.icon} size={24}/></div>
          <div><h3>{x.title}</h3><p>{x.subtitle}</p></div>
          <div className="action-arrow"><Icon name="arrow" size={18}/></div>
        </Link>)}
      </div>
    </section>

    <section className="dashboard-bottom-grid">
      <div className="panel-card">
        <div className="panel-title"><div><span>YOUR WORK</span><h3>Today’s focus</h3></div><Icon name="health" size={22}/></div>
        <div className="focus-list">{config.focus.map((f,i)=><div key={f}><span className="focus-number">{String(i+1).padStart(2,'0')}</span><strong>{f}</strong><span className="focus-status">Available</span></div>)}</div>
      </div>
      <div className="panel-card secure-panel">
        <div className="panel-title"><div><span>ACCESS CONTROL</span><h3>Your authority</h3></div><Icon name="shield" size={22}/></div>
        <div className="permission-ring"><div><strong>{permissions.size}</strong><span>permissions</span></div></div>
        <p>Your workspace is generated from your assigned role and backend permissions. Other departments and restricted management functions remain hidden.</p>
      </div>
    </section>

    <section className="dashboard-footer-banner"><div className="footer-logo">H</div><div><strong>Better Healthcare. Together.</strong><span>Hayat keeps every role focused on the work they are authorized to perform.</span></div></section>
  </div>;
}
