<!-- src/modules/referenciales/Assets/View/AssetsPage.vue -->
<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h1 class="text-h4">Activos</h1>
      </div>
      <div class="col-12">
        <q-btn color="primary" label="Nuevo Activo" @click="openCreateDialog" />
      </div>
      <div class="col-12">
        <q-table
          :rows="assets"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :filter="filter"
        >
          <template v-slot:top-right>
            <q-input dense debounce="300" v-model="filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn-group spread>
                <q-btn
                  color="primary"
                  icon="edit"
                  size="sm"
                  @click="editAsset(props.row)"
                />
                <q-btn
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="deleteAsset(props.row.id)"
                />
              </q-btn-group>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            {{ editingAsset.id ? 'Editar' : 'Nuevo' }} Activo
          </div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="editingAsset.type_id"
            :options="assetTypeOptions"
            label="Tipo de Activo"
            option-value="value"
            option-label="label"
            map-options
            emit-value
          />
          <q-input v-model="editingAsset.description" label="Descripción" />
          <q-input
            v-model.number="editingAsset.estimated_value"
            label="Valor Estimado"
            type="number"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="saveOrUpdateAsset"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { QTableColumn } from 'quasar';
import { AssetsController } from '../controllers/AssetsController';
import { Asset } from '../models/Asset';
import { AssetType } from '../../AssetTypes/models/AssetType';

export default defineComponent({
  name: 'AssetsPage',
  setup() {
    const assetsController = new AssetsController();
    const assets = ref<Asset[]>([]);
    const assetTypes = ref<AssetType[]>([]);
    const loading = ref(true);
    const filter = ref('');
    const dialogVisible = ref(false);
    const editingAsset = ref<Partial<Asset>>({});

    const columns: QTableColumn[] = [
      {
        name: 'type_id',
        required: true,
        label: 'Tipo de Activo',
        align: 'left',
        field: (row: Asset) => {
          const assetType = assetTypes.value.find(
            (type) => type.id === row.type_id
          );
          return assetType ? assetType.type_name : 'Desconocido';
        },
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: (row: Asset) => row.description,
        sortable: true,
      },
      {
        name: 'estimated_value',
        required: true,
        label: 'Valor Estimado',
        align: 'left',
        field: (row: Asset) => row.estimated_value,
        sortable: true,
        format: (val: number) => `$${val.toFixed(2)}`,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'actions',
        sortable: false,
      },
    ];

    const assetTypeOptions = computed(() => {
      return assetTypes.value.map((type) => ({
        label: type.type_name,
        value: type.id,
      }));
    });

    onMounted(async () => {
      try {
        assets.value = await assetsController.getAssets();
        assetTypes.value = await assetsController.getAssetTypes();
        console.log('Asset Types:', assetTypes.value); // Para depuración
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      editingAsset.value = {};
      dialogVisible.value = true;
    };

    const editAsset = (asset: Asset) => {
      editingAsset.value = { ...asset };
      dialogVisible.value = true;
    };

    const createAsset = async (asset: Omit<Asset, 'id'>) => {
      try {
        const newAsset = await assetsController.createAsset(asset);
        assets.value.push(newAsset);
        return newAsset;
      } catch (error) {
        console.error('Error creating asset:', error);
        throw error;
      }
    };

    const updateAsset = async (id: string, asset: Partial<Asset>) => {
      try {
        const updatedAsset = await assetsController.updateAsset(id, asset);
        const index = assets.value.findIndex((a) => a.id === id);
        if (index !== -1) {
          assets.value[index] = updatedAsset;
        }
        return updatedAsset;
      } catch (error) {
        console.error('Error updating asset:', error);
        throw error;
      }
    };

    const saveOrUpdateAsset = async () => {
      try {
        const assetData = {
          type_id: editingAsset.value.type_id,
          description: editingAsset.value.description,
          estimated_value: editingAsset.value.estimated_value,
        };

        if (editingAsset.value.id) {
          await updateAsset(editingAsset.value.id, assetData);
        } else {
          await createAsset(assetData as Omit<Asset, 'id'>);
        }
        dialogVisible.value = false;
        assets.value = await assetsController.getAssets();
      } catch (error) {
        console.error('Error saving or updating asset:', error);
      }
    };

    const deleteAsset = async (id: string) => {
      try {
        await assetsController.deleteAsset(id);
        assets.value = assets.value.filter((asset) => asset.id !== id);
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    };

    return {
      assets,
      loading,
      filter,
      columns,
      dialogVisible,
      editingAsset,
      assetTypeOptions,
      openCreateDialog,
      editAsset,
      deleteAsset,
      saveOrUpdateAsset,
    };
  },
});
</script>
