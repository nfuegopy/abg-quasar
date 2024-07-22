<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Estudio Jurídico </q-toolbar-title>
        <div v-if="isAuthenticated">
          {{ userName }}
          <q-btn flat dense round icon="logout" @click="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <q-item clickable to="/" exact>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item clickable to="/clients" exact>
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>Clientes</q-item-section>
        </q-item>
        <q-item clickable to="/defendants" exact>
          <q-item-section avatar>
            <q-icon name="gavel" />
          </q-item-section>
          <q-item-section>Demandados</q-item-section>
        </q-item>
        <q-item clickable to="/asset-types" exact>
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section>Tipo de Bienes</q-item-section>
        </q-item>
        <q-item clickable to="/assets" exact>
          <q-item-section avatar>
            <q-icon name="attach_money" />
          </q-item-section>
          <q-item-section>Bienes</q-item-section>
        </q-item>
        <q-item clickable to="/courts" exact>
          <q-item-section avatar>
            <q-icon name="account_balance" />
          </q-item-section>
          <q-item-section>Juzgados</q-item-section>
        </q-item>
        <q-item clickable to="/secretaries" exact>
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Secretarías</q-item-section>
        </q-item>
        <q-item clickable to="/cases" exact>
          <q-item-section avatar>
            <q-icon name="gavel" />
          </q-item-section>
          <q-item-section>Casos</q-item-section>
        </q-item>
        <q-item clickable to="/user" exact>
          <q-item-section avatar>
            <q-icon name="gavel" />
          </q-item-section>
          <q-item-section>Usuarios</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const leftDrawerOpen = ref(false);

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const userName = computed(() => authStore.user?.name || '');

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const logout = () => {
      authStore.logout();
      router.push('/login');
    };

    return {
      isAuthenticated,
      userName,
      leftDrawerOpen,
      toggleLeftDrawer,
      logout,
    };
  },
});
</script>
