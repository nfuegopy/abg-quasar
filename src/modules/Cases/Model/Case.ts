export interface Case {
  id: string;
  case_number: string;
  court_id: string;
  secretary_id: string;
  start_date: Date;
  claim_amount: number;
  impulse_description?: string;
  current_status: string;
  observation?: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface CaseWithDetails extends Case {
  court_name: string;
  secretary_name: string;
}
