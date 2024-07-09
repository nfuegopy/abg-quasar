<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h1 class="text-h4">Clientes</h1>
      </div>
      <div class="col-12">
        <q-btn
          color="primary"
          label="Nuevo Cliente"
          @click="openCreateDialog"
        />
      </div>
      <div class="col-12">
        <q-table
          :rows="clients"
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
                  @click="editClient(props.row)"
                />
                <q-btn
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="deleteClient(props.row.id)"
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
            {{ editingClient.id ? 'Editar' : 'Nuevo' }} Cliente
          </div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="editingClient.ci_ruc" label="CI/RUC" />
          <q-input v-model="editingClient.first_name" label="Nombre" />
          <q-input v-model="editingClient.last_name" label="Apellido" />
          <q-input v-model="editingClient.phone" label="Teléfono" />
          <q-input v-model="editingClient.email" label="Email" />
          <q-input v-model="editingClient.address" label="Dirección" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="saveOrUpdateClient"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { QTableColumn } from 'quasar';
import { ClientController } from '../controllers/ClientController';
import { Client } from 'src/modules/Clients/models/Client';

export default defineComponent({
  name: 'ClientsPage',
  setup() {
    const clientController = new ClientController();
    const clients = ref<Client[]>([]);
    const loading = ref(true);
    const filter = ref('');
    const dialogVisible = ref(false);
    const editingClient = ref<Partial<Client>>({});

    const columns: QTableColumn[] = [
      {
        name: 'ci_ruc',
        required: true,
        label: 'CI/RUC',
        align: 'left',
        field: (row: Client) => row.ci_ruc,
        sortable: true,
      },
      {
        name: 'first_name',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: (row: Client) => row.first_name,
        sortable: true,
      },
      {
        name: 'last_name',
        required: true,
        label: 'Apellido',
        align: 'left',
        field: (row: Client) => row.last_name,
        sortable: true,
      },
      {
        name: 'phone',
        align: 'left',
        label: 'Teléfono',
        field: (row: Client) => row.phone,
        sortable: true,
      },
      {
        name: 'email',
        align: 'left',
        label: 'Email',
        field: (row: Client) => row.email,
        sortable: true,
      },
      {
        name: 'address',
        align: 'left',
        label: 'Dirección',
        field: (row: Client) => row.address,
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
        clients.value = await clientController.getClients();
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      editingClient.value = {};
      dialogVisible.value = true;
    };

    const editClient = (client: Client) => {
      editingClient.value = { ...client };
      dialogVisible.value = true;
    };

    const createClient = async (client: Omit<Client, 'id'>) => {
      try {
        const newClient = await clientController.createClient(client);
        clients.value.push(newClient);
        return newClient;
      } catch (error) {
        console.error('Error creating client:', error);
        throw error;
      }
    };

    const updateClient = async (id: string, client: Partial<Client>) => {
      try {
        console.log('Updating client:', id, client);
        // Asegurarse de enviar solo los campos modificados
        const updatedFields = Object.keys(client).reduce((acc, key) => {
          if (client[key as keyof Client] !== undefined) {
            acc[key as keyof Client] = client[key as keyof Client];
          }
          return acc;
        }, {} as Partial<Client>);

        const updatedClient = await clientController.updateClient(
          id,
          updatedFields
        );
        console.log('Updated client:', updatedClient);
        const index = clients.value.findIndex((c) => c.id === id);
        if (index !== -1) {
          clients.value[index] = updatedClient;
        }
        return updatedClient;
      } catch (error) {
        console.error('Error updating client:', error);
        throw error;
      }
    };
    const saveOrUpdateClient = async () => {
      try {
        if (editingClient.value.id) {
          await updateClient(editingClient.value.id, editingClient.value);
        } else {
          await createClient(editingClient.value as Omit<Client, 'id'>);
        }
        dialogVisible.value = false;
        // Recargar la lista de clientes después de guardar o actualizar
        clients.value = await clientController.getClients();
      } catch (error) {
        console.error('Error saving or updating client:', error);
      }
    };

    const deleteClient = async (id: string) => {
      try {
        await clientController.deleteClient(id);
        clients.value = clients.value.filter((client) => client.id !== id);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    };

    return {
      clients,
      loading,
      filter,
      columns,
      dialogVisible,
      editingClient,
      openCreateDialog,
      editClient,
      deleteClient,
      saveOrUpdateClient,
    };
  },
});
</script>
