import { api } from 'boot/axios';
import { Case, CaseWithDetails } from '../Model/Case';

export class CasesRepository {
  async getCases(): Promise<CaseWithDetails[]> {
    const response = await api.get<CaseWithDetails[]>('/cases');
    return response.data;
  }

  async getCase(id: string): Promise<CaseWithDetails> {
    const response = await api.get<CaseWithDetails>(`/cases/${id}`);
    return response.data;
  }

  async createCase(
    caseData: Omit<Case, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Case> {
    const response = await api.post<Case>('/cases', caseData);
    return response.data;
  }

  async updateCase(id: string, caseData: Partial<Case>): Promise<Case> {
    const response = await api.patch<Case>(`/cases/${id}`, caseData);
    return response.data;
  }

  async deleteCase(id: string): Promise<void> {
    await api.delete(`/cases/${id}`);
  }
}
