<script setup lang="ts">
import {Search, X} from 'lucide-vue-next';
import type {FiltreStatut} from '../types/utilisateur';

const recherche = defineModel<string>('recherche', {default: ''});
const filtre = defineModel<FiltreStatut>('filtre', {default: 'tous'});

defineProps({
  desactive: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div class="relative flex-1">
      <label for="champ-recherche-utilisateurs" class="sr-only">
        Rechercher un utilisateur par nom ou prénom
      </label>
      <Search
        class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        id="champ-recherche-utilisateurs"
        v-model="recherche"
        type="search"
        :disabled="desactive"
        placeholder="Rechercher par nom, prénom ou identifiant..."
        class="min-h-[42px] w-full rounded-lg border border-slate-200 bg-white pl-10 pr-9 text-sm font-bold text-slate-900 placeholder:font-bold placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-50"
      />
      <button
        v-if="recherche"
        type="button"
        aria-label="Effacer la recherche"
        class="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        @click="recherche = ''"
      >
        <X class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>

    <div class="flex shrink-0 items-center gap-2">
      <label
        for="filtre-statut-utilisateurs"
        class="text-sm font-bold text-slate-600 whitespace-nowrap"
      >
        État :
      </label>
      <select
        id="filtre-statut-utilisateurs"
        v-model="filtre"
        :disabled="desactive"
        class="min-h-[42px] min-w-[160px] rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-50"
      >
        <option value="tous">Tous</option>
        <option value="actifs">Actifs</option>
        <option value="inactifs">Inactifs</option>
      </select>
    </div>
  </div>
</template>
