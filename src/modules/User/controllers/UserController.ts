import { UsersRepository } from '../repositories/UserRepository';
import { User } from '../models/User';

export class UsersController {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.getUsers();
  }

  async getUser(id: string): Promise<User> {
    return this.usersRepository.getUser(id);
  }

  async createUser(
    userData: Omit<User, 'id' | 'created_at' | 'updated_at'>
  ): Promise<User> {
    return this.usersRepository.createUser(userData);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return this.usersRepository.updateUser(id, userData);
  }

  async deleteUser(id: string): Promise<void> {
    return this.usersRepository.deleteUser(id);
  }
}
