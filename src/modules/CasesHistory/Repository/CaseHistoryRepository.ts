// CaseHistoryRepository.ts
import { api } from 'src/boot/axios';
import { CaseHistory } from '../Model/CaseHistory';

export class CaseHistoryRepository {
  async getCaseHistory(caseId: string): Promise<CaseHistory[]> {
    const response = await api.get<CaseHistory[]>(
      `/case-history/case/${caseId}`
    );
    return response.data;
  }
}
