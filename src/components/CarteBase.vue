<script setup lang="ts">
import {useSlots} from 'vue';

const slots = useSlots();
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white shadow-xs">
    <div
      v-if="slots.entete"
      class="border-b border-slate-200 px-6 py-5 sm:px-8"
    >
      <slot name="entete" />
    </div>

    <div class="px-6 py-6 sm:px-8">
      <slot />
    </div>

    <div
      v-if="slots.pied"
      class="border-t border-slate-100 bg-slate-50/70 px-6 py-4 rounded-b-xl sm:px-8"
    >
      <slot name="pied" />
    </div>
  </section>
</template>
