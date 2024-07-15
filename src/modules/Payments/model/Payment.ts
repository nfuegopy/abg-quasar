export interface Payment {
  id: string;
  case_id: string;
  amount: number;
  payment_date: string;
  payment_type: string;
  payment_status: string;
  description?: string;
}
