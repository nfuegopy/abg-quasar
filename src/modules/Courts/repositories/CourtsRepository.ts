import { api } from '../../../boot/axios';
import { Court } from '../model/Court';

export class CourtsRepository {
  async getCourts(): Promise<Court[]> {
    const response = await api.get<Court[]>('/courts');
    return response.data;
  }

  async getCourt(id: string): Promise<Court> {
    const response = await api.get<Court>(`/courts/${id}`);
    return response.data;
  }

  async createCourt(court: Omit<Court, 'id'>): Promise<Court> {
    const response = await api.post<Court>('/courts', court);
    return response.data;
  }

  async updateCourt(id: string, court: Partial<Court>): Promise<Court> {
    const response = await api.patch<Court>(`/courts/${id}`, court);
    return response.data;
  }

  async deleteCourt(id: string): Promise<void> {
    await api.delete(`/courts/${id}`);
  }
}
