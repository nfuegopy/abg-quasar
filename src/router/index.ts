import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth';

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const store = useAuthStore();

    if (to.path === '/login') {
      if (store.isAuthenticated) {
        next('/'); // Redirige a la página principal si ya está autenticado
      } else {
        next(); // Permite acceso a la página de login
      }
    } else {
      if (store.isAuthenticated) {
        next(); // Permite acceso a otras páginas si está autenticado
      } else {
        next('/login'); // Redirige a la página de login si no está autenticado
      }
    }
  });

  return Router;
});
