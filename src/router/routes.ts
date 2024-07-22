import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      // { path: 'login', component: () => import('pages/LoginPage.vue') },
      {
        path: 'clients',
        component: () => import('src/modules/Clients/View/ClientsPage.vue'),
      },
      {
        path: 'defendants',
        component: () =>
          import('src/modules/Defendants/View/DefendantPage.vue'),
      },
      {
        path: 'asset-types',
        component: () =>
          import('src/modules/AssetTypes/View/AssetTypesPage.vue'),
      },
      {
        path: 'assets',
        component: () => import('../modules/Assets/View/AssetsPage.vue'),
      },
      {
        path: 'courts',
        component: () => import('../modules/Courts/view/CourtsPage.vue'),
      },
      {
        path: 'secretaries',
        component: () =>
          import('../modules/Secretaries/View/SecretariesPage.vue'),
      },
      {
        path: 'cases',
        component: () => import('../modules/Cases/View/CasesPage.vue'),
      },
      {
        path: 'user',
        component: () => import('../modules/User/View/UserPage.vue'),
      },
    ],
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('src/pages/LoginPage.vue'),
    meta: { requiresAuth: false },
  },

  // ... otras rutas
];

export default routes;
