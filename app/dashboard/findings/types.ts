export interface Finding {
  id: number;

  aws_account_id: number;
  aws_account_name: string;
  aws_account_number: string;

  aws_service: string;

  resource_id: string;
  resource_type: string;

  finding_type: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  message: string;

  estimated_monthly_savings: number;

  resolved: boolean;

  region?: string;

  detected_at?: string;
  created_at?: string;
}
  
  export interface FindingsResponse {
    status: string;
    total: number;
    pages: number;
    current_page: number;
    per_page: number;
    data: Finding[];
  }
  
  export interface FindingsStats {
    total: number;
    active: number;
    resolved: number;
    high: number;
    medium: number;
    low: number;
    estimated_monthly_savings: number;
  }