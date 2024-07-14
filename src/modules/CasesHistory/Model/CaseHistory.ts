export interface CaseHistory {
  id: string;
  case_id: string;
  action_type: string;
  description: string;
  changed_fields: Record<string, unknown>;
  user_id: string;
  timestamp: Date;
}
