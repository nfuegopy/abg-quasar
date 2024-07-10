<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h1 class="text-h4">Secretarías</h1>
      </div>
      <div class="col-12">
        <q-btn
          color="primary"
          label="Nueva Secretaría"
          @click="openCreateDialog"
        />
      </div>
      <div class="col-12">
        <q-table
          :rows="secretaries"
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
                  @click="editSecretary(props.row)"
                />
                <q-btn
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="deleteSecretary(props.row.id)"
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
            {{ editingSecretary.id ? 'Editar' : 'Nueva' }} Secretaría
          </div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="editingSecretary.name" label="Nombre" />
          <q-select
            v-model="editingSecretary.court_id"
            :options="courtOptions"
            label="Juzgado"
            option-value="value"
            option-label="label"
            map-options
            emit-value
          />
          <q-input v-model="editingSecretary.phone" label="Teléfono" />
          <q-input v-model="editingSecretary.email" label="Email" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="saveOrUpdateSecretary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { QTableColumn } from 'quasar';
import { SecretariesController } from '../Controller/secretaries.controller';
import { Secretary } from '../Model/Secretary';
import { Court } from '../../Courts/model/Court';

export default defineComponent({
  name: 'SecretariesPage',
  setup() {
    const secretariesController = new SecretariesController();
    const secretaries = ref<Secretary[]>([]);
    const courts = ref<Court[]>([]);
    const loading = ref(true);
    const filter = ref('');
    const dialogVisible = ref(false);
    const editingSecretary = ref<Partial<Secretary>>({});

    const columns: QTableColumn[] = [
      {
        name: 'name',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'court_id',
        align: 'left',
        label: 'Juzgado',
        field: (row) => {
          const court = courts.value.find((c) => c.id === row.court_id);
          return court ? court.name : 'Desconocido';
        },
        sortable: true,
      },
      {
        name: 'phone',
        align: 'left',
        label: 'Teléfono',
        field: 'phone',
        sortable: true,
      },
      {
        name: 'email',
        align: 'left',
        label: 'Email',
        field: 'email',
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

    const courtOptions = computed(() => {
      return courts.value.map((court) => ({
        label: court.name,
        value: court.id,
      }));
    });

    onMounted(async () => {
      try {
        [secretaries.value, courts.value] = await Promise.all([
          secretariesController.getSecretaries(),
          secretariesController.getCourts(),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      editingSecretary.value = {};
      dialogVisible.value = true;
    };

    const editSecretary = (secretary: Secretary) => {
      editingSecretary.value = { ...secretary };
      dialogVisible.value = true;
    };

    const saveOrUpdateSecretary = async () => {
      try {
        if (editingSecretary.value.id) {
          await secretariesController.updateSecretary(
            editingSecretary.value.id,
            editingSecretary.value
          );
        } else {
          await secretariesController.createSecretary(
            editingSecretary.value as Omit<Secretary, 'id'>
          );
        }
        dialogVisible.value = false;
        secretaries.value = await secretariesController.getSecretaries();
      } catch (error) {
        console.error('Error saving or updating secretary:', error);
      }
    };

    const deleteSecretary = async (id: string) => {
      try {
        await secretariesController.deleteSecretary(id);
        secretaries.value = secretaries.value.filter(
          (secretary) => secretary.id !== id
        );
      } catch (error) {
        console.error('Error deleting secretary:', error);
      }
    };

    return {
      secretaries,
      loading,
      filter,
      columns,
      dialogVisible,
      editingSecretary,
      courtOptions,
      openCreateDialog,
      editSecretary,
      deleteSecretary,
      saveOrUpdateSecretary,
    };
  },
});
</script>
