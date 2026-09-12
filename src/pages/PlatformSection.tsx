import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { JsonMap } from '../types';
import { Badge, Card, Loading, PageTitle, Table } from '../components/ui';
import Icon from '../components/Icon';

type Section='hospitals'|'branches'|'staff'|'doctors'|'appointments'|'patients'|'departments'|'hr'|'finance'|'inventory'|'reports'|'communication'|'settings';

const META:Record<Section,{title:string;subtitle:string;icon:string}> = {
  hospitals:{title:'Hospitals',subtitle:'Manage all hospitals and clinics connected to Hayat.',icon:'building'},
  branches:{title:'Branches',subtitle:'Platform-wide hospital branch overview.',icon:'branches'},
  staff:{title:'Staff & Users',subtitle:'Provider accounts, roles and access status.',icon:'users'},
  doctors:{title:'Doctors',subtitle:'Doctor accounts registered across the platform.',icon:'doctor'},
  appointments:{title:'Appointments',subtitle:'Platform appointment administration.',icon:'calendar'},
  patients:{title:'Patients',subtitle:'Platform patient administration.',icon:'patients'},
  departments:{title:'Departments',subtitle:'Hospital departments and organizational structure.',icon:'departments'},
  hr:{title:'HR & Leave',subtitle:'Cross-hospital HR administration and leave oversight.',icon:'hr'},
  finance:{title:'Finance',subtitle:'Financial administration and settlement oversight.',icon:'money'},
  inventory:{title:'Inventory',subtitle:'Inventory and stock administration.',icon:'inventory'},
  reports:{title:'Reports',subtitle:'Platform reporting and operational analytics.',icon:'reports'},
  communication:{title:'Communication',subtitle:'Announcements, notifications and platform communication.',icon:'communication'},
  settings:{title:'System Settings',subtitle:'Platform configuration and administration settings.',icon:'settings'},
};

export default function PlatformSection({section}:{section:Section}){
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [hospitals,setHospitals]=useState<JsonMap[]>([]);
  const [accounts,setAccounts]=useState<JsonMap[]>([]);

  async function load(){
    setLoading(true);setError('');
    const [h,a]=await Promise.all([
      supabase.rpc('hayat_platform_hospitals'),
      supabase.rpc('hayat_platform_accounts')
    ]);
    const bad=[h,a].find(x=>x.error);
    if(bad?.error)setError(bad.error.message);
    setHospitals((h.data??[]) as JsonMap[]);
    setAccounts((a.data??[]) as JsonMap[]);
    setLoading(false);
  }
  useEffect(()=>{load()},[section]);

  const m=META[section];
  const rows=useMemo(()=>{
    if(section==='hospitals'||section==='branches') return hospitals;
    if(section==='doctors') return accounts.filter(a=>a.role==='doctor'||a.role==='doctor_coordinator');
    if(section==='staff'||section==='hr') return accounts;
    return [];
  },[section,hospitals,accounts]);

  if(loading)return <Loading/>;

  let columns:any[]=[];
  if(section==='hospitals') columns=[
    {key:'name',label:'Hospital'},
    {key:'is_active',label:'Status',render:(r:JsonMap)=><Badge value={r.is_active?'active':'inactive'}/>},
    {key:'branch_count',label:'Branches'},
    {key:'staff_count',label:'Staff'},
    {key:'owner_name',label:'Owner'},
    {key:'owner_email',label:'Owner Email'},
  ];
  else if(section==='branches') columns=[
    {key:'name',label:'Hospital'},
    {key:'branch_count',label:'Branch Count'},
    {key:'is_active',label:'Hospital Status',render:(r:JsonMap)=><Badge value={r.is_active?'active':'inactive'}/>},
  ];
  else if(section==='staff'||section==='hr'||section==='doctors') columns=[
    {key:'full_name',label:'Name'},
    {key:'email',label:'Email'},
    {key:'hospital_name',label:'Hospital'},
    {key:'role',label:'Role'},
    {key:'status',label:'Status',render:(r:JsonMap)=><Badge value={r.status}/>},
  ];

  const supported=['hospitals','branches','staff','doctors','hr'].includes(section);

  return <>
    <PageTitle title={m.title} subtitle={m.subtitle} actions={<button className="btn btn-secondary" onClick={load}>Refresh</button>}/>
    {error&&<div className="error">{error}</div>}
    <div className="platform-section-hero">
      <div className="platform-section-icon"><Icon name={m.icon} size={26}/></div>
      <div><strong>{m.title}</strong><span>{supported?'Live data from the Hayat Supabase backend.':'Navigation and UI are active. Backend data mapping for this module is the next implementation step.'}</span></div>
    </div>
    {supported ? <Card><Table rows={rows} columns={columns}/></Card> : <Card title={`${m.title} module`}>
      <div className="module-empty-state"><Icon name={m.icon} size={34}/><h3>{m.title}</h3><p>No fake data is displayed. This page is ready for the matching Supabase tables/RPCs to be connected.</p></div>
    </Card>}
  </>;
}
