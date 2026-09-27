# Checklist de première publication

## À faire dès que le compte Play Console existe

- [ ] Vérifier l’identité du compte développeur.
- [ ] Si le compte est une organisation, fournir les informations juridiques et le numéro D-U-N-S demandés.
- [ ] Créer l’application avec l’identifiant `com.byw.roadofpoker`.
- [ ] Activer Play App Signing.
- [ ] Créer une clé d’envoi dédiée et en conserver deux sauvegardes sécurisées.
- [ ] Ajouter les quatre secrets décrits dans `play-store/README.md` aux secrets GitHub Actions.
- [ ] Lancer manuellement le workflow « Build signed Play Store AAB ».
- [ ] Télécharger `road-of-poker-play.aab` et vérifier son fichier SHA-256.
- [ ] Importer l’AAB dans la piste de test interne, puis dans la piste fermée requise par le type de compte.
- [ ] Compléter la fiche française à partir de `fastlane/metadata/android/fr-FR`.
- [ ] Ajouter une icône Play Store 512 × 512 et des captures d’écran réelles du jeu.
- [ ] Renseigner `https://willylehun.github.io/road-of-poker/privacy.html` comme politique de confidentialité.
- [ ] Compléter Sécurité des données à partir de `data-safety-fr.md`.
- [ ] Déclarer l’absence de publicité et d’achats intégrés.
- [ ] Compléter le questionnaire IARC à partir de `content-rating-fr.md`.
- [ ] Ne pas cibler les enfants et exclure initialement la Corée du Sud.
- [ ] Fournir les notes de validation de `review-notes-fr.md`.
- [ ] Tester création de profil, roue, Dakar, reprise de partie, sortie de table et mode paysage depuis la version Play.
- [ ] Vérifier les rapports automatisés de pré-lancement avant le passage en production.

## À ne jamais faire

- Ne jamais committer la clé d’envoi, ses mots de passe ou leur version encodée en base64.
- Ne jamais réutiliser une clé d’une autre application.
- Ne jamais annoncer de gains réels, de retrait ou de conversion du solde fictif.
- Ne jamais ajouter un SDK publicitaire ou analytique sans mettre à jour la politique et la fiche Sécurité des données.
