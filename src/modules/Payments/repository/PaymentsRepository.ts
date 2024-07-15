import { api } from 'boot/axios';
import { Payment } from '../model/Payment';

export class PaymentsRepository {
  async getPayments(): Promise<Payment[]> {
    const response = await api.get<Payment[]>('/payments');
    return response.data;
  }

  async getPayment(id: string): Promise<Payment> {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  }

  async createPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
    const response = await api.post<Payment>('/payments', payment);
    return response.data;
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
    const response = await api.patch<Payment>(`/payments/${id}`, payment);
    return response.data;
  }

  async deletePayment(id: string): Promise<void> {
    await api.delete(`/payments/${id}`);
  }
}
