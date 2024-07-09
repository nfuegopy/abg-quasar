<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h1 class="text-h4">Tipos de Activos</h1>
      </div>
      <div class="col-12">
        <q-btn
          color="primary"
          label="Nuevo Tipo de Activo"
          @click="openCreateDialog"
        />
      </div>
      <div class="col-12">
        <q-table
          :rows="assetTypes"
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
                  @click="editAssetType(props.row)"
                />
                <q-btn
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="deleteAssetType(props.row.id)"
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
            {{ editingAssetType.id ? 'Editar' : 'Nuevo' }} Tipo de Activo
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="editingAssetType.type_name"
            label="Nombre del Tipo"
          />
          <q-input v-model="editingAssetType.description" label="Descripción" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="saveOrUpdateAssetType"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { QTableColumn } from 'quasar';
import { AssetTypesController } from '../controllers/AssetTypesController';
import { AssetType } from '../models/AssetType';

export default defineComponent({
  name: 'AssetTypesPage',
  setup() {
    const assetTypesController = new AssetTypesController();
    const assetTypes = ref<AssetType[]>([]);
    const loading = ref(true);
    const filter = ref('');
    const dialogVisible = ref(false);
    const editingAssetType = ref<Partial<AssetType>>({});

    const columns: QTableColumn[] = [
      {
        name: 'type_name',
        required: true,
        label: 'Nombre del Tipo',
        align: 'left',
        field: (row: AssetType) => row.type_name,
        sortable: true,
      },
      {
        name: 'description',
        label: 'Descripción',
        align: 'left',
        field: (row: AssetType) => row.description,
        sortable: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'actions',
        sortable: false,
      },
    ];

    onMounted(async () => {
      try {
        assetTypes.value = await assetTypesController.getAssetTypes();
      } catch (error) {
        console.error('Error fetching asset types:', error);
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      editingAssetType.value = {};
      dialogVisible.value = true;
    };

    const editAssetType = (assetType: AssetType) => {
      editingAssetType.value = { ...assetType };
      dialogVisible.value = true;
    };

    const createAssetType = async (assetType: Omit<AssetType, 'id'>) => {
      try {
        const newAssetType = await assetTypesController.createAssetType(
          assetType
        );
        assetTypes.value.push(newAssetType);
        return newAssetType;
      } catch (error) {
        console.error('Error creating asset type:', error);
        throw error;
      }
    };

    const updateAssetType = async (
      id: string,
      assetType: Partial<AssetType>
    ) => {
      try {
        const updatedAssetType = await assetTypesController.updateAssetType(
          id,
          assetType
        );
        const index = assetTypes.value.findIndex((c) => c.id === id);
        if (index !== -1) {
          assetTypes.value[index] = updatedAssetType;
        }
        return updatedAssetType;
      } catch (error) {
        console.error('Error updating asset type:', error);
        throw error;
      }
    };

    const saveOrUpdateAssetType = async () => {
      try {
        if (editingAssetType.value.id) {
          await updateAssetType(
            editingAssetType.value.id,
            editingAssetType.value
          );
        } else {
          await createAssetType(
            editingAssetType.value as Omit<AssetType, 'id'>
          );
        }
        dialogVisible.value = false;
        assetTypes.value = await assetTypesController.getAssetTypes();
      } catch (error) {
        console.error('Error saving or updating asset type:', error);
      }
    };

    const deleteAssetType = async (id: string) => {
      try {
        await assetTypesController.deleteAssetType(id);
        assetTypes.value = assetTypes.value.filter(
          (assetType) => assetType.id !== id
        );
      } catch (error) {
        console.error('Error deleting asset type:', error);
      }
    };

    return {
      assetTypes,
      loading,
      filter,
      columns,
      dialogVisible,
      editingAssetType,
      openCreateDialog,
      editAssetType,
      deleteAssetType,
      saveOrUpdateAssetType,
    };
  },
});
</script>
