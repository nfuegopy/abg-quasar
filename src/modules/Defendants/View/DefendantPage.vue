<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h1 class="text-h4">Demandados</h1>
      </div>
      <div class="col-12">
        <q-btn
          color="primary"
          label="Nuevo Demandado"
          @click="openCreateDialog"
        />
      </div>
      <div class="col-12">
        <q-table
          :rows="defendants"
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
                  @click="editDefendant(props.row)"
                />
                <q-btn
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="deleteDefendant(props.row.id)"
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
            {{ editingDefendant.id ? 'Editar' : 'Nuevo' }} Defendant
          </div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="editingDefendant.ci_ruc" label="CI/RUC" />
          <q-input v-model="editingDefendant.first_name" label="Nombre" />
          <q-input v-model="editingDefendant.last_name" label="Apellido" />
          <q-input v-model="editingDefendant.phone" label="Teléfono" />
          <q-input v-model="editingDefendant.email" label="Email" />
          <q-input v-model="editingDefendant.address" label="Dirección" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="saveOrUpdateDefendant"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { QTableColumn } from 'quasar';
import { DefendantController } from '../controllers/DefendantController';
import { Defendant } from '../models/Defendant';

export default defineComponent({
  name: 'DefendantsPage',
  setup() {
    const defendantController = new DefendantController();
    const defendants = ref<Defendant[]>([]);
    const loading = ref(true);
    const filter = ref('');
    const dialogVisible = ref(false);
    const editingDefendant = ref<Partial<Defendant>>({});

    const columns: QTableColumn[] = [
      {
        name: 'ci_ruc',
        required: true,
        label: 'CI/RUC',
        align: 'left',
        field: (row: Defendant) => row.ci_ruc,
        sortable: true,
      },
      {
        name: 'first_name',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: (row: Defendant) => row.first_name,
        sortable: true,
      },
      {
        name: 'last_name',
        required: true,
        label: 'Apellido',
        align: 'left',
        field: (row: Defendant) => row.last_name,
        sortable: true,
      },
      {
        name: 'phone',
        align: 'left',
        label: 'Teléfono',
        field: (row: Defendant) => row.phone,
        sortable: true,
      },
      {
        name: 'email',
        align: 'left',
        label: 'Email',
        field: (row: Defendant) => row.email,
        sortable: true,
      },
      {
        name: 'address',
        align: 'left',
        label: 'Dirección',
        field: (row: Defendant) => row.address,
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
        defendants.value = await defendantController.getDefendants();
      } catch (error) {
        console.error('Error fetching Defendants:', error);
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      editingDefendant.value = {};
      dialogVisible.value = true;
    };

    const editDefendant = (defendant: Defendant) => {
      editingDefendant.value = { ...defendant };
      dialogVisible.value = true;
    };

    const createDefendant = async (defendant: Omit<Defendant, 'id'>) => {
      try {
        const newDefendant = await defendantController.createDefendant(
          defendant
        );
        defendants.value.push(newDefendant);
        return newDefendant;
      } catch (error) {
        console.error('Error creating Defendant:', error);
        throw error;
      }
    };

    const updateDefendant = async (
      id: string,
      defendant: Partial<Defendant>
    ) => {
      try {
        console.log('Updating Defendant:', id, defendant);
        // Asegurarse de enviar solo los campos modificados
        const updatedFields = Object.keys(defendant).reduce((acc, key) => {
          if (defendant[key as keyof Defendant] !== undefined) {
            acc[key as keyof Defendant] = defendant[key as keyof Defendant];
          }
          return acc;
        }, {} as Partial<Defendant>);

        const updatedDefendant = await defendantController.updateDefendant(
          id,
          updatedFields
        );
        console.log('Updated Defendant:', updatedDefendant);
        const index = defendants.value.findIndex((c) => c.id === id);
        if (index !== -1) {
          defendants.value[index] = updatedDefendant;
        }
        return updatedDefendant;
      } catch (error) {
        console.error('Error updating Defendant:', error);
        throw error;
      }
    };
    const saveOrUpdateDefendant = async () => {
      try {
        if (editingDefendant.value.id) {
          await updateDefendant(
            editingDefendant.value.id,
            editingDefendant.value
          );
        } else {
          await createDefendant(
            editingDefendant.value as Omit<Defendant, 'id'>
          );
        }
        dialogVisible.value = false;
        // Recargar la lista de clientes después de guardar o actualizar
        defendants.value = await defendantController.getDefendants();
      } catch (error) {
        console.error('Error saving or updating Defendant:', error);
      }
    };

    const deleteDefendant = async (id: string) => {
      try {
        await defendantController.deleteDefendant(id);
        defendants.value = defendants.value.filter(
          (defendant) => defendant.id !== id
        );
      } catch (error) {
        console.error('Error deleting Defendant:', error);
      }
    };

    return {
      defendants,
      loading,
      filter,
      columns,
      dialogVisible,
      editingDefendant,
      openCreateDialog,
      editDefendant,
      deleteDefendant,
      saveOrUpdateDefendant,
    };
  },
});
</script>
