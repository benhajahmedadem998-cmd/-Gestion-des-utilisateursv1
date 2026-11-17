import express from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {createServer as createViteServer} from 'vite';

interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  actif: boolean;
}

interface BaseDonnees {
  utilisateurs: Utilisateur[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, 'utilisateurs.json');
const PORT = Number(process.env.PORT) || 3000;

function lireBase(): BaseDonnees {
  if (!fs.existsSync(DB_PATH)) {
    const initial: BaseDonnees = {
      utilisateurs: [
        {id: 'jebalia', nom: 'Jebali', prenom: 'Amira', actif: true},
        {id: 'mejriy', nom: 'Mejri', prenom: 'Youssef', actif: false},
        {id: 'gharbii', nom: 'Gharbi', prenom: 'Inès', actif: true},
      ],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  const brut = fs.readFileSync(DB_PATH, 'utf-8');
  const parsed = JSON.parse(brut) as Partial<BaseDonnees>;
  return {
    utilisateurs: Array.isArray(parsed.utilisateurs) ? parsed.utilisateurs : [],
  };
}

function ecrireBase(data: BaseDonnees): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function normaliserSlug(valeur: string): string {
  return valeur
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function genererIdentifiant(nom: string, prenom: string, existants: Utilisateur[]): string {
  const baseNom = normaliserSlug(nom) || 'user';
  const initialePrenom = normaliserSlug(prenom).charAt(0);
  const racine = `${baseNom}${initialePrenom}`;
  const ids = new Set(existants.map((u) => u.id));
  if (!ids.has(racine)) {
    return racine;
  }
  let compteur = 2;
  while (ids.has(`${racine}${compteur}`)) {
    compteur += 1;
  }
  return `${racine}${compteur}`;
}

async function demarrerServeur(): Promise<void> {
  const app = express();
  app.use(express.json());

  app.get('/api/utilisateurs', (req, res) => {
    try {
      const db = lireBase();
      let resultat = db.utilisateurs;

      const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
      if (q) {
        resultat = resultat.filter(
          (u) =>
            u.nom.toLowerCase().includes(q) ||
            u.prenom.toLowerCase().includes(q) ||
            u.id.toLowerCase().includes(q),
        );
      }

      if (req.query.actif === 'true' || req.query.actif === 'false') {
        const actifAttendu = req.query.actif === 'true';
        resultat = resultat.filter((u) => u.actif === actifAttendu);
      }

      res.json(resultat);
    } catch (err) {
      console.error('Erreur GET /api/utilisateurs:', err);
      res.status(500).json({message: 'Erreur lors de la lecture des utilisateurs.'});
    }
  });

  app.get('/api/utilisateurs/:id', (req, res) => {
    try {
      const db = lireBase();
      const utilisateur = db.utilisateurs.find((u) => u.id === req.params.id);
      if (!utilisateur) {
        res.status(404).json({message: 'Utilisateur introuvable.'});
        return;
      }
      res.json(utilisateur);
    } catch (err) {
      console.error('Erreur GET /api/utilisateurs/:id:', err);
      res.status(500).json({message: 'Erreur serveur.'});
    }
  });

  app.post('/api/utilisateurs', (req, res) => {
    try {
      const nom = typeof req.body?.nom === 'string' ? req.body.nom.trim() : '';
      const prenom = typeof req.body?.prenom === 'string' ? req.body.prenom.trim() : '';
      const actif = typeof req.body?.actif === 'boolean' ? req.body.actif : true;

      if (!nom || !prenom) {
        res.status(400).json({message: 'Le nom et le prénom sont obligatoires.'});
        return;
      }

      const db = lireBase();
      const id =
        typeof req.body?.id === 'string' && req.body.id.trim()
          ? normaliserSlug(req.body.id)
          : genererIdentifiant(nom, prenom, db.utilisateurs);

      if (db.utilisateurs.some((u) => u.id === id)) {
        res.status(409).json({message: 'Un utilisateur avec cet identifiant existe déjà.'});
        return;
      }

      const nouvelUtilisateur: Utilisateur = {id, nom, prenom, actif};
      db.utilisateurs.push(nouvelUtilisateur);
      ecrireBase(db);
      res.status(201).json(nouvelUtilisateur);
    } catch (err) {
      console.error('Erreur POST /api/utilisateurs:', err);
      res.status(500).json({message: "Erreur lors de l'ajout de l'utilisateur."});
    }
  });

  app.put('/api/utilisateurs/:id', (req, res) => {
    try {
      const db = lireBase();
      const index = db.utilisateurs.findIndex((u) => u.id === req.params.id);
      if (index === -1) {
        res.status(404).json({message: 'Utilisateur introuvable.'});
        return;
      }

      const actuel = db.utilisateurs[index];
      const nom = typeof req.body?.nom === 'string' ? req.body.nom.trim() : actuel.nom;
      const prenom = typeof req.body?.prenom === 'string' ? req.body.prenom.trim() : actuel.prenom;
      const actif = typeof req.body?.actif === 'boolean' ? req.body.actif : actuel.actif;

      if (!nom || !prenom) {
        res.status(400).json({message: 'Le nom et le prénom sont obligatoires.'});
        return;
      }

      const misAJour: Utilisateur = {
        id: actuel.id,
        nom,
        prenom,
        actif,
      };
      db.utilisateurs[index] = misAJour;
      ecrireBase(db);
      res.json(misAJour);
    } catch (err) {
      console.error('Erreur PUT /api/utilisateurs/:id:', err);
      res.status(500).json({message: "Erreur lors de la modification de l'utilisateur."});
    }
  });

  app.patch('/api/utilisateurs/:id', (req, res) => {
    try {
      const db = lireBase();
      const index = db.utilisateurs.findIndex((u) => u.id === req.params.id);
      if (index === -1) {
        res.status(404).json({message: 'Utilisateur introuvable.'});
        return;
      }

      const actuel = db.utilisateurs[index];
      const nom = typeof req.body?.nom === 'string' ? req.body.nom.trim() : actuel.nom;
      const prenom = typeof req.body?.prenom === 'string' ? req.body.prenom.trim() : actuel.prenom;
      const actif = typeof req.body?.actif === 'boolean' ? req.body.actif : actuel.actif;

      if (!nom || !prenom) {
        res.status(400).json({message: 'Le nom et le prénom sont obligatoires.'});
        return;
      }

      const misAJour: Utilisateur = {id: actuel.id, nom, prenom, actif};
      db.utilisateurs[index] = misAJour;
      ecrireBase(db);
      res.json(misAJour);
    } catch (err) {
      console.error('Erreur PATCH /api/utilisateurs/:id:', err);
      res.status(500).json({message: "Erreur lors de la mise à jour de l'utilisateur."});
    }
  });

  app.delete('/api/utilisateurs/:id', (req, res) => {
    try {
      const db = lireBase();
      const index = db.utilisateurs.findIndex((u) => u.id === req.params.id);
      if (index === -1) {
        res.status(404).json({message: 'Utilisateur introuvable.'});
        return;
      }

      const [supprime] = db.utilisateurs.splice(index, 1);
      ecrireBase(db);
      res.json(supprime);
    } catch (err) {
      console.error('Erreur DELETE /api/utilisateurs/:id:', err);
      res.status(500).json({message: "Erreur lors de la suppression de l'utilisateur."});
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

demarrerServeur();
