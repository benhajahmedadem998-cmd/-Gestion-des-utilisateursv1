import {createRouter, createWebHistory} from 'vue-router';
import VueAjouterUtilisateur from '../views/VueAjouterUtilisateur.vue';
import VueListeUtilisateurs from '../views/VueListeUtilisateurs.vue';
import VueModifierUtilisateur from '../views/VueModifierUtilisateur.vue';
import VueSupprimerUtilisateur from '../views/VueSupprimerUtilisateur.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'liste-utilisateurs',
      component: VueListeUtilisateurs,
    },
    {
      path: '/ajouter',
      name: 'ajouter-utilisateur',
      component: VueAjouterUtilisateur,
    },
    {
      path: '/modifier/:id',
      name: 'modifier-utilisateur',
      component: VueModifierUtilisateur,
    },
    {
      path: '/supprimer/:id',
      name: 'supprimer-utilisateur',
      component: VueSupprimerUtilisateur,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

export default router;
