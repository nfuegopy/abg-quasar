<template>
  <q-page padding>
    <h1 class="text-h4 q-mb-md">Asignar Caso</h1>
    <q-stepper v-model="step" horizontal color="primary" animated>
      <q-step :name="1" title="Seleccionar Caso" icon="search" :done="step > 1">
        <q-select
          v-model="selectedCase"
          :options="cases"
          option-label="case_number"
          label="Seleccione un caso"
          emit-value
          map-options
          use-input
          input-debounce="0"
          @filter="filterCases"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No se encontraron casos
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn
          color="primary"
          label="Crear Nuevo Caso"
          @click="goToCreateCase"
          class="q-mt-sm"
        />
        <q-stepper-navigation>
          <q-btn
            @click="step = 2"
            color="primary"
            label="Continuar"
            :disable="!selectedCase"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Seleccionar Tipo de Asignación"
        icon="people"
        :done="step > 2"
      >
        <q-btn-toggle
          v-model="assignmentType"
          spread
          no-caps
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="[
            { label: 'Cliente', value: 'client' },
            { label: 'Demandado', value: 'defendant' },
          ]"
        />
        <q-stepper-navigation>
          <q-btn
            @click="step = 3"
            color="primary"
            label="Continuar"
            :disable="!assignmentType"
          />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            label="Atrás"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        :title="
          assignmentType === 'client'
            ? 'Seleccionar Cliente'
            : 'Seleccionar Demandado'
        "
        icon="person"
        :done="step > 3"
      >
        <q-select
          v-if="assignmentType === 'client'"
          v-model="selectedClient"
          :options="clients"
          :option-label="(item) => `${item.first_name} ${item.last_name}`"
          label="Seleccione un cliente"
          emit-value
          map-options
          use-input
          input-debounce="0"
          @filter="filterClients"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No se encontraron clientes
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <template v-else>
          <q-select
            v-model="selectedDefendant"
            :options="defendants"
            :option-label="(item) => `${item.first_name} ${item.last_name}`"
            label="Seleccione un demandado"
            emit-value
            map-options
            use-input
            input-debounce="0"
            @filter="filterDefendants"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No se encontraron demandados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-checkbox v-model="isCodeudor" label="¿Es codeudor (garante)?" />
        </template>
        <q-btn
          v-if="assignmentType === 'client'"
          color="secondary"
          label="Crear Nuevo Cliente"
          @click="goToCreateClient"
          class="q-mt-sm"
        />
        <q-btn
          v-else
          color="secondary"
          label="Crear Nuevo Demandado"
          @click="goToCreateDefendant"
          class="q-mt-sm"
        />
        <q-stepper-navigation>
          <q-btn
            @click="step = 4"
            color="primary"
            label="Continuar"
            :disable="!selectedPerson"
          />
          <q-btn
            flat
            @click="step = 2"
            color="primary"
            label="Atrás"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="4"
        title="Confirmar Asignación"
        icon="assignment_turned_in"
      >
        <p>Caso: {{ selectedCase?.case_number }}</p>
        <p>
          {{ assignmentType === 'client' ? 'Cliente' : 'Demandado' }}:
          {{ selectedPerson?.first_name }} {{ selectedPerson?.last_name }}
        </p>
        <p v-if="assignmentType === 'defendant' && isCodeudor">
          Tipo: Codeudor (Garante)
        </p>
        <q-stepper-navigation>
          <q-btn color="primary" label="Asignar Caso" @click="assignCase" />
          <q-btn
            flat
            @click="step = 3"
            color="primary"
            label="Atrás"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { AssignCaseController } from '../Controller/AssignCaseController';
import { Case } from '../../Cases/Model/Case';
import { Client } from '../../Clients/models/Client';
import { Defendant } from '../../Defendants/models/Defendant';

export default defineComponent({
  name: 'AssignCasePage',
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const controller = new AssignCaseController();

    const step = ref(1);
    const cases = ref<Case[]>([]);
    const clients = ref<Client[]>([]);
    const defendants = ref<Defendant[]>([]);
    const selectedCase = ref<Case | null>(null);
    const selectedClient = ref<Client | null>(null);
    const selectedDefendant = ref<Defendant | null>(null);
    const assignmentType = ref<'client' | 'defendant'>('client');
    const isCodeudor = ref(false);

    const selectedPerson = computed(() =>
      assignmentType.value === 'client'
        ? selectedClient.value
        : selectedDefendant.value
    );

    onMounted(async () => {
      try {
        cases.value = await controller.getCases();
        clients.value = await controller.getClients();
        defendants.value = await controller.getDefendants();
      } catch (error) {
        console.error('Error fetching data:', error);
        $q.notify({
          color: 'negative',
          message: 'Error al cargar los datos',
          icon: 'report_problem',
        });
      }
    });

    const filterCases = (
      val: string,
      update: (callback: () => void) => void
    ) => {
      if (val === '') {
        update(() => {
          cases.value = cases.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        cases.value = cases.value.filter(
          (v) => v.case_number.toLowerCase().indexOf(needle) > -1
        );
      });
    };

    const filterClients = (
      val: string,
      update: (callback: () => void) => void
    ) => {
      if (val === '') {
        update(() => {
          clients.value = clients.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        clients.value = clients.value.filter(
          (v) =>
            (
              v.first_name.toLowerCase() +
              ' ' +
              v.last_name.toLowerCase()
            ).indexOf(needle) > -1
        );
      });
    };

    const filterDefendants = (
      val: string,
      update: (callback: () => void) => void
    ) => {
      if (val === '') {
        update(() => {
          defendants.value = defendants.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        defendants.value = defendants.value.filter(
          (v) =>
            (
              v.first_name.toLowerCase() +
              ' ' +
              v.last_name.toLowerCase()
            ).indexOf(needle) > -1
        );
      });
    };

    const goToCreateCase = () => {
      router.push('/cases');
    };

    const goToCreateClient = () => {
      router.push('/clients');
    };

    const goToCreateDefendant = () => {
      router.push('/defendants');
    };

    // En el componente Vue

    const assignCase = async () => {
      if (selectedCase.value && selectedPerson.value) {
        try {
          let result;

          if (assignmentType.value === 'client') {
            result = await controller.assignCaseToClient(
              selectedCase.value.id,
              selectedPerson.value.id
            );
          } else {
            result = await controller.assignCaseToDefendant(
              selectedCase.value.id,
              selectedPerson.value.id,
              isCodeudor.value
            );
          }

          if (result && result.id) {
            $q.notify({
              color: 'positive',
              message: 'Caso asignado correctamente',
              icon: 'check',
            });
            // Actualizar la lista de casos
            cases.value = await controller.getCases();
            // Resetear el stepper
            step.value = 1;
            selectedCase.value = null;
            selectedClient.value = null;
            selectedDefendant.value = null;
            assignmentType.value = 'client';
            isCodeudor.value = false;
          } else {
            throw new Error('No se recibió una respuesta válida del servidor');
          }
        } catch (error) {
          console.error('Error assigning case:', error);
          $q.notify({
            color: 'negative',
            message: 'Error al asignar el caso: ' + (error as Error).message,
            icon: 'report_problem',
          });
        }
      }
    };

    return {
      step,
      cases,
      clients,
      defendants,
      selectedCase,
      selectedClient,
      selectedDefendant,
      assignmentType,
      isCodeudor,
      selectedPerson,
      goToCreateCase,
      goToCreateClient,
      goToCreateDefendant,
      assignCase,
      filterCases,
      filterClients,
      filterDefendants,
    };
  },
});
</script>
