<script setup lang="ts">
import {ArrowLeft} from 'lucide-vue-next';
import {computed, onMounted, ref} from 'vue';
import {RouterLink, useRoute, useRouter} from 'vue-router';
import CarteBase from '../components/CarteBase.vue';
import FormulaireUtilisateur from '../components/FormulaireUtilisateur.vue';
import type {DonneesFormulaireUtilisateur, Utilisateur} from '../types/utilisateur';

const route = useRoute();
const router = useRouter();

const utilisateur = ref<Utilisateur | null>(null);
const chargement = ref(true);
const erreurChargement = ref('');
const soumissionEnCours = ref(false);
const erreurServeur = ref('');

const valeursInitiales = computed<DonneesFormulaireUtilisateur>(() => ({
  nom: utilisateur.value?.nom ?? '',
  prenom: utilisateur.value?.prenom ?? '',
  actif: utilisateur.value?.actif ?? true,
}));

async function chargerUtilisateur(): Promise<void> {
  const id = String(route.params.id ?? '');
  chargement.value = true;
  erreurChargement.value = '';
  try {
    const reponse = await fetch(`/api/utilisateurs/${encodeURIComponent(id)}`);
    if (!reponse.ok) {
      throw new Error('Utilisateur introuvable.');
    }
    utilisateur.value = (await reponse.json()) as Utilisateur;
  } catch (err) {
    erreurChargement.value =
      err instanceof Error ? err.message : "Impossible de charger l'utilisateur.";
  } finally {
    chargement.value = false;
  }
}

async function modifierUtilisateur(donnees: DonneesFormulaireUtilisateur): Promise<void> {
  if (!utilisateur.value) return;
  soumissionEnCours.value = true;
  erreurServeur.value = '';
  try {
    const reponse = await fetch(
      `/api/utilisateurs/${encodeURIComponent(utilisateur.value.id)}`,
      {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(donnees),
      },
    );
    if (!reponse.ok) {
      const corps = (await reponse.json().catch(() => ({}))) as {message?: string};
      throw new Error(corps.message || "Impossible d'enregistrer les modifications.");
    }
    await router.push('/');
  } catch (err) {
    erreurServeur.value =
      err instanceof Error ? err.message : 'Erreur lors de la modification.';
  } finally {
    soumissionEnCours.value = false;
  }
}

function retourListe(): void {
  router.push('/');
}

onMounted(chargerUtilisateur);
</script>

<template>
  <div class="mx-auto max-w-xl">
    <CarteBase>
      <template #entete>
        <RouterLink
          to="/"
          class="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition-colors hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          <ArrowLeft class="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Retour à la liste</span>
        </RouterLink>
        <h1 class="mt-3 text-xl font-bold tracking-tight text-slate-900">
          Modifier un utilisateur
        </h1>
        <p class="mt-1 text-sm font-bold text-slate-500">
          Modifiez le nom et le prénom.
        </p>
      </template>

      <div v-if="chargement" class="space-y-4">
        <div class="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
        <div class="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
      </div>

      <div
        v-else-if="erreurChargement"
        role="alert"
        class="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700"
      >
        <p>{{ erreurChargement }}</p>
        <RouterLink
          to="/"
          class="inline-flex min-h-[38px] items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Retour à la liste
        </RouterLink>
      </div>

      <FormulaireUtilisateur
        v-else
        mode="edition"
        :valeurs-initiales="valeursInitiales"
        :soumission-en-cours="soumissionEnCours"
        :erreur-serveur="erreurServeur"
        @soumettre="modifierUtilisateur"
        @annuler="retourListe"
      />
    </CarteBase>
  </div>
</template>
