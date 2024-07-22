<!-- src/components/PageTitle.vue -->
<template>
  <div class="text-center q-mb-lg">
    <h2 class="text-h3 text-weight-bold q-my-none">
      <span class="text-primary">{{ firstWord }}</span> {{ restOfTitle }}
    </h2>
    <q-separator
      class="q-mt-sm"
      style="max-width: 150px; margin: auto"
      color="primary"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'PageTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const firstWord = computed(() => props.title.split(' ')[0]);
    const restOfTitle = computed(() =>
      props.title.split(' ').slice(1).join(' ')
    );

    return { firstWord, restOfTitle };
  },
});
</script>
