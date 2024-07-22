<template>
  <div class="q-pa-md row justify-center items-center" style="height: 100vh">
    <q-card
      class="q-pa-md"
      :style="{
        width:
          $q.screen.width > 1200
            ? '30%'
            : $q.screen.width > 992
            ? '40%'
            : $q.screen.width > 768
            ? '60%'
            : $q.screen.width > 600
            ? '70%'
            : '80%',
      }"
    >
      <q-card-section class="q-pb-none">
        <div class="text-h6 text-center q-pb-md">
          <div class="q-mb-md" style="text-align: center">
            <img
              src="~assets/logo.avif"
              alt="Logo"
              style="max-width: 100%; height: auto; max-height: 200px"
            />
          </div>
          <h2 class="text-h4 text-weight-regular" style="color: #b99f62">
            Bienvenido/a
          </h2>
        </div>
      </q-card-section>
      <q-card-section>
        <LoginForm />
      </q-card-section>
      <p class="mb-14 px-5 py-3 text-center text-xs">
        ABG{{ new Date().getFullYear() }}
      </p>
    </q-card>
  </div>
  <!-- <div class="flex flex-center q-pa-md">
    <q-card class="q-pa-md" style="max-width: 400px; width: 100%">
      <q-card-section>
        <div class="text-h5 q-my-md">Login</div>
      </q-card-section>
      <q-card-section>
        <LoginForm />
      </q-card-section>
    </q-card>
  </div> -->
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
