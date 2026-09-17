// Contenu d'exemple utilisé uniquement pour l'aperçu visuel des modèles (sélecteur en
// grille) : chaque slide y est pré-remplie avec des données "accrocheuses" plutôt que les
// textes de substitution ternes affichés à vide ("Aucun titre", "Titre de la carte"...),
// pour que le choix d'un modèle se fasse vraiment sur son rendu, pas sur une coquille vide.

// Petit dégradé encodé en SVG, généré localement (aucune requête réseau, dans l'esprit
// "tout en local" du reste de l'app) pour simuler une photo dans les aperçus qui ont une image.
const placeholderImage = (from, to) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>`
  )}`;

export const templatePreviewContent = {
  titre_image: {
    titre: 'Notre Vision 2025',
    imageUrl: placeholderImage('#6366f1', '#06b6d4'),
    legende: 'Photo : équipe produit',
  },
  titre_texte: {
    titre: 'Merci !',
    texte: 'Des questions ? Discutons-en ensemble.',
  },
  focus: {
    titre: 'Le marché double chaque année',
    desc: 'Une opportunité unique à saisir dès maintenant.',
    imageUrl: placeholderImage('#f59e0b', '#ef4444'),
  },
  diagramme_circulaire: {
    titre: 'Répartition du budget',
    unite: 'pourcentage',
    parts: [
      { label: 'Marketing', valeur: 40, couleur: '#6366f1' },
      { label: 'R&D', valeur: 35, couleur: '#06b6d4' },
      { label: 'Opérations', valeur: 25, couleur: '#f59e0b' },
    ],
  },
  kpi: {
    chiffre: '92%',
    label: 'Satisfaction client',
    points: ['+18 points vs 2023', 'Basé sur 1200 réponses', 'Mesuré chaque trimestre', 'Objectif 95% en 2025'],
  },
  comparatif: {
    titre: 'Solution A vs Solution B',
    colGauche: { titre: 'Avantages', items: ['Déploiement rapide', 'Coût maîtrisé', 'Support réactif'] },
    colDroite: { titre: 'Inconvénients', items: ['Moins flexible', 'Personnalisation limitée'] },
  },
  deux_colonnes: {
    titre: 'Avant / Après',
    colGauche: { titre: 'Avant', items: ['Processus manuel', 'Délais longs'] },
    colDroite: { titre: 'Après', items: ['Automatisé', 'Livraison en 24h'] },
  },
  timeline: {
    titre: 'Feuille de route 2025',
    steps: [
      { date: 'T1', titre: 'Lancement', desc: 'Sortie de la v1' },
      { date: 'T2', titre: 'Croissance', desc: 'Acquisition utilisateurs' },
      { date: 'T3', titre: 'International', desc: "Ouverture à l'Europe" },
    ],
  },
  piliers: {
    titre: 'Nos Valeurs',
    pillars: [
      { icone: '🚀', titre: 'Innovation', desc: 'Repousser les limites technologiques.' },
      { icone: '🤝', titre: 'Confiance', desc: 'Un partenariat durable et transparent.' },
      { icone: '💎', titre: 'Qualité', desc: 'Une exigence de précision absolue.' },
    ],
  },
  bento_grid: {
    badge: 'POURQUOI NOUS',
    titre: 'Ce qui nous différencie',
    cards: [
      { tag: '01', titre: 'Rapide', description: "Mise en place en moins d'une semaine.", imageUrl: placeholderImage('#6366f1', '#8b5cf6') },
      { tag: '02', titre: 'Sécurisé', description: 'Chiffrement de bout en bout.' },
      { tag: '03', titre: 'Évolutif', description: 'Grandit avec votre activité.', imageUrl: placeholderImage('#06b6d4', '#22d3ee') },
    ],
  },
  liste_verticale: {
    titre: "Ordre du jour",
    sections: [
      { titre: 'Ce matin', items: ['Point sécurité', 'Revue des KPIs'] },
      { titre: 'Cet après-midi', items: ['Atelier produit', 'Questions/Réponses'] },
    ],
  },
};
