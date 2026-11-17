<script setup lang="ts">
import {ref, watch} from 'vue';
import type {PropType} from 'vue';
import type {DonneesFormulaireUtilisateur} from '../types/utilisateur';

const props = defineProps({
  mode: {
    type: String as PropType<'ajout' | 'edition'>,
    required: true,
    validator: (v: string) => ['ajout', 'edition'].includes(v),
  },
  valeursInitiales: {
    type: Object as PropType<DonneesFormulaireUtilisateur>,
    default: () => ({nom: '', prenom: '', actif: true}),
  },
  soumissionEnCours: {
    type: Boolean,
    default: false,
  },
  erreurServeur: {
    type: String,
    default: '',
  },
});

const emit = defineEmits({
  soumettre: (payload: DonneesFormulaireUtilisateur) =>
    typeof payload?.nom === 'string' &&
    payload.nom.trim().length > 0 &&
    typeof payload?.prenom === 'string' &&
    payload.prenom.trim().length > 0 &&
    typeof payload?.actif === 'boolean',
  annuler: null,
});

const nom = ref(props.valeursInitiales.nom);
const prenom = ref(props.valeursInitiales.prenom);
const actif = ref(props.valeursInitiales.actif);
const erreurValidation = ref('');

watch(
  () => props.valeursInitiales,
  (nouvelles) => {
    nom.value = nouvelles.nom;
    prenom.value = nouvelles.prenom;
    actif.value = nouvelles.actif;
  },
  {deep: true},
);

function valider(): void {
  const nomNettoye = nom.value.trim();
  const prenomNettoye = prenom.value.trim();

  if (!nomNettoye || !prenomNettoye) {
    erreurValidation.value = 'Veuillez renseigner le nom et le prénom.';
    return;
  }

  erreurValidation.value = '';
  emit('soumettre', {
    nom: nomNettoye,
    prenom: prenomNettoye,
    actif: actif.value,
  });
}
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="valider">
    <div
      v-if="erreurValidation || erreurServeur"
      role="alert"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
    >
      {{ erreurValidation || erreurServeur }}
    </div>

    <div class="space-y-1.5">
      <label for="champ-nom" class="block text-sm font-bold text-slate-700">
        Nom
      </label>
      <input
        id="champ-nom"
        v-model="nom"
        type="text"
        required
        autocomplete="family-name"
        placeholder="Ex : Jebali"
        :disabled="soumissionEnCours"
        class="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-bold text-slate-900 placeholder:font-bold placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-slate-50"
      />
    </div>

    <div class="space-y-1.5">
      <label for="champ-prenom" class="block text-sm font-bold text-slate-700">
        Prénom
      </label>
      <input
        id="champ-prenom"
        v-model="prenom"
        type="text"
        required
        autocomplete="given-name"
        placeholder="Ex : Amira"
        :disabled="soumissionEnCours"
        class="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-bold text-slate-900 placeholder:font-bold placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:bg-slate-50"
      />
    </div>

    <div v-if="mode === 'edition'" class="flex items-center gap-3 pt-1">
      <input
        id="champ-actif"
        v-model="actif"
        type="checkbox"
        :disabled="soumissionEnCours"
        class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
      />
      <label for="champ-actif" class="text-sm font-bold text-slate-700">
        Utilisateur actif
      </label>
    </div>

    <div class="flex items-center justify-end gap-3 pt-2">
      <button
        type="button"
        :disabled="soumissionEnCours"
        class="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 whitespace-nowrap transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:opacity-50"
        @click="emit('annuler')"
      >
        Annuler
      </button>
      <button
        type="submit"
        :disabled="soumissionEnCours"
        class="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white whitespace-nowrap transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {{ soumissionEnCours ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </div>
  </form>
</template>
