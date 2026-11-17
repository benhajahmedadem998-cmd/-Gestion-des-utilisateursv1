<script setup lang="ts">
import type {PropType} from 'vue';
import {RouterLink} from 'vue-router';
import type {Utilisateur} from '../types/utilisateur';
import LigneUtilisateur from './LigneUtilisateur.vue';

defineProps({
  utilisateurs: {
    type: Array as PropType<Utilisateur[]>,
    required: true,
  },
  chargement: {
    type: Boolean,
    default: false,
  },
  idEnCours: {
    type: String,
    default: '',
  },
  filtreActif: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits({
  'basculer-etat': (id: string) => typeof id === 'string' && id.length > 0,
  modifier: (id: string) => typeof id === 'string' && id.length > 0,
  supprimer: (id: string) => typeof id === 'string' && id.length > 0,
  'reinitialiser-filtres': null,
});
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-slate-200">
    <table class="min-w-full border-collapse text-left">
      <thead>
        <tr class="border-b border-slate-200 bg-slate-50/90">
          <th scope="col" class="px-4 py-3 text-xs font-bold text-slate-600">
            Identifiant
          </th>
          <th scope="col" class="px-4 py-3 text-xs font-bold text-slate-600">
            Nom
          </th>
          <th scope="col" class="px-4 py-3 text-xs font-bold text-slate-600">
            Prénom
          </th>
          <th scope="col" class="px-4 py-3 text-xs font-bold text-slate-600">
            État
          </th>
          <th scope="col" class="px-4 py-3 text-right text-xs font-bold text-slate-600">
            Actions
          </th>
        </tr>
      </thead>

      <tbody v-if="chargement" class="divide-y divide-slate-100 bg-white">
        <tr v-for="index in 3" :key="index">
          <td class="px-4 py-4">
            <div class="h-4 w-20 animate-pulse rounded bg-slate-200" />
          </td>
          <td class="px-4 py-4">
            <div class="h-4 w-24 animate-pulse rounded bg-slate-200" />
          </td>
          <td class="px-4 py-4">
            <div class="h-4 w-24 animate-pulse rounded bg-slate-200" />
          </td>
          <td class="px-4 py-4">
            <div class="h-6 w-14 animate-pulse rounded-md bg-slate-200" />
          </td>
          <td class="px-4 py-4 text-right">
            <div class="ml-auto h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
          </td>
        </tr>
      </tbody>

      <tbody v-else-if="utilisateurs.length > 0" class="bg-white">
        <LigneUtilisateur
          v-for="u in utilisateurs"
          :key="u.id"
          :utilisateur="u"
          :en-cours="idEnCours === u.id"
          @basculer-etat="emit('basculer-etat', $event)"
          @modifier="emit('modifier', $event)"
          @supprimer="emit('supprimer', $event)"
        />
      </tbody>

      <tbody v-else class="bg-white">
        <tr>
          <td colspan="5" class="px-6 py-12 text-center">
            <p class="text-sm font-bold text-slate-900">
              {{
                filtreActif
                  ? 'Aucun utilisateur ne correspond à votre recherche ou au filtre sélectionné.'
                  : 'Aucun utilisateur enregistré pour le moment.'
              }}
            </p>
            <p class="mt-1 text-sm font-bold text-slate-500">
              {{
                filtreActif
                  ? 'Modifiez le texte de recherche ou réinitialisez les filtres.'
                  : 'Commencez par ajouter un premier compte utilisateur.'
              }}
            </p>
            <div class="mt-4 flex justify-center">
              <button
                v-if="filtreActif"
                type="button"
                class="inline-flex min-h-[40px] items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                @click="emit('reinitialiser-filtres')"
              >
                Réinitialiser les filtres
              </button>
              <RouterLink
                v-else
                to="/ajouter"
                class="inline-flex min-h-[40px] items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                Ajouter un utilisateur
              </RouterLink>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
