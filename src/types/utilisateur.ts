export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  actif: boolean;
}

export interface DonneesFormulaireUtilisateur {
  nom: string;
  prenom: string;
  actif: boolean;
}

export type FiltreStatut = 'tous' | 'actifs' | 'inactifs';
