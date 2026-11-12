/* Configuration de la connexion par compte et des amis (Firebase). Voir AUTH-SETUP.md. */
window.APP_CONFIG = {
  /* Boutons de connexion affichés (l'e-mail est toujours là). Passe à true une fois le fournisseur activé dans Firebase. */
  providers: { google: true, facebook: false },
  /* Synchronisation montre via Strava : voir STRAVA-SETUP.md */
  strava: { clientId: "", relay: "" },
  firebase: {
    apiKey: "AIzaSyBLwE1stnJtj7sCtBydn_OnD3QUQlQjorc",
    authDomain: "carnet-muscu-9bff5.firebaseapp.com",
    projectId: "carnet-muscu-9bff5",
    appId: "1:986253023938:web:1fad5a39a7cd47a41cf95b"
  }
};
