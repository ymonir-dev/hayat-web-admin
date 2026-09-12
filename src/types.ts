export type JsonMap = Record<string, any>;

export type ProviderContext = {
  id: string;
  user_id: string;
  hospital_id: string;
  branch_id?: string | null;
  department_id?: string | null;
  department_name?: string | null;
  doctor_id?: string | null;
  role: string;
  status: string;
  kyc_status: string;
  full_name?: string | null;
  phone?: string | null;
  permissions?: string[];
};

export type AuthContext = {
  loading: boolean;
  platformAdmin: boolean;
  provider: ProviderContext | null;
  email: string | null;
};
