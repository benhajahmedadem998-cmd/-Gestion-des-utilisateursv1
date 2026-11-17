<script setup lang="ts">
import {Plus} from 'lucide-vue-next';
import {computed, onMounted, ref} from 'vue';
import {RouterLink, useRouter} from 'vue-router';
import BarreOutilsUtilisateurs from '../components/BarreOutilsUtilisateurs.vue';
import CarteBase from '../components/CarteBase.vue';
import CompteurUtilisateurs from '../components/CompteurUtilisateurs.vue';
import TableauUtilisateurs from '../components/TableauUtilisateurs.vue';
import type {FiltreStatut, Utilisateur} from '../types/utilisateur';

const router = useRouter();

const utilisateurs = ref<Utilisateur[]>([]);
const chargement = ref(true);
const erreur = ref('');
const idEnCours = ref('');
const recherche = ref('');
const filtreStatut = ref<FiltreStatut>('tous');

const nombreActifs = computed(() => utilisateurs.value.filter((u) => u.actif).length);
const nombreInactifs = computed(() => utilisateurs.value.filter((u) => !u.actif).length);

const utilisateursFiltres = computed(() => {
  const terme = recherche.value.trim().toLowerCase();

  return utilisateurs.value.filter((u) => {
    if (filtreStatut.value === 'actifs' && !u.actif) return false;
    if (filtreStatut.value === 'inactifs' && u.actif) return false;

    if (!terme) return true;
    return (
      u.nom.toLowerCase().includes(terme) ||
      u.prenom.toLowerCase().includes(terme) ||
      u.id.toLowerCase().includes(terme)
    );
  });
});

const filtreEstActif = computed(
  () => recherche.value.trim().length > 0 || filtreStatut.value !== 'tous',
);

async function chargerUtilisateurs(): Promise<void> {
  chargement.value = true;
  erreur.value = '';
  try {
    const reponse = await fetch('/api/utilisateurs');
    if (!reponse.ok) {
      throw new Error(`Erreur serveur (${reponse.status})`);
    }
    const donnees = (await reponse.json()) as Utilisateur[];
    utilisateurs.value = donnees;
  } catch (err) {
    erreur.value =
      err instanceof Error
        ? err.message
        : 'Impossible de charger la liste des utilisateurs.';
  } finally {
    chargement.value = false;
  }
}

async function basculerEtat(id: string): Promise<void> {
  const cible = utilisateurs.value.find((u) => u.id === id);
  if (!cible) return;

  idEnCours.value = id;
  erreur.value = '';
  try {
    const reponse = await fetch(`/api/utilisateurs/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        nom: cible.nom,
        prenom: cible.prenom,
        actif: !cible.actif,
      }),
    });
    if (!reponse.ok) {
      throw new Error('Impossible de modifier le statut de cet utilisateur.');
    }
    const misAJour = (await reponse.json()) as Utilisateur;
    utilisateurs.value = utilisateurs.value.map((u) => (u.id === id ? misAJour : u));
  } catch (err) {
    erreur.value =
      err instanceof Error ? err.message : "Erreur lors de la mise à jour de l'état.";
  } finally {
    idEnCours.value = '';
  }
}

function allerModifier(id: string): void {
  router.push(`/modifier/${encodeURIComponent(id)}`);
}

function allerSupprimer(id: string): void {
  router.push(`/supprimer/${encodeURIComponent(id)}`);
}

function reinitialiserFiltres(): void {
  recherche.value = '';
  filtreStatut.value = 'tous';
}

onMounted(chargerUtilisateurs);
</script>

<template>
  <CarteBase>
    <template #entete>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-slate-900 text-balance">
            Liste des utilisateurs
          </h1>
          <p class="mt-1 text-sm font-bold text-slate-500">
            Gérez les comptes utilisateurs de l'application.
          </p>
        </div>

        <RouterLink
          to="/ajouter"
          class="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <Plus class="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Ajouter un utilisateur</span>
        </RouterLink>
      </div>
    </template>

    <div class="space-y-5">
      <div
        v-if="erreur"
        role="alert"
        class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
      >
        <span>{{ erreur }}</span>
        <button
          type="button"
          class="rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-bold text-red-700 transition-colors hover:bg-red-50"
          @click="chargerUtilisateurs"
        >
          Réessayer
        </button>
      </div>

      <BarreOutilsUtilisateurs
        v-model:recherche="recherche"
        v-model:filtre="filtreStatut"
        :desactive="chargement"
      />

      <TableauUtilisateurs
        :utilisateurs="utilisateursFiltres"
        :chargement="chargement"
        :id-en-cours="idEnCours"
        :filtre-actif="filtreEstActif"
        @basculer-etat="basculerEtat"
        @modifier="allerModifier"
        @supprimer="allerSupprimer"
        @reinitialiser-filtres="reinitialiserFiltres"
      />
    </div>

    <template #pied>
      <CompteurUtilisateurs
        :affiches="utilisateursFiltres.length"
        :total="utilisateurs.length"
        :actifs="nombreActifs"
        :inactifs="nombreInactifs"
      />
    </template>
  </CarteBase>
</template>
