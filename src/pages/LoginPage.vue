<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">
      <h5 class="q-my-md">Login</h5>
      <LoginForm />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginForm from 'components/LoginForm.vue';

export default defineComponent({
  name: 'LoginPage',
  components: {
    LoginForm,
  },
});
</script>
