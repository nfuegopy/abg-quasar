import { PaymentsRepository } from '../repository/PaymentsRepository';
import { Payment } from '../model/Payment';
import { CasesController } from '../../Cases/Controller/CasesController';
import { CaseHistoryController } from '../../CasesHistory/Controller/CaseHistoryController';

export class PaymentsController {
  private repository: PaymentsRepository;
  private casesController: CasesController;
  private caseHistoryController: CaseHistoryController;

  constructor() {
    this.repository = new PaymentsRepository();
    this.casesController = new CasesController();
    this.caseHistoryController = new CaseHistoryController();
  }

  async getPayments(): Promise<Payment[]> {
    return this.repository.getPayments();
  }

  async getPayment(id: string): Promise<Payment> {
    return this.repository.getPayment(id);
  }

  async createPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
    const newPayment = await this.repository.createPayment(payment);
    await this.updateCaseAndHistory(newPayment, 'CREATE');
    return newPayment;
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
    const updatedPayment = await this.repository.updatePayment(id, payment);
    await this.updateCaseAndHistory(updatedPayment, 'UPDATE');
    return updatedPayment;
  }

  async deletePayment(id: string): Promise<void> {
    const paymentToDelete = await this.getPayment(id);
    await this.repository.deletePayment(id);
    await this.updateCaseAndHistory(paymentToDelete, 'DELETE');
  }

  private async updateCaseAndHistory(
    payment: Payment,
    action: 'CREATE' | 'UPDATE' | 'DELETE'
  ): Promise<void> {
    const caseToUpdate = await this.casesController.getCase(payment.case_id);
    let newBalance: number;
    let description: string;

    switch (action) {
      case 'CREATE':
      case 'UPDATE':
        newBalance = (caseToUpdate.claim_amount || 0) - payment.amount;
        description = `Se procedió al cobro vía ${payment.payment_type} por el monto de ${payment.amount}. Saldo restante: ${newBalance}`;
        break;
      case 'DELETE':
        newBalance = (caseToUpdate.claim_amount || 0) + payment.amount;
        description = `Se eliminó un pago de ${payment.amount}. Saldo actualizado: ${newBalance}`;
        break;
    }

    await this.casesController.updateCase(caseToUpdate.id, {
      claim_amount: newBalance,
    });

    await this.caseHistoryController.createCaseHistory({
      case_id: caseToUpdate.id,
      action_type: action,
      description,
      changed_fields: {
        claim_amount: newBalance,
        payment_id: payment.id,
        payment_amount: payment.amount,
        payment_type: payment.payment_type,
      },
      user_id: 'current_user_id', // Reemplazar con el ID de usuario real
      timestamp: new Date().toISOString(), // Añadimos el timestamp aquí
    });
  }
}
