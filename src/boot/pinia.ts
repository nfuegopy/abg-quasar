import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';

export default boot(({ app }) => {
  const pinia = createPinia();
  pinia.use(piniaPersist);
  app.use(pinia);
});
