<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <div class="text-h6 q-mb-md">{{ formattedDate }}</div>
      <q-btn
        @click="updateTime"
        label="Actualizar Hora"
        unelevated
        color="primary"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const currentDate = ref(new Date());

const formattedDate = computed(() => {
  return format(currentDate.value, "eeee, d 'de' MMMM 'del' yyyy, HH:mm:ss", {
    locale: es,
  });
});

const updateTime = () => {
  currentDate.value = new Date(); // Actualiza la fecha y hora actuales
};

onMounted(() => {
  const interval = setInterval(() => {
    currentDate.value = new Date();
  }, 1000); // Actualiza cada segundo

  onUnmounted(() => {
    clearInterval(interval); // Limpia el intervalo al desmontar el componente
  });
});
</script>

<style scoped>
.flex-center {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
