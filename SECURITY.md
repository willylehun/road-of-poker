# Sécurité

## Versions prises en charge

La dernière version publiée sur la branche `main` est la seule version maintenue.

## Signaler une vulnérabilité

Merci d’utiliser le formulaire privé **Security > Report a vulnerability** du dépôt GitHub. Ne publiez pas de vulnérabilité, de preuve d’exploitation, de jeton ou de donnée utilisateur dans une issue publique.

Indiquez la version concernée, les étapes de reproduction, l’impact estimé et, si possible, une correction proposée. Un accusé de réception et un calendrier de traitement seront communiqués dans le canal privé.

## Secrets

Aucun secret de production ne doit être ajouté au dépôt, au frontend, à l’APK ou aux journaux CI. Les futures clés de signature et informations d’identification devront être conservées dans GitHub Secrets ou dans le gestionnaire de secrets de l’hébergeur, avec des droits minimaux.
