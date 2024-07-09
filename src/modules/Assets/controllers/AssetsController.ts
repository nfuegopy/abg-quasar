// src/modules/referenciales/Assets/controllers/AssetsController.ts
import { Asset } from '../models/Asset';
import { AssetRepository } from '../repositories/AssetRepository';
import { AssetTypesController } from '../../AssetTypes/controllers/AssetTypesController';
import { AssetType } from 'src/modules/AssetTypes/models/AssetType';

export class AssetsController {
  private repository: AssetRepository;
  private assetTypesController: AssetTypesController;

  constructor() {
    this.repository = new AssetRepository();
    this.assetTypesController = new AssetTypesController();
  }

  async getAssets(): Promise<Asset[]> {
    return this.repository.getAssets();
  }

  async getAsset(id: string): Promise<Asset> {
    return this.repository.getAsset(id);
  }

  async createAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
    return this.repository.createAsset(asset);
  }

  async updateAsset(id: string, asset: Partial<Asset>): Promise<Asset> {
    return this.repository.updateAsset(id, asset);
  }

  async deleteAsset(id: string): Promise<void> {
    return this.repository.deleteAsset(id);
  }

  async getAssetTypes(): Promise<AssetType[]> {
    return this.assetTypesController.getAssetTypes();
  }
}
