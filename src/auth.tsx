import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from './lib/supabase';
import type { AuthContext, ProviderContext } from './types';

const Ctx = createContext<AuthContext>({ loading: true, platformAdmin: false, provider: null, email: null });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [platformAdmin, setPlatformAdmin] = useState(false);
  const [provider, setProvider] = useState<ProviderContext | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setEmail(user?.email ?? null);
    if (!user) {
      setPlatformAdmin(false);
      setProvider(null);
      setLoading(false);
      return;
    }

    const { data: padmin } = await supabase.rpc('hayat_is_platform_admin');
    const isPlatform = padmin === true;
    setPlatformAdmin(isPlatform);

    if (isPlatform) {
      setProvider(null);
    } else {
      const { data, error } = await supabase.rpc('provider_get_my_context');
      if (error || !data || typeof data !== 'object' || !('id' in data)) {
        setProvider(null);
      } else {
        setProvider(data as ProviderContext);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    const { data } = supabase.auth.onAuthStateChange(() => refresh());
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({ loading, platformAdmin, provider, email }), [loading, platformAdmin, provider, email]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() { return useContext(Ctx); }
export function hasPermission(provider: ProviderContext | null, code: string) {
  return new Set(provider?.permissions ?? []).has(code);
}
