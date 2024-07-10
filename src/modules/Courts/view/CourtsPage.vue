<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h1 class="text-h4">Juzgados</h1>
      </div>
      <div class="col-12">
        <q-btn
          color="primary"
          label="Nuevo Juzgado"
          @click="openCreateDialog"
        />
      </div>
      <div class="col-12">
        <q-table
          :rows="courts"
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
                  @click="editCourt(props.row)"
                />
                <q-btn
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="deleteCourt(props.row.id)"
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
            {{ editingCourt.id ? 'Editar' : 'Nuevo' }} Juzgado
          </div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="editingCourt.name" label="Nombre" />
          <q-input v-model="editingCourt.address" label="Dirección" />
          <q-input v-model="editingCourt.phone" label="Teléfono" />
          <q-input v-model="editingCourt.email" label="Email" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="saveOrUpdateCourt"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { QTableColumn } from 'quasar';
import { CourtsController } from '../controller/courts.controller';
import { Court } from '../model/Court';

export default defineComponent({
  name: 'CourtsPage',
  setup() {
    const courtsController = new CourtsController();
    const courts = ref<Court[]>([]);
    const loading = ref(true);
    const filter = ref('');
    const dialogVisible = ref(false);
    const editingCourt = ref<Partial<Court>>({});

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
        name: 'address',
        align: 'left',
        label: 'Dirección',
        field: 'address',
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

    onMounted(async () => {
      try {
        courts.value = await courtsController.getCourts();
      } catch (error) {
        console.error('Error fetching courts:', error);
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      editingCourt.value = {};
      dialogVisible.value = true;
    };

    const editCourt = (court: Court) => {
      editingCourt.value = { ...court };
      dialogVisible.value = true;
    };

    const saveOrUpdateCourt = async () => {
      try {
        if (editingCourt.value.id) {
          await courtsController.updateCourt(
            editingCourt.value.id,
            editingCourt.value
          );
        } else {
          await courtsController.createCourt(
            editingCourt.value as Omit<Court, 'id'>
          );
        }
        dialogVisible.value = false;
        courts.value = await courtsController.getCourts();
      } catch (error) {
        console.error('Error saving or updating court:', error);
      }
    };

    const deleteCourt = async (id: string) => {
      try {
        await courtsController.deleteCourt(id);
        courts.value = courts.value.filter((court) => court.id !== id);
      } catch (error) {
        console.error('Error deleting court:', error);
      }
    };

    return {
      courts,
      loading,
      filter,
      columns,
      dialogVisible,
      editingCourt,
      openCreateDialog,
      editCourt,
      deleteCourt,
      saveOrUpdateCourt,
    };
  },
});
</script>
