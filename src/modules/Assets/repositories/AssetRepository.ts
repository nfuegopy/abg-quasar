// src/modules/referenciales/Assets/repositories/AssetRepository.ts
import { api } from 'boot/axios';
import { Asset } from '../models/Asset';

export class AssetRepository {
  async getAssets(): Promise<Asset[]> {
    const response = await api.get<Asset[]>('/assets');
    return response.data;
  }

  async getAsset(id: string): Promise<Asset> {
    const response = await api.get<Asset>(`/assets/${id}`);
    return response.data;
  }

  async createAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
    const response = await api.post<Asset>('/assets', asset);
    return response.data;
  }

  async updateAsset(id: string, asset: Partial<Asset>): Promise<Asset> {
    const response = await api.patch<Asset>(`/assets/${id}`, asset);
    return response.data;
  }

  async deleteAsset(id: string): Promise<void> {
    await api.delete(`/assets/${id}`);
  }
}
