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
        path: 'assign-case',
        component: () =>
          import('../modules/AssignCasesPage/View/AssignCasePage.vue'),
      },
      {
        path: 'case-history',
        component: () =>
          import('../modules/CasesHistory/view/CaseHistoryPage.vue'),
      },
      {
        path: 'payments',
        component: () => import('../modules/Payments/view/PaymentsPage.vue'),
      },
    ],
  },
  // ... otras rutas
];

export default routes;
