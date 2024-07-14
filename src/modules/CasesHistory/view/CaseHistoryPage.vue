<template>
  <q-page padding>
    <h1 class="text-h4 q-mb-md">Histórico de Casos</h1>

    <q-select
      v-model="selectedCase"
      :options="cases"
      option-label="case_number"
      label="Seleccione un caso"
      emit-value
      map-options
      @update:model-value="loadHistory"
    />

    <div v-if="loading" class="text-center q-mt-md">
      <q-spinner color="primary" size="3em" />
      <p>Cargando histórico...</p>
    </div>

    <div v-else-if="error" class="text-negative q-mt-md">
      {{ error }}
    </div>

    <q-timeline v-else color="secondary">
      <q-timeline-entry
        v-for="entry in caseHistory"
        :key="entry.id"
        :title="entry.action_type"
        :subtitle="new Date(entry.timestamp).toLocaleString()"
        icon="event"
      >
        <div>{{ entry.description }}</div>
        <div v-if="entry.changed_fields">
          <strong>Campos modificados:</strong>
          <ul>
            <li v-for="(value, key) in entry.changed_fields" :key="key">
              {{ key }}: {{ value }}
            </li>
          </ul>
        </div>
      </q-timeline-entry>
    </q-timeline>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { CasesController } from '../../Cases/Controller/CasesController';
import { CaseHistoryController } from '../Controller/CaseHistoryController';
import { Case } from '../../Cases/Model/Case';
import { CaseHistory } from '../Model/CaseHistory';

export default defineComponent({
  name: 'CaseHistoryPage',
  setup() {
    const $q = useQuasar();
    const casesController = new CasesController();
    const caseHistoryController = new CaseHistoryController();

    const cases = ref<Case[]>([]);
    const selectedCase = ref<string | null>(null);
    const caseHistory = ref<CaseHistory[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    onMounted(async () => {
      try {
        cases.value = await casesController.getCases();
      } catch (err) {
        console.error('Error fetching cases:', err);
        $q.notify({
          color: 'negative',
          message: 'Error al cargar los casos',
          icon: 'report_problem',
        });
      }
    });

    const loadHistory = async () => {
      if (selectedCase.value) {
        loading.value = true;
        error.value = null;
        try {
          caseHistory.value = await caseHistoryController.getCaseHistory(
            selectedCase.value
          );
        } catch (err) {
          console.error('Error fetching case history:', err);
          error.value =
            'Error al cargar el histórico del caso. Por favor, intente nuevamente.';
          $q.notify({
            color: 'negative',
            message: 'Error al cargar el histórico del caso',
            icon: 'report_problem',
          });
        } finally {
          loading.value = false;
        }
      }
    };

    return {
      cases,
      selectedCase,
      caseHistory,
      loadHistory,
      loading,
      error,
    };
  },
});
</script>
