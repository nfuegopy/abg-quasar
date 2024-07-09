// src/modules/referenciales/AssetTypes/controllers/AssetTypesController.ts
import { AssetType } from '../models/AssetType';
import { AssetTypeRepository } from '../repositories/AssetTypeRepository';

export class AssetTypesController {
  private repository: AssetTypeRepository;

  constructor() {
    this.repository = new AssetTypeRepository();
  }

  async getAssetTypes(): Promise<AssetType[]> {
    return this.repository.getAssetTypes();
  }

  async getAssetType(id: string): Promise<AssetType> {
    return this.repository.getAssetType(id);
  }

  async createAssetType(assetType: Omit<AssetType, 'id'>): Promise<AssetType> {
    return this.repository.createAssetType(assetType);
  }

  async updateAssetType(
    id: string,
    assetType: Partial<AssetType>
  ): Promise<AssetType> {
    return this.repository.updateAssetType(id, assetType);
  }

  async deleteAssetType(id: string): Promise<void> {
    return this.repository.deleteAssetType(id);
  }
}
