export interface ClientInfo {
  company_name: string;
  email: string;
  contact_name: string;
  phone: string;
  pais?: string | null;
  mfa_policy?: "disabled" | "optional" | "required" | "required_for_admins";
  mfa_updated_at?: string | null;
}

export interface Subscription {
  plan_code: string;
  plan_name: string;
}

export interface ClientUser {
  id: number;
  contact_name: string | null;
  email: string;
  client_role: "owner" | "finops_admin" | "viewer";
  is_active: boolean;
  mfa_enabled?: boolean;
  mfa_confirmed_at?: string | null;
}

export interface UserForm {
  name: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}
