import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
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
    ],
  },
  // ... otras rutas
];

export default routes;
