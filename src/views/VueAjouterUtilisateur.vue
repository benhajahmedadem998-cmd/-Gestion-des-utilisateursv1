<script setup lang="ts">
import {ArrowLeft} from 'lucide-vue-next';
import {ref} from 'vue';
import {RouterLink, useRouter} from 'vue-router';
import CarteBase from '../components/CarteBase.vue';
import FormulaireUtilisateur from '../components/FormulaireUtilisateur.vue';
import type {DonneesFormulaireUtilisateur} from '../types/utilisateur';

const router = useRouter();
const soumissionEnCours = ref(false);
const erreurServeur = ref('');

async function ajouterUtilisateur(donnees: DonneesFormulaireUtilisateur): Promise<void> {
  soumissionEnCours.value = true;
  erreurServeur.value = '';
  try {
    const reponse = await fetch('/api/utilisateurs', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        nom: donnees.nom,
        prenom: donnees.prenom,
        actif: true,
      }),
    });

    if (!reponse.ok) {
      const corps = (await reponse.json().catch(() => ({}))) as {message?: string};
      throw new Error(corps.message || "Erreur lors de l'ajout de l'utilisateur.");
    }

    await router.push('/');
  } catch (err) {
    erreurServeur.value =
      err instanceof Error ? err.message : "Erreur lors de l'enregistrement.";
  } finally {
    soumissionEnCours.value = false;
  }
}

function retourListe(): void {
  router.push('/');
}
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
          Ajouter un utilisateur
        </h1>
        <p class="mt-1 text-sm font-bold text-slate-500">
          Renseignez le nom et le prénom.
        </p>
      </template>

      <FormulaireUtilisateur
        mode="ajout"
        :soumission-en-cours="soumissionEnCours"
        :erreur-serveur="erreurServeur"
        @soumettre="ajouterUtilisateur"
        @annuler="retourListe"
      />
    </CarteBase>
  </div>
</template>
