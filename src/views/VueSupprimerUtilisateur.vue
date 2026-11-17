<script setup lang="ts">
import {ArrowLeft} from 'lucide-vue-next';
import {onMounted, ref} from 'vue';
import {RouterLink, useRoute, useRouter} from 'vue-router';
import CarteBase from '../components/CarteBase.vue';
import type {Utilisateur} from '../types/utilisateur';

const route = useRoute();
const router = useRouter();

const utilisateur = ref<Utilisateur | null>(null);
const chargement = ref(true);
const erreur = ref('');
const suppressionEnCours = ref(false);

async function chargerUtilisateur(): Promise<void> {
  const id = String(route.params.id ?? '');
  chargement.value = true;
  erreur.value = '';
  try {
    const reponse = await fetch(`/api/utilisateurs/${encodeURIComponent(id)}`);
    if (!reponse.ok) {
      throw new Error('Utilisateur introuvable.');
    }
    utilisateur.value = (await reponse.json()) as Utilisateur;
  } catch (err) {
    erreur.value =
      err instanceof Error ? err.message : "Impossible de charger l'utilisateur.";
  } finally {
    chargement.value = false;
  }
}

async function confirmerSuppression(): Promise<void> {
  if (!utilisateur.value) return;
  suppressionEnCours.value = true;
  erreur.value = '';
  try {
    const reponse = await fetch(
      `/api/utilisateurs/${encodeURIComponent(utilisateur.value.id)}`,
      {method: 'DELETE'},
    );
    if (!reponse.ok) {
      throw new Error('Impossible de supprimer cet utilisateur.');
    }
    await router.push('/');
  } catch (err) {
    erreur.value =
      err instanceof Error ? err.message : 'Erreur lors de la suppression.';
    suppressionEnCours.value = false;
  }
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
          Supprimer un utilisateur
        </h1>
      </template>

      <div v-if="chargement" class="space-y-3">
        <div class="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
        <div class="h-10 w-40 animate-pulse rounded-lg bg-slate-100" />
      </div>

      <div
        v-else-if="erreur && !utilisateur"
        role="alert"
        class="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700"
      >
        <p>{{ erreur }}</p>
        <RouterLink
          to="/"
          class="inline-flex min-h-[38px] items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Retour à la liste
        </RouterLink>
      </div>

      <div v-else-if="utilisateur" class="space-y-6">
        <div
          v-if="erreur"
          role="alert"
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
        >
          {{ erreur }}
        </div>

        <div class="space-y-2">
          <p class="text-base font-bold text-slate-800">
            Voulez-vous supprimer
            <strong class="font-bold text-slate-950">
              {{ utilisateur.prenom }} {{ utilisateur.nom }}
            </strong>
            ?
          </p>
          <p class="text-xs font-bold text-slate-500 font-mono">
            Identifiant : {{ utilisateur.id }} · État :
            {{ utilisateur.actif ? 'Actif' : 'Inactif' }}
          </p>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <RouterLink
            to="/"
            class="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 whitespace-nowrap transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            Annuler
          </RouterLink>
          <button
            type="button"
            :disabled="suppressionEnCours"
            class="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white whitespace-nowrap transition-colors duration-150 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:opacity-60"
            @click="confirmerSuppression"
          >
            {{ suppressionEnCours ? 'Suppression...' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </CarteBase>
  </div>
</template>
