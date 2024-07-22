// CaseHistoryRepository.ts
import { api } from 'src/boot/axios';
import { CaseHistory } from '../Model/CaseHistory';

export class CaseHistoryRepository {
  async getCaseHistory(caseId: string): Promise<CaseHistory[]> {
    try {
      const response = await api.get<CaseHistory[]>(
        `/case-history/case/${caseId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error en CaseHistoryRepository:', error);
      throw error;
    }
  }
}
