// CaseHistoryController.ts
import { CaseHistoryRepository } from '../Repository/CaseHistoryRepository';
import { CaseHistory } from '../Model/CaseHistory';
import { api } from 'src/boot/axios';

export class CaseHistoryController {
  private repository: CaseHistoryRepository;

  constructor() {
    this.repository = new CaseHistoryRepository();
  }

  async getCaseHistory(caseId: string): Promise<CaseHistory[]> {
    try {
      console.log('Solicitando histórico para el caso:', caseId); // Para depuración
      return await this.repository.getCaseHistory(caseId);
    } catch (error) {
      console.error('Error in CaseHistoryController:', error);
      throw error; // Re-throw the error to be caught in the component
    }
  }

  async createCaseHistory(
    caseHistory: Omit<CaseHistory, 'id'>
  ): Promise<CaseHistory> {
    const response = await api.post<CaseHistory>('/case-history', caseHistory);
    return response.data;
  }
}
