<template>
  <q-page padding>
    <h1 class="text-h4 q-mb-md">Histórico de Casos</h1>

    <q-select
      v-model="selectedCase"
      :options="cases"
      option-value="id"
      option-label="case_number"
      label="Seleccione un caso"
      emit-value
      map-options
      @update:model-value="loadHistory"
      class="q-mb-md"
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
        :title="getEntryTitle(entry)"
        :subtitle="
          entry.timestamp ? formatDate(entry.timestamp) : 'Fecha no disponible'
        "
        :icon="getEntryIcon(entry)"
        :color="getEntryColor(entry)"
      >
        <q-card class="q-pa-md">
          <q-card-section>
            <div v-if="entry.changed_fields">
              <div
                v-for="(value, key) in getRelevantFields(entry)"
                :key="key"
                class="q-mb-xs"
              >
                <strong>{{ formatFieldName(key) }}:</strong>
                {{ formatFieldValue(key, value) }}
              </div>
            </div>
          </q-card-section>
        </q-card>
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
          const history = await caseHistoryController.getCaseHistory(
            selectedCase.value
          );
          console.log('Historia del caso recibida:', history); // Agregar este log
          caseHistory.value = history;
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
    const getEntryTitle = (entry: CaseHistory) => {
      switch (entry.action_type) {
        case 'CREATE':
          return 'Caso Creado';
        case 'UPDATE':
          return 'Caso Actualizado';
        default:
          return entry.action_type;
      }
    };

    const getEntryIcon = (entry: CaseHistory) => {
      switch (entry.action_type) {
        case 'CREATE':
          return 'add_circle';
        case 'UPDATE':
          return 'update';
        default:
          return 'event';
      }
    };

    const getEntryColor = (entry: CaseHistory) => {
      switch (entry.action_type) {
        case 'CREATE':
          return 'positive';
        case 'UPDATE':
          return 'info';
        default:
          return 'secondary';
      }
    };

    const formatFieldName = (fieldName: string) => {
      const fieldNameMap: { [key: string]: string } = {
        claim_amount: 'Monto',
        current_status: 'Estado',
        case_number: 'Número de Caso',
        start_date: 'Fecha de Inicio',
        observation: 'Observación',
      };
      return fieldNameMap[fieldName] || fieldName;
    };

    const formatFieldValue = (key: string, value: unknown) => {
      if (
        key === 'current_status' &&
        typeof value === 'object' &&
        value !== null
      ) {
        return (value as { label?: string }).label || 'Desconocido';
      }
      if (
        key === 'start_date' &&
        (typeof value === 'string' || value instanceof Date)
      ) {
        return formatDate(value);
      }
      if (key === 'claim_amount') {
        return new Intl.NumberFormat('es-PY', {
          style: 'currency',
          currency: 'PYG',
        }).format(Number(value));
      }
      return String(value);
    };

    const formatDate = (date: string | Date | null | undefined): string => {
      if (!date) return 'Fecha no disponible';

      let parsedDate: Date;

      if (typeof date === 'string') {
        // Intenta parsear la fecha si es una cadena
        parsedDate = new Date(date);
      } else if (date instanceof Date) {
        parsedDate = date;
      } else {
        console.error('Formato de fecha no válido:', date);
        return 'Fecha inválida';
      }

      // Verifica si la fecha es válida
      if (isNaN(parsedDate.getTime())) {
        console.error('Fecha inválida:', date);
        return 'Fecha inválida';
      }

      try {
        return parsedDate.toLocaleDateString('es-PY', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch (error) {
        console.error('Error al formatear la fecha:', error);
        return 'Error en formato de fecha';
      }
    };
    const getRelevantFields = (entry: CaseHistory) => {
      if (entry.action_type === 'CREATE') {
        return {
          claim_amount: entry.changed_fields?.claim_amount,
          current_status: entry.changed_fields?.current_status,
          case_number: entry.changed_fields?.case_number,
          start_date: entry.changed_fields?.start_date,
        };
      } else {
        return entry.changed_fields;
      }
    };

    return {
      cases,
      selectedCase,
      caseHistory,
      loadHistory,
      loading,
      error,
      getEntryTitle,
      getEntryIcon,
      getEntryColor,
      formatFieldName,
      formatFieldValue,
      formatDate,
      getRelevantFields,
    };
  },
});
</script>

<style scoped>
.q-timeline__entry {
  margin-bottom: 2rem;
}
</style>
