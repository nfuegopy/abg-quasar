<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h1 class="text-h4">Usuarios</h1>
      </div>
      <div class="col-12">
        <q-btn
          color="primary"
          label="Nuevo Usuario"
          @click="openCreateDialog"
        />
      </div>
      <div class="col-12">
        <q-table
          :rows="users"
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
                  @click="editUser(props.row)"
                />
                <q-btn
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="deleteUser(props.row.id)"
                />
              </q-btn-group>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
    <q-dialog class="row" v-model="dialogVisible" persistent>
      <q-card style="min-width: 680px; padding-right: -30px">
        <q-card-section>
          <div class="text-h6">
            {{ editingUser.id ? 'Editar' : 'Nuevo' }} Usuario
          </div>
        </q-card-section>
        <q-card-section class="col q-gutter-sm">
          <div class="row q-gutter-sm">
            <q-input
              v-model="editingUser.name"
              label="Nombre"
              outlined
              dense
              class="col-6"
            />
            <q-input
              v-model="editingUser.email"
              label="Correo Electrónico"
              outlined
              dense
              class="col-6"
            />
            <q-input
              v-model="editingUser.password"
              label="Contraseña"
              outlined
              dense
              class="col-6"
            />
            <q-toggle
              v-model="editingUser.is_active"
              label="Activo"
              dense
              class="col-3"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="saveOrUpdateUser"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { QTableColumn } from 'quasar';
import { UsersController } from '../controllers/UserController';
import { User } from '../models/User';

export default defineComponent({
  name: 'UsersPage',
  setup() {
    const usersController = new UsersController();
    const users = ref<User[]>([]);
    const loading = ref(true);
    const filter = ref('');
    const dialogVisible = ref(false);
    const editingUser = ref<Partial<User>>({});

    const columns: QTableColumn[] = [
      {
        name: 'name',
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'email',
        label: 'Correo Electrónico',
        align: 'left',
        field: 'email',
        sortable: true,
      },
      {
        name: 'is_active',
        label: 'Activo',
        align: 'center',
        field: 'is_active',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
      },
    ];

    onMounted(async () => {
      try {
        users.value = await usersController.getUsers();
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      editingUser.value = {};
      dialogVisible.value = true;
    };

    const editUser = (user: User) => {
      editingUser.value = { ...user };
      dialogVisible.value = true;
    };

    const saveOrUpdateUser = async () => {
      try {
        if (editingUser.value.id) {
          await usersController.updateUser(
            editingUser.value.id,
            editingUser.value as User
          );
        } else {
          await usersController.createUser(
            editingUser.value as Omit<User, 'id' | 'created_at' | 'updated_at'>
          );
        }
        dialogVisible.value = false;
        users.value = await usersController.getUsers();
      } catch (error) {
        console.error('Error saving or updating user:', error);
      }
    };

    const deleteUser = async (id: string) => {
      try {
        await usersController.deleteUser(id);
        users.value = users.value.filter((user) => user.id !== id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };

    return {
      users,
      loading,
      filter,
      columns,
      dialogVisible,
      editingUser,
      openCreateDialog,
      editUser,
      deleteUser,
      saveOrUpdateUser,
    };
  },
});
</script>
