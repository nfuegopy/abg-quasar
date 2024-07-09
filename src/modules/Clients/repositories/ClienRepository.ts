import { api } from 'boot/axios';
import { Client } from '../models/Client';

export class ClientRepository {
  async getClients(): Promise<Client[]> {
    const response = await api.get<Client[]>('/clients');
    return response.data;
  }

  async getClient(id: string): Promise<Client> {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  }

  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    const response = await api.post<Client>('/clients', client);
    return response.data;
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client> {
    const response = await api.patch<Client>(`/clients/${id}`, client);
    return response.data;
  }

  async deleteClient(id: string): Promise<void> {
    await api.delete(`/clients/${id}`);
  }
}
