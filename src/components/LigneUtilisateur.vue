<script setup lang="ts">
import type {PropType} from 'vue';
import type {Utilisateur} from '../types/utilisateur';

defineProps({
  utilisateur: {
    type: Object as PropType<Utilisateur>,
    required: true,
    validator: (v: unknown): boolean => {
      if (!v || typeof v !== 'object') return false;
      const u = v as Partial<Utilisateur>;
      return (
        typeof u.id === 'string' &&
        typeof u.nom === 'string' &&
        typeof u.prenom === 'string' &&
        typeof u.actif === 'boolean'
      );
    },
  },
  enCours: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits({
  'basculer-etat': (id: string) => typeof id === 'string' && id.length > 0,
  modifier: (id: string) => typeof id === 'string' && id.length > 0,
  supprimer: (id: string) => typeof id === 'string' && id.length > 0,
});
</script>

<template>
  <tr class="border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50/80">
    <td class="px-4 py-3.5 font-mono text-xs font-bold text-slate-600 tabular-nums whitespace-nowrap">
      {{ utilisateur.id }}
    </td>
    <td class="px-4 py-3.5 text-sm font-bold text-slate-900 whitespace-nowrap">
      {{ utilisateur.nom }}
    </td>
    <td class="px-4 py-3.5 text-sm font-bold text-slate-700 whitespace-nowrap">
      {{ utilisateur.prenom }}
    </td>
    <td class="px-4 py-3.5 whitespace-nowrap">
      <span
        class="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold"
        :class="
          utilisateur.actif
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-slate-200 bg-slate-100 text-slate-600'
        "
      >
        {{ utilisateur.actif ? 'Actif' : 'Inactif' }}
      </span>
    </td>
    <td class="px-4 py-3.5 text-right whitespace-nowrap">
      <div class="inline-flex items-center justify-end gap-2">
        <button
          type="button"
          :disabled="enCours"
          class="inline-flex min-h-[36px] shrink-0 items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          :class="
            utilisateur.actif
              ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-500'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-600'
          "
          @click="emit('basculer-etat', utilisateur.id)"
        >
          {{ utilisateur.actif ? 'Désactiver' : 'Activer' }}
        </button>

        <button
          type="button"
          class="inline-flex min-h-[36px] shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 whitespace-nowrap transition-colors duration-150 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
          @click="emit('modifier', utilisateur.id)"
        >
          Modifier
        </button>

        <button
          type="button"
          class="inline-flex min-h-[36px] shrink-0 items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-700 whitespace-nowrap transition-colors duration-150 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-1"
          @click="emit('supprimer', utilisateur.id)"
        >
          Supprimer
        </button>
      </div>
    </td>
  </tr>
</template>
