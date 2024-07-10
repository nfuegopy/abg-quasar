import { CourtsRepository } from '../repositories/CourtsRepository';
import { Court } from '../model/Court';

export class CourtsController {
  private repository: CourtsRepository;

  constructor() {
    this.repository = new CourtsRepository();
  }

  async getCourts(): Promise<Court[]> {
    return this.repository.getCourts();
  }

  async getCourt(id: string): Promise<Court> {
    return this.repository.getCourt(id);
  }

  async createCourt(court: Omit<Court, 'id'>): Promise<Court> {
    return this.repository.createCourt(court);
  }

  async updateCourt(id: string, court: Partial<Court>): Promise<Court> {
    return this.repository.updateCourt(id, court);
  }

  async deleteCourt(id: string): Promise<void> {
    return this.repository.deleteCourt(id);
  }
}
