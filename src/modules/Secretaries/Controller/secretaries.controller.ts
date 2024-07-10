import { SecretariesRepository } from '../Repositories/SecretariesRepository';
import { Secretary } from '../Model/Secretary';
import { CourtsRepository } from '../../Courts/repositories/CourtsRepository';
import { Court } from '../../Courts/model/Court';

export class SecretariesController {
  private repository: SecretariesRepository;
  private courtsRepository: CourtsRepository;
  constructor() {
    this.repository = new SecretariesRepository();
    this.courtsRepository = new CourtsRepository();
  }

  async getSecretaries(): Promise<Secretary[]> {
    return this.repository.getSecretaries();
  }

  async getSecretary(id: string): Promise<Secretary> {
    return this.repository.getSecretary(id);
  }

  async createSecretary(secretary: Omit<Secretary, 'id'>): Promise<Secretary> {
    return this.repository.createSecretary(secretary);
  }

  async updateSecretary(
    id: string,
    secretary: Partial<Secretary>
  ): Promise<Secretary> {
    return this.repository.updateSecretary(id, secretary);
  }

  async deleteSecretary(id: string): Promise<void> {
    return this.repository.deleteSecretary(id);
  }

  async getCourts(): Promise<Court[]> {
    return this.courtsRepository.getCourts();
  }
}
