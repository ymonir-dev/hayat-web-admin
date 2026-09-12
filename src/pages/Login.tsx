import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth';

export default function Login() {
  const auth = useAuth();
  const nav = useNavigate();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  if (!auth.loading && (auth.platformAdmin || auth.provider)) return <Navigate to="/" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError(error.message); else nav('/');
  }

  return <div className="login-page"><form className="login-card" onSubmit={submit}><div className="login-logo">H</div><h1>Hayat Web Administration</h1><p>Secure hospital and platform management portal</p>{error && <div className="error">{error}</div>}<label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Password<input type="password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)} /></label><button className="btn btn-primary btn-block" disabled={busy}>{busy?'Signing in…':'Sign in'}</button></form></div>;
}
