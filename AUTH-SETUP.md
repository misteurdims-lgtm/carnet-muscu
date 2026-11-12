# Activer les comptes et les amis (E-mail, Google, Facebook, Apple)

Le code est déjà dans l'app. Il ne manque que tes propres clés (je ne peux pas les créer à ta place : elles sont liées à tes comptes).
Sans clés, l'app marche sans compte, avec les données sur le téléphone.

## 1. Projet Firebase (gratuit)
1. Va sur console.firebase.google.com > « Ajouter un projet ».
2. Dans « Paramètres du projet » > « Vos applications » > icône Web (</>) : enregistre l'app et copie `apiKey`, `authDomain`, `projectId`, `appId`.
3. Colle-les dans `config.js`, puis remets les fichiers en ligne.
4. Authentication > Settings > « Domaines autorisés » : ajoute le domaine où l'app est hébergée.

## 2. Activer chaque fournisseur (Authentication > Sign-in method)
- **E-mail / Mot de passe** : active-le. C'est le plus simple, sans compte développeur : l'ami crée son compte avec un pseudo, un e-mail et un mot de passe.
- **Google (= connexion Android)** : active-le, choisis l'e-mail d'assistance. C'est le plus simple.
- **Facebook** : crée une app sur developers.facebook.com, copie l'ID et la clé secrète dans Firebase, puis colle dans Facebook l'« URI de redirection OAuth » affichée par Firebase.
- **Apple** : demande un compte Apple Developer (99 $/an). Crée un « Services ID », une clé « Sign in with Apple », puis renseigne Services ID, Team ID, Key ID et la clé dans Firebase, et l'URL de retour affichée par Firebase côté Apple.

## 3. Base de données (Firestore Database)
Crée la base (mode production), onglet Règles :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function me() { return request.auth != null; }
    match /users/{uid} { allow read, write: if me() && request.auth.uid == uid; }
    match /profiles/{uid} { allow read: if me(); allow write: if me() && request.auth.uid == uid; }
    match /codes/{code} { allow read: if me(); allow create: if me() && request.resource.data.uid == request.auth.uid; }
    match /stats/{uid} {
      allow write: if me() && request.auth.uid == uid;
      allow read: if me() && (request.auth.uid == uid || exists(/databases/$(database)/documents/friends/$(uid)/with/$(request.auth.uid)));
    }
    match /requests/{to}/from/{from} {
      allow create: if me() && request.auth.uid == from;
      allow read, delete: if me() && (request.auth.uid == to || request.auth.uid == from);
    }
    match /friends/{uid}/with/{x} {
      allow write: if me() && request.auth.uid == uid;
      allow read: if me() && (request.auth.uid == uid || request.auth.uid == x);
      allow delete: if me() && (request.auth.uid == uid || request.auth.uid == x);
    }
    match /circle/{uid}/m/{x} { allow read, write: if me() && request.auth.uid == uid; }
    match /out/{uid}/to/{x} { allow read, write: if me() && request.auth.uid == uid; }
    match /cheers/{to}/from/{id} {
      allow create: if me() && request.resource.data.from == request.auth.uid
        && exists(/databases/$(database)/documents/friends/$(to)/with/$(request.auth.uid));
      allow read, delete: if me() && request.auth.uid == to;
    }
  }
}
```
Tes données complètes restent privées. Un ami ne voit que ton pseudo, ton avatar et tes totaux (points, séances, kilomètres), et seulement après acceptation de la demande.

## 4. Les amis
Onglet Défis > Amis : chacun a un code à 6 caractères. On saisit le code d'un ami, il accepte, et vous voyez le classement et vous pouvez vous encourager.

## Remarques
- Les photos de salle et les anciens tracés (au-delà des 30 dernières sorties) ne sont pas envoyés en ligne.
- Sans compte, rien ne change.
- Si tu publies l'app, ajoute une politique de confidentialité (GPS, photos, données de santé : RGPD).
