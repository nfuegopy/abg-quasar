import { AssignCaseRepository } from '../Repository/AssignCaseRepository';
import { CasesController } from '../../Cases/Controller/CasesController';
import { ClientController } from '../../Clients/controllers/ClientController';
import { DefendantController } from '../../Defendants/controllers/DefendantController';
import { AssignCaseResponse } from '../Model/AssignCase';

export class AssignCaseController {
  private repository: AssignCaseRepository;
  private casesController: CasesController;
  private clientsController: ClientController;
  private defendantsController: DefendantController;

  constructor() {
    this.repository = new AssignCaseRepository();
    this.casesController = new CasesController();
    this.clientsController = new ClientController();
    this.defendantsController = new DefendantController();
  }

  async getCases() {
    return this.casesController.getCases();
  }

  async getClients() {
    return this.clientsController.getClients();
  }

  async getDefendants() {
    return this.defendantsController.getDefendants();
  }

  async assignCaseToClient(
    caseId: string,
    clientId: string
  ): Promise<AssignCaseResponse> {
    const result = await this.repository.assignCaseToClient(caseId, {
      client_id: clientId,
      relationship_type: 'demandante',
    });

    // Obtener información del cliente
    const client = await this.clientsController.getClient(clientId);

    // Actualizar el caso
    await this.casesController.updateCase(caseId, {
      current_status: 'Asignado',
      observation: `Asignado a cliente: ${client.first_name} ${client.last_name}`,
    });

    return result;
  }

  async assignCaseToDefendant(
    caseId: string,
    defendantId: string
  ): Promise<AssignCaseResponse> {
    const result = await this.repository.assignCaseToDefendant(caseId, {
      defendant_id: defendantId,
      relationship_type: 'demandado',
    });

    // Obtener información del demandado
    const defendant = await this.defendantsController.getDefendant(defendantId);

    // Actualizar el caso
    await this.casesController.updateCase(caseId, {
      current_status: 'Asignado',
      observation: `Asignado a demandado: ${defendant.first_name} ${defendant.last_name}`,
    });

    return result;
  }
}
