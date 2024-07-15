<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h1 class="text-h4">Pagos</h1>
      </div>
      <div class="col-12">
        <q-btn color="primary" label="Nuevo Pago" @click="openCreateDialog" />
      </div>
      <div class="col-12">
        <q-table
          :rows="payments"
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
          <template v-slot:body-cell-case_id="props">
            <q-td :props="props">
              {{ getCaseNumber(props.row.case_id) }}
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn-group spread>
                <q-btn
                  color="primary"
                  icon="edit"
                  size="sm"
                  @click="editPayment(props.row)"
                />
                <q-btn
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="deletePayment(props.row.id)"
                />
              </q-btn-group>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            {{ editingPayment.id ? 'Editar' : 'Nuevo' }} Pago
          </div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="editingPayment.case_id"
            :options="caseOptions"
            label="Caso"
            option-value="value"
            option-label="label"
            map-options
            emit-value
          />
          <q-input
            v-model.number="editingPayment.amount"
            label="Monto"
            type="number"
          />
          <q-input v-model="paymentDate" label="Fecha de Pago" type="date" />
          <q-select
            v-model="editingPayment.payment_type"
            :options="['Cheque', 'Efectivo', 'Transferencia']"
            label="Tipo de Pago"
          />
          <q-select
            v-model="editingPayment.payment_status"
            :options="['Pendiente', 'Completado', 'Cancelado']"
            label="Estado del Pago"
          />
          <q-input
            v-model="editingPayment.description"
            label="Descripción"
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="saveOrUpdatePayment"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useQuasar, QTableColumn } from 'quasar';
import { PaymentsController } from '../controller/PaymentsController';
import { Payment } from '../model/Payment';
import { CasesController } from '../../Cases/Controller/CasesController';
import { Case } from '../../Cases/Model/Case';

export default defineComponent({
  name: 'PaymentsPage',
  setup() {
    const $q = useQuasar();
    const paymentsController = new PaymentsController();
    const casesController = new CasesController();

    const payments = ref<Payment[]>([]);
    const cases = ref<Case[]>([]);
    const loading = ref(true);
    const filter = ref('');
    const dialogVisible = ref(false);
    const editingPayment = ref<Partial<Payment>>({});
    const paymentDate = ref('');

    const caseOptions = computed(() =>
      cases.value.map((c) => ({ label: c.case_number, value: c.id }))
    );

    const columns: QTableColumn[] = [
      {
        name: 'case_id',
        align: 'left',
        label: 'Número de Caso',
        field: 'case_id',
        sortable: true,
        format: (val: string) => getCaseNumber(val),
      },
      {
        name: 'amount',
        align: 'left',
        label: 'Monto',
        field: 'amount',
        sortable: true,
      },
      {
        name: 'payment_date',
        align: 'left',
        label: 'Fecha de Pago',
        field: 'payment_date',
        sortable: true,
      },
      {
        name: 'payment_type',
        align: 'left',
        label: 'Tipo de Pago',
        field: 'payment_type',
        sortable: true,
      },
      {
        name: 'payment_status',
        align: 'left',
        label: 'Estado',
        field: 'payment_status',
        sortable: true,
      },
      {
        name: 'actions',
        align: 'right',
        label: 'Acciones',
        field: 'actions',
        sortable: false,
      },
    ];

    const getCaseNumber = (caseId: string) => {
      const foundCase = cases.value.find((c) => c.id === caseId);
      return foundCase ? foundCase.case_number : 'N/A';
    };

    onMounted(async () => {
      try {
        loading.value = true;
        [payments.value, cases.value] = await Promise.all([
          paymentsController.getPayments(),
          casesController.getCases(),
        ]);
        payments.value.sort(
          (a, b) =>
            new Date(b.payment_date).getTime() -
            new Date(a.payment_date).getTime()
        );
      } catch (error) {
        console.error('Error fetching data:', error);
        $q.notify({
          color: 'negative',
          message: 'Error al cargar los datos',
          icon: 'report_problem',
        });
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      editingPayment.value = {};
      paymentDate.value = '';
      dialogVisible.value = true;
    };

    const editPayment = (payment: Payment) => {
      editingPayment.value = { ...payment };
      paymentDate.value = payment.payment_date
        ? new Date(payment.payment_date).toISOString().split('T')[0]
        : '';
      dialogVisible.value = true;
    };

    const saveOrUpdatePayment = async () => {
      try {
        const paymentData = {
          ...editingPayment.value,
          case_id: editingPayment.value.case_id,
          payment_date: paymentDate.value,
        };
        console.log('Saving payment:', paymentData);

        if (paymentData.id) {
          await paymentsController.updatePayment(paymentData.id, paymentData);
        } else {
          await paymentsController.createPayment(
            paymentData as Omit<Payment, 'id'>
          );
        }

        dialogVisible.value = false;
        await refreshPayments();

        $q.notify({
          color: 'positive',
          message: `Pago ${
            paymentData.id ? 'actualizado' : 'creado'
          } correctamente`,
          icon: 'check',
        });
      } catch (error) {
        console.error('Error saving payment:', error);
        $q.notify({
          color: 'negative',
          message: `Error al guardar el pago: ${(error as Error).message}`,
          icon: 'report_problem',
        });
      }
    };

    const deletePayment = async (id: string) => {
      try {
        await paymentsController.deletePayment(id);
        await refreshPayments();

        $q.notify({
          color: 'positive',
          message: 'Pago eliminado correctamente',
          icon: 'check',
        });
      } catch (error) {
        console.error('Error deleting payment:', error);
        $q.notify({
          color: 'negative',
          message: `Error al eliminar el pago: ${(error as Error).message}`,
          icon: 'report_problem',
        });
      }
    };

    const refreshPayments = async () => {
      payments.value = await paymentsController.getPayments();
      payments.value.sort(
        (a, b) =>
          new Date(b.payment_date).getTime() -
          new Date(a.payment_date).getTime()
      );
    };

    return {
      payments,
      loading,
      filter,
      columns,
      dialogVisible,
      editingPayment,
      paymentDate,
      caseOptions,
      getCaseNumber,
      openCreateDialog,
      editPayment,
      saveOrUpdatePayment,
      deletePayment,
    };
  },
});
</script>
