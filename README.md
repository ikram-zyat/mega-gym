# Méga Gym — gestion de salle de sport

Application web (React + Vite) pour gérer les **inscriptions**, les **candidats** et les **coachs** d'une salle de sport.

**Site en ligne :** https://VOTRE-NOM.github.io/mega-gym/

## Fonctionnalités
- Deux espaces : **administrateur** (compte créé à l'avance par le propriétaire avec `npm run make-admin`, personne d'autre ne peut en créer) et **client** (le client crée son compte, son e-mail et son mot de passe sont vérifiés à la connexion)
- Espace client : suivi de sa candidature, de son abonnement et liste des coachs
- Un client qui s'inscrit apparaît automatiquement dans les **Candidats** de l'administrateur
- Inscriptions : ajouter, modifier, supprimer, rechercher, suivre le statut (actif, en attente, expiré)
- Candidats : suivi de la candidature (nouveau, contacté, séance d'essai, accepté, refusé) et bouton **Inscrire** qui crée l'inscription
- Coachs : spécialités et disponibilités
- Données conservées dans le navigateur (localStorage), bouton de réinitialisation, affichage adapté au téléphone

## Technologies
React 18, Vite 5, CSS, déploiement avec GitHub Actions et GitHub Pages.

## Lancer en local
```bash
npm install
npm run dev
```

## Note
Le site est statique : il n'y a pas de serveur ni de base de données. Les comptes et les données sont enregistrés **dans le navigateur** de chaque visiteur : un client inscrit sur un appareil n'est donc visible que sur ce même navigateur. Les mots de passe sont hachés (SHA-256), mais ce n'est pas une vraie sécurité. Pour un usage réel, il faudrait un backend (par exemple Laravel) avec une vraie authentification.

## Photo de l'accueil
Ajoutez une photo de salle de sport sous le nom `public/images/hero.jpg` (format paysage, 1920 px de large environ). Sans photo, un fond sombre s'affiche à la place.

## Créer le compte administrateur
```bash
npm run make-admin
```
La commande demande votre nom, votre e-mail et un mot de passe (12 caractères minimum), puis écrit une empreinte du mot de passe dans `src/admin.config.js`. Publiez ensuite le fichier avec Git. Choisissez un mot de passe long et unique : l'empreinte est visible dans le dépôt.
