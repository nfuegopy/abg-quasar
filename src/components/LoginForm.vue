<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      filled
      v-model="email"
      label="Email"
      type="email"
      :rules="[(val) => !!val || 'Email is required']"
    />
    <q-input
      filled
      v-model="password"
      label="Password"
      :type="isPwd ? 'password' : 'text'"
      :rules="[(val) => !!val || 'Password is required']"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <div>
      <q-btn label="Login" type="submit" color="primary" class="full-width" />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const isPwd = ref(true);
    const $q = useQuasar();

    const onSubmit = async () => {
      const success = await authStore.login(email.value, password.value);
      if (success) {
        router.push('/');
      } else {
        // Manejar error de login
        $q.notify({
          position: 'top-right',
          color: 'negative',
          message: 'Usuario o contraseña no validos',
        });
      }
    };

    return {
      email,
      password,
      isPwd,
      onSubmit,
    };
  },
});
</script>
