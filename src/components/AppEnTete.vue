<script setup lang="ts">
import {Plus} from 'lucide-vue-next';
import {RouterLink} from 'vue-router';
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
      <RouterLink
        to="/"
        class="shrink-0 text-base font-bold tracking-tight text-slate-900 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-md"
      >
        Gestion des utilisateurs
      </RouterLink>

      <nav
        aria-label="Navigation principale"
        class="hidden items-center gap-6 text-sm font-bold text-slate-600 sm:flex"
      >
        <RouterLink
          to="/"
          class="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-950"
          active-class="text-blue-700 font-bold"
        >
          Liste des utilisateurs
        </RouterLink>
        <RouterLink
          to="/ajouter"
          class="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-950"
          active-class="text-blue-700 font-bold"
        >
          Ajouter un utilisateur
        </RouterLink>
      </nav>

      <div class="flex shrink-0 items-center">
        <RouterLink
          to="/ajouter"
          class="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <Plus class="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Ajouter un utilisateur</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>
