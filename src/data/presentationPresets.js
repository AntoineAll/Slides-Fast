export const presentationPresets = [
  {
    id: 'blank',
    name: 'Présentation vide',
    description: 'Commencer avec une page blanche.',
    icon: '📄',
    slides: [
      { templateId: 'titre_texte', content: { titre: 'Bienvenue', texte: 'Commencez à rédiger ici...' } }
    ]
  },
  {
    id: 'pitch-deck',
    name: 'Pitch Deck Startup',
    description: 'Idéal pour présenter un projet ou lever des fonds.',
    icon: '🚀',
    slides: [
      {
        templateId: 'titre_texte',
        content: { titre: 'Nom de votre Startup', texte: 'La phrase d\'accroche qui résume votre vision.' }
      },
      {
        templateId: 'bento_grid',
        content: { 
          badge: 'VALEUR', 
          titre: 'Pourquoi nous ?', 
          cards: [
            { titre: 'Innovation', description: 'Une approche unique sur le marché.', tag: '01' },
            { titre: 'Traction', description: 'Une croissance validée par les premiers utilisateurs.', tag: '02' },
            { titre: 'Équipe', description: 'Des fondateurs complémentaires et passionnés.', tag: '03' }
          ]
        }
      },
      {
        templateId: 'kpi',
        content: { titre: 'Chiffres Clés', kpis: [{ valeur: '10x', label: 'ROI Moyen' }, { valeur: '500k€', label: 'Objectif' }] }
      }
    ]
  },
  {
    id: 'point-hebdo',
    name: 'Réunion d\'équipe / Point Hebdo',
    description: 'Suivi de projet, ordre du jour et avancement.',
    icon: '👥',
    slides: [
      {
        templateId: 'liste_verticale',
        content: { titre: 'Ordre du jour de la semaine' }
      },
      {
        templateId: 'timeline',
        content: { titre: 'Roadmap & Jalons' }
      }
    ]
  }
];