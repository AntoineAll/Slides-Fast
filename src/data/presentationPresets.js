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
        templateId: 'focus',
        content: {
          icone: '🎯',
          titre: 'Le problème',
          desc: 'Aujourd\'hui, vos utilisateurs perdent un temps précieux à cause d\'un processus manuel, coûteux et sujet aux erreurs. Le marché attend une meilleure solution.'
        }
      },
      {
        templateId: 'focus',
        content: {
          icone: '💡',
          titre: 'Notre solution',
          desc: 'Une plateforme simple, rapide et automatisée qui résout ce problème en quelques clics, sans compromis sur la qualité ni la sécurité des données.'
        }
      },
      {
        templateId: 'bento_grid',
        content: {
          badge: 'VALEUR',
          titre: 'Pourquoi nous ?',
          cards: [
            { titre: 'Innovation', description: 'Une approche unique sur le marché, protégée par notre savoir-faire technique.', tag: '01' },
            { titre: 'Traction', description: 'Une croissance validée par les premiers utilisateurs et des retours très positifs.', tag: '02' },
            { titre: 'Équipe', description: 'Des fondateurs complémentaires, expérimentés et passionnés par le sujet.', tag: '03' }
          ]
        }
      },
      {
        templateId: 'comparatif',
        content: {
          titre: 'Notre avantage compétitif',
          colGauche: {
            titre: 'Notre approche',
            items: ['Mise en place en quelques minutes', 'Tarification simple et transparente', 'Support réactif inclus']
          },
          colDroite: {
            titre: 'Solutions actuelles',
            items: ['Déploiement long et complexe', 'Coûts cachés et contrats rigides', 'Support lent ou payant en option']
          }
        }
      },
      {
        templateId: 'kpi',
        content: {
          chiffre: '10x',
          label: 'Croissance mensuelle moyenne',
          points: [
            '500+ utilisateurs actifs depuis le lancement',
            '92% de rétention à 30 jours',
            '4 partenariats stratégiques signés',
            'Objectif : 500k€ pour accélérer le recrutement'
          ]
        }
      },
      {
        templateId: 'timeline',
        content: {
          titre: 'Roadmap',
          steps: [
            { date: 'T1', titre: 'Lancement', desc: 'Mise en ligne de la version publique' },
            { date: 'T2', titre: 'Croissance', desc: 'Acquisition et premiers partenariats' },
            { date: 'T3', titre: 'Expansion', desc: 'Ouverture à de nouveaux marchés' },
            { date: 'T4', titre: 'Scale', desc: 'Levée de fonds et recrutement' }
          ]
        }
      },
      {
        templateId: 'piliers',
        content: {
          titre: 'L\'équipe fondatrice',
          pillars: [
            { icone: '🧑‍💻', titre: 'CEO / Produit', desc: '10 ans d\'expérience dans le secteur, ancien(ne) porteur(se) de projet.' },
            { icone: '⚙️', titre: 'CTO / Tech', desc: 'Expertise technique solide, a déjà mené un produit de zéro à l\'échelle.' },
            { icone: '📈', titre: 'CMO / Growth', desc: 'Spécialiste acquisition et croissance, réseau étendu dans le secteur.' }
          ]
        }
      },
      {
        templateId: 'titre_texte',
        content: { titre: 'Rejoignez l\'aventure', texte: 'Nous levons 500k€ pour accélérer notre croissance. Parlons-en.' }
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
        content: {
          titre: 'Ordre du jour de la semaine',
          sections: [
            { titre: 'Cette semaine', items: ['Revue du sprint en cours', 'Point sur les livraisons'] },
            { titre: 'Points bloquants', items: ['Dépendance externe en attente', 'Ressource à confirmer'] },
            { titre: 'Décisions à prendre', items: ['Priorisation du prochain sprint', 'Validation du budget'] }
          ]
        }
      },
      {
        templateId: 'kpi',
        content: {
          chiffre: '72%',
          label: 'Avancement du sprint',
          points: [
            '8 tâches terminées sur 11',
            '2 tâches en cours de revue',
            '1 tâche bloquée depuis 3 jours',
            'Vélocité stable par rapport au sprint précédent'
          ]
        }
      },
      {
        templateId: 'comparatif',
        content: {
          titre: 'Bilan de la semaine',
          colGauche: {
            titre: 'Ce qui a bien avancé',
            items: ['Livraison de la fonctionnalité X dans les temps', 'Bonne collaboration avec l\'équipe design']
          },
          colDroite: {
            titre: 'Points de blocage',
            items: ['Retour client toujours en attente', 'Environnement de test instable']
          }
        }
      },
      {
        templateId: 'timeline',
        content: {
          titre: 'Roadmap & jalons',
          steps: [
            { date: 'S1', titre: 'Cadrage', desc: 'Spécifications validées' },
            { date: 'S2', titre: 'Développement', desc: 'Implémentation en cours' },
            { date: 'S3', titre: 'Tests', desc: 'Recette et corrections' },
            { date: 'S4', titre: 'Livraison', desc: 'Mise en production' }
          ]
        }
      },
      {
        templateId: 'deux_colonnes',
        content: {
          titre: 'Actions pour la semaine prochaine',
          colGauche: {
            titre: 'Priorités',
            items: ['Débloquer la dépendance externe', 'Finaliser la revue de code en attente']
          },
          colDroite: {
            titre: 'En attente de retour',
            items: ['Validation du budget par la direction', 'Retour client sur la V2']
          }
        }
      },
      {
        templateId: 'titre_texte',
        content: { titre: 'Questions / Divers', texte: 'Ouvert à toute question ou sujet non prévu à l\'ordre du jour.' }
      }
    ]
  },
  {
    id: 'bilan-trimestriel',
    name: 'Bilan / Rapport trimestriel',
    description: 'Résultats, chiffres clés et perspectives d\'un trimestre.',
    icon: '📊',
    slides: [
      {
        templateId: 'titre_texte',
        content: { titre: 'Bilan du trimestre', texte: 'Résultats, faits marquants et perspectives pour la suite.' }
      },
      {
        templateId: 'kpi',
        content: {
          chiffre: '+24%',
          label: 'Croissance du chiffre d\'affaires',
          points: [
            'Objectif trimestriel dépassé de 8 points',
            'Marge opérationnelle stable',
            '3 nouveaux clients majeurs signés',
            'Taux de satisfaction client de 94%'
          ]
        }
      },
      {
        templateId: 'diagramme_circulaire',
        content: {
          titre: 'Répartition du chiffre d\'affaires',
          unite: 'pourcentage',
          parts: [
            { label: 'Ventes directes', valeur: 45, couleur: '#3b82f6' },
            { label: 'Partenaires', valeur: 30, couleur: '#06b6d4' },
            { label: 'Abonnements', valeur: 15, couleur: '#f59e0b' },
            { label: 'Autres', valeur: 10, couleur: '#8b5cf6' }
          ]
        }
      },
      {
        templateId: 'comparatif',
        content: {
          titre: 'Analyse du trimestre',
          colGauche: {
            titre: 'Points positifs',
            items: ['Croissance au-delà des objectifs', 'Amélioration de la satisfaction client', 'Nouvelle recrue clé intégrée']
          },
          colDroite: {
            titre: 'Points de vigilance',
            items: ['Délai de livraison à surveiller', 'Coûts d\'acquisition en légère hausse']
          }
        }
      },
      {
        templateId: 'bento_grid',
        content: {
          badge: 'FAITS MARQUANTS',
          titre: 'Les temps forts du trimestre',
          cards: [
            { titre: 'Nouveau client majeur', description: 'Signature d\'un contrat stratégique sur un nouveau marché.', tag: '01' },
            { titre: 'Lancement produit', description: 'Mise en ligne réussie de la nouvelle fonctionnalité phare.', tag: '02' },
            { titre: 'Recrutement', description: 'Renforcement de l\'équipe avec deux nouveaux profils clés.', tag: '03' }
          ]
        }
      },
      {
        templateId: 'timeline',
        content: {
          titre: 'Prochaines étapes',
          steps: [
            { date: 'M1', titre: 'Consolidation', desc: 'Stabiliser les acquis du trimestre' },
            { date: 'M2', titre: 'Expansion', desc: 'Ouvrir un nouveau segment de marché' },
            { date: 'M3', titre: 'Bilan', desc: 'Préparer la revue du trimestre suivant' }
          ]
        }
      },
      {
        templateId: 'titre_texte',
        content: { titre: 'Merci', texte: 'Des questions ? Nous sommes ouverts à la discussion.' }
      }
    ]
  },
  {
    id: 'formation',
    name: 'Cours / Formation',
    description: 'Structure pédagogique pour un cours ou un atelier.',
    icon: '🎓',
    slides: [
      {
        templateId: 'titre_texte',
        content: { titre: 'Titre de la formation', texte: 'Un sous-titre qui résume l\'objectif pédagogique de la session.' }
      },
      {
        templateId: 'liste_verticale',
        content: {
          titre: 'Plan du cours',
          sections: [
            { titre: 'Partie 1', items: ['Introduction et objectifs', 'Notions de base'] },
            { titre: 'Partie 2', items: ['Concepts avancés', 'Étude de cas pratique'] },
            { titre: 'Partie 3', items: ['Mise en application', 'Questions & synthèse'] }
          ]
        }
      },
      {
        templateId: 'focus',
        content: {
          icone: '💡',
          titre: 'Concept clé',
          desc: 'La notion centrale à retenir de cette session, expliquée simplement avec un exemple concret pour bien l\'ancrer.'
        }
      },
      {
        templateId: 'piliers',
        content: {
          titre: 'Les 3 principes fondamentaux',
          pillars: [
            { icone: '1️⃣', titre: 'Premier principe', desc: 'Description courte et claire du premier principe abordé.' },
            { icone: '2️⃣', titre: 'Deuxième principe', desc: 'Description courte et claire du deuxième principe abordé.' },
            { icone: '3️⃣', titre: 'Troisième principe', desc: 'Description courte et claire du troisième principe abordé.' }
          ]
        }
      },
      {
        templateId: 'comparatif',
        content: {
          titre: 'Avant / Après',
          colGauche: {
            titre: 'Bonnes pratiques',
            items: ['Planifier avant d\'agir', 'Documenter ses choix', 'Tester régulièrement']
          },
          colDroite: {
            titre: 'Erreurs courantes',
            items: ['Se précipiter sans plan', 'Négliger la documentation', 'Ne tester qu\'à la fin']
          }
        }
      },
      {
        templateId: 'diagramme_circulaire',
        content: {
          titre: 'Répartition du temps de la session',
          unite: 'pourcentage',
          parts: [
            { label: 'Théorie', valeur: 40, couleur: '#3b82f6' },
            { label: 'Exemples', valeur: 25, couleur: '#06b6d4' },
            { label: 'Pratique', valeur: 25, couleur: '#f59e0b' },
            { label: 'Questions', valeur: 10, couleur: '#8b5cf6' }
          ]
        }
      },
      {
        templateId: 'titre_texte',
        content: { titre: 'Pour aller plus loin', texte: 'Ressources complémentaires, lectures conseillées et prochains ateliers.' }
      }
    ]
  },
  {
    id: 'proposition-commerciale',
    name: 'Proposition commerciale',
    description: 'Présenter une offre et convaincre un prospect.',
    icon: '💼',
    slides: [
      {
        templateId: 'focus',
        content: {
          icone: '🎯',
          titre: 'Votre défi',
          desc: 'Vous cherchez une solution fiable pour gagner du temps et réduire vos coûts, sans sacrifier la qualité de service.'
        }
      },
      {
        templateId: 'deux_colonnes',
        content: {
          titre: 'Notre offre',
          colGauche: {
            titre: 'Inclus dans l\'offre',
            items: ['Mise en place accompagnée', 'Support prioritaire', 'Mises à jour incluses']
          },
          colDroite: {
            titre: 'Options additionnelles',
            items: ['Formation approfondie de l\'équipe', 'Intégrations sur mesure']
          }
        }
      },
      {
        templateId: 'comparatif',
        content: {
          titre: 'Pourquoi nous choisir',
          colGauche: {
            titre: 'Notre solution',
            items: ['Déploiement en quelques jours', 'Accompagnement dédié', 'Tarification transparente']
          },
          colDroite: {
            titre: 'Concurrence',
            items: ['Déploiement de plusieurs semaines', 'Support générique', 'Coûts additionnels fréquents']
          }
        }
      },
      {
        templateId: 'kpi',
        content: {
          chiffre: '98%',
          label: 'Satisfaction client',
          points: [
            'Plus de 200 entreprises accompagnées',
            'Temps de mise en place moyen : 5 jours',
            'Support disponible 7j/7',
            'Taux de renouvellement de 95%'
          ]
        }
      },
      {
        templateId: 'bento_grid',
        content: {
          badge: 'BÉNÉFICES',
          titre: 'Ce que vous obtenez',
          cards: [
            { titre: 'Gain de temps', description: 'Automatisez les tâches répétitives dès la première semaine.', tag: '01' },
            { titre: 'Réduction des coûts', description: 'Un retour sur investissement visible dès le premier trimestre.', tag: '02' },
            { titre: 'Tranquillité d\'esprit', description: 'Un accompagnement dédié à chaque étape du projet.', tag: '03' }
          ]
        }
      },
      {
        templateId: 'timeline',
        content: {
          titre: 'Plan de déploiement',
          steps: [
            { date: 'J1', titre: 'Cadrage', desc: 'Atelier de démarrage avec votre équipe' },
            { date: 'J5', titre: 'Mise en place', desc: 'Configuration et intégration' },
            { date: 'J10', titre: 'Formation', desc: 'Prise en main par vos équipes' },
            { date: 'J15', titre: 'Lancement', desc: 'Passage en production' }
          ]
        }
      },
      {
        templateId: 'titre_texte',
        content: { titre: 'Prêts à démarrer ?', texte: 'Contactez-nous pour planifier un premier échange.' }
      }
    ]
  }
];
