import { api } from 'boot/axios';
import { Defendant } from '../models/Defendant';

export class DefendantRepository {
  async getDefendants(): Promise<Defendant[]> {
    const response = await api.get<Defendant[]>('/defendants');
    return response.data;
  }

  async getDefendant(id: string): Promise<Defendant> {
    const response = await api.get<Defendant>(`/defendants/${id}`);
    return response.data;
  }

  async createDefendant(defendant: Omit<Defendant, 'id'>): Promise<Defendant> {
    const response = await api.post<Defendant>('/defendants', defendant);
    return response.data;
  }

  async updateDefendant(
    id: string,
    defendant: Partial<Defendant>
  ): Promise<Defendant> {
    const response = await api.patch<Defendant>(`/defendants/${id}`, defendant);
    return response.data;
  }

  async deleteDefendant(id: string): Promise<void> {
    await api.delete(`/defendants/${id}`);
  }
}
