# Méga Gym — gestion de salle de sport

Application web (React + Vite) pour gérer les **inscriptions**, les **candidats** et les **coachs** d'une salle de sport.

**Démo en ligne :** https://VOTRE-NOM.github.io/mega-gym/ (identifiant `admin`, mot de passe `gym2025`)

## Fonctionnalités
- Deux espaces : **administrateur** (`admin` / `gym2025`) et **client** (le client crée son compte, son e-mail et son mot de passe sont vérifiés à la connexion)
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
