<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 text-center q-mb-lg">
        <h2 class="text-h5 text-weight-bold q-my-none">
          <span class="text-primary">Últimos</span> Casos
        </h2>
        <q-separator
          class="q-mt-sm"
          style="max-width: 150px; margin: auto"
          color="primary"
        />
      </div>
      <div
        v-for="caso in ultimosCasos"
        :key="caso.id"
        class="col-xs-12 col-sm-6 col-md-4"
      >
        <q-card class="my-card cursor-pointer" v-ripple>
          <q-card-section>
            <div class="text-h6">Caso: {{ caso.case_number }}</div>
            <div class="text-subtitle2">
              Inicio: {{ formatDate(caso.start_date) }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="center">
            <q-btn
              flat
              color="primary"
              @click="toggleFlip(caso)"
              :icon="
                caso.showDetails ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
              "
              :label="caso.showDetails ? 'Ocultar detalles' : 'Ver detalles'"
            />
          </q-card-actions>

          <q-slide-transition>
            <div v-show="caso.showDetails">
              <q-separator />
              <q-card-section>
                <div><strong>Estado:</strong> {{ caso.current_status }}</div>
                <div>
                  <strong>Monto reclamado:</strong>
                  {{ formatCurrency(caso.claim_amount) }}
                </div>
                <div>
                  <strong>Observación:</strong>
                  {{ caso.observation || 'Sin observaciones' }}
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { CasesController } from 'src/modules/Cases/Controller/CasesController';
import { Case } from 'src/modules/Cases/Model/Case';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const casesController = new CasesController();
    const ultimosCasos = ref<(Case & { showDetails: boolean })[]>([]);

    const fetchUltimosCasos = async () => {
      try {
        const casos = await casesController.getCases();
        ultimosCasos.value = casos
          .sort(
            (a, b) =>
              new Date(b.start_date).getTime() -
              new Date(a.start_date).getTime()
          )
          .slice(0, 6)
          .map((caso) => ({ ...caso, showDetails: false }));
      } catch (error) {
        console.error('Error al obtener los casos:', error);
      }
    };

    const toggleFlip = (caso: Case & { showDetails: boolean }) => {
      caso.showDetails = !caso.showDetails;
    };

    const formatDate = (date: string | Date) => {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-PY', {
        style: 'currency',
        currency: 'PYG',
      }).format(amount);
    };

    onMounted(fetchUltimosCasos);

    return {
      ultimosCasos,
      toggleFlip,
      formatDate,
      formatCurrency,
    };
  },
});
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 350px;
  transition: all 0.3s ease-in-out;
}

.my-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style>
