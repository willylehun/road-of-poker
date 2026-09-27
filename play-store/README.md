# Préparation Google Play — Road of Poker

Ce dossier contient les textes et déclarations préparés pour la première publication. Il ne contient aucun secret, aucune clé de signature et aucune donnée personnelle.

## Éléments prêts

- métadonnées françaises dans `fastlane/metadata/android/fr-FR` ;
- réponses proposées pour la section Sécurité des données ;
- réponses proposées pour le classement du contenu ;
- notes destinées à l’équipe de validation ;
- checklist de publication ;
- workflow manuel `.github/workflows/play-store-aab.yml` pour produire un AAB signé une fois les secrets ajoutés.

## Secrets GitHub à créer ultérieurement

- `PLAY_UPLOAD_KEYSTORE_BASE64`
- `PLAY_UPLOAD_STORE_PASSWORD`
- `PLAY_UPLOAD_KEY_ALIAS`
- `PLAY_UPLOAD_KEY_PASSWORD`

La clé d’envoi doit être créée et sauvegardée hors du dépôt. Son fichier et ses mots de passe ne doivent jamais être placés dans Git, une issue, un log ou un message public.

## URL de confidentialité

`https://willylehun.github.io/road-of-poker/privacy.html`

Vérifier cette URL après chaque publication avant de la renseigner dans Play Console.
