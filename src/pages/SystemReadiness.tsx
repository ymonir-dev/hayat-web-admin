import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { JsonMap } from '../types';
import { Badge, Card, Loading, PageTitle, Stat, Table, fmtDate } from '../components/ui';

export default function SystemReadiness(){
  const [loading,setLoading]=useState(true),[data,setData]=useState<JsonMap>({}),[error,setError]=useState('');
  async function load(){
    setLoading(true); setError('');
    const {data,error}=await supabase.rpc('provider_system_readiness');
    if(error)setError(error.message); else setData(data??{});
    setLoading(false);
  }
  useEffect(()=>{load()},[]);
  if(loading)return <Loading/>;
  const checks=[
    {name:'Authenticated session',status:data.auth_ok?'PASS':'FAIL',details:data.auth_ok?'Authenticated user detected':'No authenticated user'},
    {name:'Hospital context',status:data.hospital_context_ok?'PASS':'FAIL',details:data.hospital_context_ok?String(data.hospital_id??'Available'):'Hospital context missing'},
    {name:'Required database tables',status:data.schema_ok?'PASS':'FAIL',details:data.schema_ok?'All required tables available':`Missing: ${(data.missing_tables??[]).join(', ')}`},
    {name:'Key module RPCs',status:data.rpc_ok?'PASS':'FAIL',details:data.rpc_ok?'All key functions available':`Missing: ${(data.missing_functions??[]).join(', ')}`},
  ];
  return <><PageTitle title="System Readiness" subtitle="Backend, context, database and module readiness." actions={<button className="btn btn-primary" onClick={load}>Run checks</button>}/>{error&&<div className="error">{error}</div>}<div className="stats-grid"><Stat label="Overall" value={<Badge value={data.overall_ok?'PASS':'FAIL'}/>}/><Stat label="Approved staff" value={data.approved_staff}/><Stat label="Departments" value={data.departments}/><Stat label="Branches" value={data.branches}/></div><Card title="Readiness checks"><Table rows={checks} columns={[{key:'name',label:'Check'},{key:'status',label:'Status',render:r=><Badge value={r.status}/>},{key:'details',label:'Details'}]}/></Card><Card title="Diagnostic"><div className="diagnostic"><div><strong>Role:</strong> {String(data.role??'—')}</div><div><strong>Hospital ID:</strong> {String(data.hospital_id??'—')}</div><div><strong>Checked:</strong> {fmtDate(data.checked_at)}</div></div></Card></>;
}
