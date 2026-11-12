# Activer la connexion Apple / Google (Android) / Facebook

Le code est déjà dans l'app. Il ne manque que tes propres clés (je ne peux pas les créer à ta place : elles sont liées à tes comptes).
Sans clés, l'app marche sans compte, avec les données sur le téléphone.

## 1. Projet Firebase (gratuit)
1. Va sur console.firebase.google.com > « Ajouter un projet ».
2. Dans « Paramètres du projet » > « Vos applications » > icône Web (</>) : enregistre l'app et copie `apiKey`, `authDomain`, `projectId`, `appId`.
3. Colle-les dans `config.js`, puis remets les fichiers en ligne.
4. Authentication > Settings > « Domaines autorisés » : ajoute le domaine où l'app est hébergée.

## 2. Activer chaque fournisseur (Authentication > Sign-in method)
- **Google (= connexion Android)** : active-le, choisis l'e-mail d'assistance. C'est le plus simple.
- **Facebook** : crée une app sur developers.facebook.com, copie l'ID et la clé secrète dans Firebase, puis colle dans Facebook l'« URI de redirection OAuth » affichée par Firebase.
- **Apple** : demande un compte Apple Developer (99 $/an). Crée un « Services ID », une clé « Sign in with Apple », puis renseigne Services ID, Team ID, Key ID et la clé dans Firebase, et l'URL de retour affichée par Firebase côté Apple.

## 3. Base de données (Firestore Database)
Crée la base (mode production), onglet Règles :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```
Chaque personne ne peut lire et écrire que ses propres données.

## Remarques
- Les photos de salle et les anciens tracés (au-delà des 30 dernières sorties) ne sont pas envoyés en ligne.
- Sans compte, rien ne change.
- Si tu publies l'app, ajoute une politique de confidentialité (GPS, photos, données de santé : RGPD).
