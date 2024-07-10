import { api } from '../../../boot/axios';
import { Secretary } from '../Model/Secretary';

export class SecretariesRepository {
  async getSecretaries(): Promise<Secretary[]> {
    const response = await api.get<Secretary[]>('/secretaries');
    return response.data;
  }

  async getSecretary(id: string): Promise<Secretary> {
    const response = await api.get<Secretary>(`/secretaries/${id}`);
    return response.data;
  }

  async createSecretary(secretary: Omit<Secretary, 'id'>): Promise<Secretary> {
    const response = await api.post<Secretary>('/secretaries', secretary);
    return response.data;
  }

  async updateSecretary(
    id: string,
    secretary: Partial<Secretary>
  ): Promise<Secretary> {
    const response = await api.patch<Secretary>(
      `/secretaries/${id}`,
      secretary
    );
    return response.data;
  }

  async deleteSecretary(id: string): Promise<void> {
    await api.delete(`/secretaries/${id}`);
  }
}
