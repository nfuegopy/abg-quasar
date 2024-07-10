import { CasesRepository } from '../Repositories/CasesRepository';
import { Case, CaseWithDetails } from '../Model/Case';
import { Court } from '../../Courts/model/Court';
import { Secretary } from '../../Secretaries/Model/Secretary';
import { CourtsRepository } from '../../Courts/repositories/CourtsRepository';
import { SecretariesRepository } from '../../Secretaries/Repositories/SecretariesRepository';

export class CasesController {
  private casesRepository: CasesRepository;
  private courtsRepository: CourtsRepository;
  private secretariesRepository: SecretariesRepository;

  constructor() {
    this.casesRepository = new CasesRepository();
    this.courtsRepository = new CourtsRepository();
    this.secretariesRepository = new SecretariesRepository();
  }

  async getCases(): Promise<CaseWithDetails[]> {
    return this.casesRepository.getCases();
  }

  async getCase(id: string): Promise<CaseWithDetails> {
    return this.casesRepository.getCase(id);
  }

  async createCase(
    caseData: Omit<Case, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Case> {
    return this.casesRepository.createCase(caseData);
  }

  async updateCase(id: string, caseData: Partial<Case>): Promise<Case> {
    return this.casesRepository.updateCase(id, caseData);
  }

  async deleteCase(id: string): Promise<void> {
    return this.casesRepository.deleteCase(id);
  }

  async getCourts(): Promise<Court[]> {
    return this.courtsRepository.getCourts();
  }

  async getSecretaries(): Promise<Secretary[]> {
    return this.secretariesRepository.getSecretaries();
  }
}
