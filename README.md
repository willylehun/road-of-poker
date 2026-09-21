# Road of Poker

Road of Poker est une application mobile installable de Texas Hold’em. Le joueur crée son profil, choisit l’un des 20 avatars, reçoit 1 000 $, puis progresse sur 15 tables internationales. Un top 3 déverrouille la destination suivante.

## Fonctionnalités

- parties de Texas Hold’em jouables contre cinq adversaires ;
- 15 tables avec une palette et une illustration originales ;
- classement de 100 joueurs, dont 99 identités fictives uniques ;
- roue quotidienne de 100 à 400 $ ;
- statistiques et qualification du top 6 à la Coupe du monde ;
- PWA installable sur Android, iPhone et ordinateur, avec mode hors ligne.

## Lancer localement

```bash
python3 -m http.server 8080 --directory dist
```

Ouvrez ensuite `http://localhost:8080`.

## Déploiement GitHub Pages

Le workflow inclus publie automatiquement le dossier `dist` à chaque envoi sur la branche `main`. Dans les paramètres du dépôt, choisissez **GitHub Actions** comme source de GitHub Pages.

## Installer l’application

- **Android** : ouvrez le jeu dans Chrome, touchez le menu `⋮`, puis **Installer l’application** ou **Ajouter à l’écran d’accueil**.
- **iPhone / iPad** : ouvrez le jeu dans Safari, touchez **Partager**, puis **Sur l’écran d’accueil** et **Ajouter**.
- **Ordinateur** : dans Chrome ou Edge, cliquez sur l’icône d’installation située dans la barre d’adresse.

Le bouton **Installer l’application** de l’écran d’accueil ouvre directement la fenêtre d’installation lorsqu’elle est disponible et affiche sinon le guide adapté à l’appareil.

## Structure

- `dist/app.js` : interface, progression et tournoi ;
- `dist/poker-engine.js` : cartes et évaluation des mains ;
- `dist/styles.css` : identité visuelle et responsive mobile ;
- `dist/assets/tables` : 15 illustrations originales ;
- `dist/manifest.webmanifest` et `dist/service-worker.js` : installation PWA.

By W
