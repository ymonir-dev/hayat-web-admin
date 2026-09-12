import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Home(){
  const a=useAuth();
  if(a.loading) return <div className="loading">Loading…</div>;
  if(a.platformAdmin) return <Navigate to="/platform" replace/>;
  switch(a.provider?.role){
    case 'owner': return <Navigate to="/owner" replace/>;
    case 'admin': return <Navigate to="/admin" replace/>;
    case 'department_manager': return <Navigate to="/manager" replace/>;
    case 'auditor': return <Navigate to="/audit" replace/>;
    case 'hr': return <Navigate to="/hr" replace/>;
    default: return <div className="card"><h2>Web access</h2><p>This web portal is optimized for management roles. Use the Hayat Provider mobile app for your operational workspace.</p></div>;
  }
}
