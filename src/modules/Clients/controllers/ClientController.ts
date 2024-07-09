import { ClientRepository } from '../repositories/ClienRepository';
import { Client } from '../models/Client';

export class ClientController {
  private repository: ClientRepository;

  constructor() {
    this.repository = new ClientRepository();
  }

  async getClients(): Promise<Client[]> {
    return this.repository.getClients();
  }

  async getClient(id: string): Promise<Client> {
    return this.repository.getClient(id);
  }

  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    return this.repository.createClient(client);
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client> {
    return this.repository.updateClient(id, client);
  }

  async deleteClient(id: string): Promise<void> {
    return this.repository.deleteClient(id);
  }
}
