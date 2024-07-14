export interface AssignCase {
  caseId: string;
  clientId?: string;
  defendantId?: string;
}

export interface AssignCaseResponse {
  id: string;
  case_id: string;
  client_id?: string;
  defendant_id?: string;
  relationship_type: string;
}

export interface AssignClientCaseData {
  client_id: string;
  relationship_type: string;
}

// En el archivo de modelos (por ejemplo, AssignCase.ts)

export interface AssignDefendantCaseData {
  defendant_id: string;
  relationship_type: 'demandado' | 'codeudor';
}
