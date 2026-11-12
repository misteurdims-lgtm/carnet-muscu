# Montre Garmin -> Strava -> Carnet de muscu (automatique)

Chaîne : ta montre Garmin -> Garmin Connect -> Strava -> Carnet de muscu (à l'ouverture de l'app).

## 1. Garmin Connect -> Strava (une seule fois)
Dans l'app Garmin Connect : Plus > Paramètres > Applications connectées > Strava > Connecter.

## 2. Créer ton application Strava (gratuit)
1. Va sur https://www.strava.com/settings/api
2. Nom : Carnet de muscu. Catégorie : n'importe laquelle. Site web : https://misteurdims-lgtm.github.io/carnet-muscu/
3. « Authorization Callback Domain » : misteurdims-lgtm.github.io
4. Note l'ID client (un nombre) et le Code secret.

## 3. Créer le relais sécurisé (Cloudflare, gratuit, sans carte)
1. Compte sur https://dash.cloudflare.com/sign-up puis Workers & Pages > Create > Create Worker, nom : carnet-relais, Deploy.
2. Edit code : remplace tout par le contenu de relay/worker.js, puis Deploy.
3. Settings > Variables and Secrets : ajoute STRAVA_ID (ton ID client, type Text) et STRAVA_SECRET (ton code secret, type Secret). Deploy.
4. Note l'adresse du worker (https://carnet-relais.XXXX.workers.dev).

## 4. Brancher l'app
Dans config.js, remplis strava : { clientId: "TON_ID", relay: "https://carnet-relais.XXXX.workers.dev" } puis enregistre.
Dans l'app : onglet Footing > « Relier Strava ».

Le code secret reste dans Cloudflare : il n'est jamais dans l'app ni dans GitHub.
