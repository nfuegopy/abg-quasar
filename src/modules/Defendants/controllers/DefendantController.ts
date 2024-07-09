import { DefendantRepository } from '../repositories/DefendantRepository';
import { Defendant } from '../models/Defendant';

export class DefendantController {
  private repository: DefendantRepository;

  constructor() {
    this.repository = new DefendantRepository();
  }

  async getDefendants(): Promise<Defendant[]> {
    return this.repository.getDefendants();
  }

  async getDefendant(id: string): Promise<Defendant> {
    return this.repository.getDefendant(id);
  }

  async createDefendant(defendant: Omit<Defendant, 'id'>): Promise<Defendant> {
    return this.repository.createDefendant(defendant);
  }

  async updateDefendant(
    id: string,
    defendant: Partial<Defendant>
  ): Promise<Defendant> {
    return this.repository.updateDefendant(id, defendant);
  }

  async deleteDefendant(id: string): Promise<void> {
    return this.repository.deleteDefendant(id);
  }
}
