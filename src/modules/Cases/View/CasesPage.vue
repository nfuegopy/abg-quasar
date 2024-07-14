<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h1 class="text-h4">Casos</h1>
      </div>
      <div class="col-12">
        <q-btn color="primary" label="Nuevo Caso" @click="openCreateDialog" />
      </div>
      <div class="col-12">
        <q-table
          :rows="cases"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :filter="filter"
        >
          <template v-slot:top-right>
            <q-input dense debounce="300" v-model="filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn-group spread>
                <q-btn
                  color="primary"
                  icon="edit"
                  size="sm"
                  @click="editCase(props.row)"
                />
                <q-btn
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="deleteCase(props.row.id)"
                />
              </q-btn-group>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
    <q-dialog class="row" v-model="dialogVisible" persistent>
      <q-card style="min-width: 680px; padding-right: -30px">
        <q-card-section>
          <div class="text-h6">
            {{ editingCase.id ? 'Editar' : 'Nuevo' }} Caso
          </div>
        </q-card-section>
        <q-card-section class="col q-gutter-sm">
          <div class="row q-gutter-sm">
            <q-input
              v-model="editingCase.case_number"
              label="Nombre o N ° de Caso"
              outlined
              dense
              class="col-3"
            />
            <q-select
              v-model="editingCase.court_id"
              :options="courtOptions"
              label="Juzgado"
              option-value="value"
              option-label="label"
              map-options
              emit-value
              outlined
              dense
              class="col-3"
            />
            <q-select
              v-model="editingCase.secretary_id"
              :options="secretaryOptions"
              label="Secretaría"
              option-value="value"
              option-label="label"
              map-options
              emit-value
              outlined
              dense
              class="col-3"
            />

            <q-input
              v-model="editingCaseStartDate"
              label="Fecha de Inicio"
              type="date"
              outlined
              dense
              class="col-3"
            />
            <q-input
              v-model.number="editingCase.claim_amount"
              label="Monto de la Demanda"
              type="number"
              outlined
              class="col-3"
              dense
            />
            <q-select
              v-model="editingCase.current_status"
              label="Estado Actual"
              outlined
              dense
              class="col-3"
              :options="estadoOptions"
            />
          </div>
          <div class="row q-gutter-sm">
            <q-input
              v-model="editingCase.impulse_description"
              label="Descripción del Impulso"
              type="textarea"
              outlined
              class="col-4"
              dense
            />

            <q-input
              v-model="editingCase.observation"
              label="Observación"
              type="textarea"
              outlined
              class="col-5"
              dense
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="saveOrUpdateCase"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { QTableColumn } from 'quasar';
import { CasesController } from '../Controller/CasesController';
import { Case, CaseWithDetails } from 'src/modules/Cases/Model/Case';
import { Court } from '../../Courts/model/Court';
import { Secretary } from '../../Secretaries/Model/Secretary';

export default defineComponent({
  name: 'CasesPage',
  setup() {
    const casesController = new CasesController();
    const cases = ref<CaseWithDetails[]>([]);
    const courts = ref<Court[]>([]);
    const secretaries = ref<Secretary[]>([]);
    const loading = ref(true);
    const filter = ref('');
    const dialogVisible = ref(false);
    const editingCase = ref<Partial<Case>>({});

    //constt para buscar los nombres de secretaria y juzgado
    const estadoOptions = ref([
      { label: 'Iniciado', value: 'Iniciado' },
      { label: 'Proceso', value: 'Proceso' },
      { label: 'Ejecutado', value: 'Ejecutado' },
      { label: 'Finalizado', value: 'Finalizado' },
    ]);
    const getCourtName = (courtId: string) => {
      const court = courts.value.find((c) => c.id === courtId);
      return court ? court.name : 'Desconocido';
    };

    const getSecretaryName = (secretaryId: string) => {
      const secretary = secretaries.value.find((s) => s.id === secretaryId);
      return secretary ? secretary.name : 'Desconocido';
    };

    const columns: QTableColumn[] = [
      {
        name: 'case_number',
        required: true,
        label: 'Número de Caso',
        align: 'left',
        field: 'case_number',
        sortable: true,
      },
      {
        name: 'court_name',
        align: 'left',
        label: 'Juzgado',
        field: (row) => getCourtName(row.court_id),
        sortable: true,
      },
      {
        name: 'secretary_name',
        align: 'left',
        label: 'Secretaría',
        field: (row) => getSecretaryName(row.secretary_id),
        sortable: true,
      },
      {
        name: 'start_date',
        align: 'left',
        label: 'Fecha de Inicio',
        field: (row) => formatDateForDisplay(row.start_date),
        sortable: true,
      },
      {
        name: 'claim_amount',
        align: 'left',
        label: 'Monto de la Demanda',
        field: 'claim_amount',
        sortable: true,
      },
      {
        name: 'current_status',
        align: 'left',
        label: 'Estado Actual',
        field: 'current_status',
        sortable: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'actions',
        sortable: false,
      },
    ];

    const courtOptions = computed(() => {
      return courts.value.map((court) => ({
        label: court.name,
        value: court.id,
      }));
    });

    const secretaryOptions = computed(() => {
      return secretaries.value.map((secretary) => ({
        label: secretary.name,
        value: secretary.id,
      }));
    });

    const editingCaseStartDate = computed({
      get: () => {
        return editingCase.value.start_date
          ? formatDateForInput(editingCase.value.start_date)
          : '';
      },
      set: (value: string) => {
        editingCase.value.start_date = value ? new Date(value) : undefined;
      },
    });

    const formatDateForDisplay = (date: Date | string | undefined): string => {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString();
    };

    const formatDateForInput = (date: Date | string | undefined): string => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    onMounted(async () => {
      try {
        [cases.value, courts.value, secretaries.value] = await Promise.all([
          casesController.getCases(),
          casesController.getCourts(),
          casesController.getSecretaries(),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        loading.value = false;
      }
    });

    //funcion para

    const openCreateDialog = () => {
      editingCase.value = {};
      dialogVisible.value = true;
    };

    const editCase = (caseItem: CaseWithDetails) => {
      editingCase.value = { ...caseItem };
      dialogVisible.value = true;
    };

    const saveOrUpdateCase = async () => {
      try {
        if (editingCase.value.id) {
          await casesController.updateCase(
            editingCase.value.id,
            editingCase.value as Case
          );
        } else {
          await casesController.createCase(
            editingCase.value as Omit<Case, 'id' | 'created_at' | 'updated_at'>
          );
        }
        dialogVisible.value = false;
        cases.value = await casesController.getCases();
      } catch (error) {
        console.error('Error saving or updating case:', error);
      }
    };

    const deleteCase = async (id: string) => {
      try {
        await casesController.deleteCase(id);
        cases.value = cases.value.filter((caseItem) => caseItem.id !== id);
      } catch (error) {
        console.error('Error deleting case:', error);
      }
    };

    return {
      cases,
      loading,
      filter,
      columns,
      dialogVisible,
      editingCase,
      editingCaseStartDate,
      courtOptions,
      secretaryOptions,
      openCreateDialog,
      editCase,
      deleteCase,
      saveOrUpdateCase,
      getCourtName,
      getSecretaryName,
      estadoOptions,
    };
  },
});
</script>
