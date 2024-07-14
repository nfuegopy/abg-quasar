import { api } from 'src/boot/axios';
import {
  AssignCaseResponse,
  AssignClientCaseData,
  AssignDefendantCaseData,
} from '../Model/AssignCase';

export class AssignCaseRepository {
  async assignCaseToClient(
    caseId: string,
    data: AssignClientCaseData
  ): Promise<AssignCaseResponse> {
    const response = await api.post<AssignCaseResponse>('/client-cases', {
      ...data,
      case_id: caseId,
    });
    return response.data;
  }

  async assignCaseToDefendant(
    caseId: string,
    data: AssignDefendantCaseData
  ): Promise<AssignCaseResponse> {
    const response = await api.post<AssignCaseResponse>('/defendant-cases', {
      ...data,
      case_id: caseId,
    });
    return response.data;
  }
}
