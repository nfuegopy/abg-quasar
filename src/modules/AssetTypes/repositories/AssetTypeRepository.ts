// src/modules/referenciales/AssetTypes/repositories/AssetTypeRepository.ts
import { api } from 'boot/axios';
import { AssetType } from '../models/AssetType';

export class AssetTypeRepository {
  async getAssetTypes(): Promise<AssetType[]> {
    const response = await api.get<AssetType[]>('/asset-types');
    return response.data;
  }

  async getAssetType(id: string): Promise<AssetType> {
    const response = await api.get<AssetType>(`/asset-types/${id}`);
    return response.data;
  }

  async createAssetType(assetType: Omit<AssetType, 'id'>): Promise<AssetType> {
    const response = await api.post<AssetType>('/asset-types', assetType);
    return response.data;
  }

  async updateAssetType(
    id: string,
    assetType: Partial<AssetType>
  ): Promise<AssetType> {
    const response = await api.patch<AssetType>(
      `/asset-types/${id}`,
      assetType
    );
    return response.data;
  }

  async deleteAssetType(id: string): Promise<void> {
    await api.delete(`/asset-types/${id}`);
  }
}
