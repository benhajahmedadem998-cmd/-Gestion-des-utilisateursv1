<script setup lang="ts">
import {RouterView} from 'vue-router';
import AppEnTete from './components/AppEnTete.vue';
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <AppEnTete />

    <main class="mx-auto max-w-6xl px-6 py-10">
      <RouterView />
    </main>
  </div>
</template>
