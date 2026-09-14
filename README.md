# SlidesFast

Un éditeur de présentations façon PowerPoint, en local, pensé pour être simple d'utilisation grâce à des formulaires plutôt qu'un canevas libre à manipuler à la souris.

## Le concept

- **Formulaire plutôt que canevas libre.** Chaque slide repose sur un modèle prédéfini (titre + image, KPI, timeline, comparatif...). On remplit un formulaire, l'aperçu visuel se met à jour en direct — pas de positionnement pixel par pixel.
- **JSON comme format de vérité.** Une présentation est un simple tableau de slides sérialisé en JSON : léger, lisible, versionnable, portable.
- **Souveraineté des données.** Tout reste en local — pas de compte, pas de serveur, pas de synchronisation cloud. L'état de travail est conservé dans le navigateur (`localStorage`) et peut être sauvegardé/rechargé en tant que vrai fichier `.json` sur le disque, dans l'esprit d'outils comme Obsidian.

## Fonctionnalités

- **11 modèles de slides** prêts à l'emploi : Titre & Image, Titre & Texte, Diagramme Circulaire, Comparatif Pros/Cons, Timeline/Roadmap, 3 Piliers/Valeurs, Mise en avant (Spotlight), Données & KPIs, 2 Colonnes, Liste Verticale Segmentée, Bento Grid.
- **Presets de démarrage** (pitch deck, point hebdo, page blanche...) pour ne pas partir de zéro.
- **Édition par formulaire** avec bascule vers un **aperçu visuel** zoomable.
- **Réorganisation des slides** par glisser-déposer dans la barre latérale.
- **Annuler / Rétablir** (`Ctrl+Z`, `Ctrl+Shift+Z` ou `Ctrl+Y`), avec regroupement des frappes rapprochées pour ne pas avoir à annuler lettre par lettre.
- **Mode présentateur** : notes par slide, aperçu de la slide suivante, prise en charge d'un second écran dédié à l'affichage public.
- **Sauvegarde locale** en `.json` (`Ctrl+S` ou bouton dédié), avec **import** validé — un fichier malformé ou un modèle inconnu est détecté et signalé clairement plutôt que de casser silencieusement la présentation.
- Protection contre la fermeture accidentelle de l'onglet quand une présentation est en cours d'édition.

## Stack technique

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Zustand](https://github.com/pmndrs/zustand) (avec `persist`) pour l'état global
- [Tailwind CSS 4](https://tailwindcss.com/) pour le style
- [dnd-kit](https://dndkit.com/) pour le glisser-déposer des slides

## Installation

```bash
npm install
npm run dev
```

Autres commandes disponibles :

```bash
npm run build     # build de production
npm run preview   # prévisualiser le build de production
npm run lint       # linter le code
```

## État du projet

Projet en cours de développement actif. À ce stade :

- Pas encore de design responsive (usage pensé pour un écran desktop).
- Pensé et utilisé pour l'instant par un seul utilisateur en local — pas de collaboration ni de synchronisation multi-appareils.
