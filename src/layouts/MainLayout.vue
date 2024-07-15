<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="src/assets/3183165.png" />
          </q-avatar>
          Estudio Jurídico
        </q-toolbar-title>
        <q-space />
        <div v-if="isAuthenticated">
          {{ userName }}
          <q-btn flat dense round icon="logout" @click="logout">
            <q-tooltip>Cerrar sesión</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" icon="home" label="Mi Espacio" />

        <q-btn-dropdown stretch flat icon="people" label="Personas">
          <q-list>
            <q-item clickable v-close-popup to="/clients">
              <q-item-section avatar>
                <q-icon name="group" />
              </q-item-section>
              <q-item-section>Clientes</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/defendants">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>Demandados</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn-dropdown stretch flat icon="domain" label="Bienes">
          <q-list>
            <q-item clickable v-close-popup to="/assets">
              <q-item-section avatar>
                <q-icon name="attach_money" />
              </q-item-section>
              <q-item-section>Bienes</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/asset-types">
              <q-item-section avatar>
                <q-icon name="category" />
              </q-item-section>
              <q-item-section>Tipo de Bienes</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn-dropdown stretch flat icon="gavel" label="Casos">
          <q-list>
            <q-item clickable v-close-popup to="/cases">
              <q-item-section avatar>
                <q-icon name="work" />
              </q-item-section>
              <q-item-section>Casos</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/assign-case">
              <q-item-section avatar>
                <q-icon name="assignment" />
              </q-item-section>
              <q-item-section>Asignar Caso</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/case-history">
              <q-item-section avatar>
                <q-icon name="history" />
              </q-item-section>
              <q-item-section>Historico</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn-dropdown stretch flat icon="business" label="Instituciones">
          <q-list>
            <q-item clickable v-close-popup to="/courts">
              <q-item-section avatar>
                <q-icon name="account_balance" />
              </q-item-section>
              <q-item-section>Juzgados</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/secretaries">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>Secretarías</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn-dropdown stretch flat icon="payments" label="Pagos">
          <q-list>
            <q-item clickable v-close-popup to="/payments">
              <q-item-section avatar>
                <q-icon name="receipt" />
              </q-item-section>
              <q-item-section>Pagos</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const userName = computed(() => authStore.user?.name || '');

    const logout = () => {
      authStore.logout();
      router.push('/login');
    };

    return {
      isAuthenticated,
      userName,
      logout,
    };
  },
});
</script>
