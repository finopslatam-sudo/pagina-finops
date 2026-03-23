export interface ClientInfo {
  company_name: string;
  email: string;
  contact_name: string;
  phone: string;
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
}

export interface UserForm {
  name: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}
