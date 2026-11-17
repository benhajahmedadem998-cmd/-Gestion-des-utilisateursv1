<script setup lang="ts">
defineProps({
  affiches: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  actifs: {
    type: Number,
    required: true,
  },
  inactifs: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-500 tabular-nums">
    <p>
      <span class="font-bold text-slate-700">{{ affiches }}</span>
      sur
      <span class="font-bold text-slate-700">{{ total }}</span>
      utilisateur(s) affiché(s)
    </p>
    <div class="flex items-center gap-2">
      <span><strong class="font-bold text-emerald-700">{{ actifs }}</strong> actif(s)</span>
      <span aria-hidden="true">·</span>
      <span><strong class="font-bold text-slate-700">{{ inactifs }}</strong> inactif(s)</span>
    </div>
  </div>
</template>
