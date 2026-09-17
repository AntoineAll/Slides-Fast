import { TitreImageVisual, TitreImageForm, TitreImageNotes } from './TitreImageTemplate';
import { TitreTexteVisual, TitreTexteForm, TitreTexteNotes } from './TitreTexteTemplate';
import { DiagrammeCirculaireVisual, DiagrammeCirculaireForm, DiagrammeCirculaireNotes } from './DiagrammeCirculaireTemplate';
import { ComparatifVisual, ComparatifForm, ComparatifNotes } from './ComparatifTemplate';
import { TimelineVisual, TimelineForm, TimelineNotes } from './TimelineTemplate';
import { PiliersVisual, PiliersForm, PiliersNotes } from './PiliersTemplate';
import { FocusVisual, FocusForm, FocusNotes } from './FocusTemplate';
import { KpiVisual, KpiForm, KpiNotes } from './KpiTemplate';
import { DeuxColonnesVisual, DeuxColonnesForm, DeuxColonnesNotes } from './DeuxColonnesTemplate';
import { ListeVerticaleVisual, ListeVerticaleForm, ListeVerticaleNotes } from './ListeVerticaleTemplate';
import { BentoGridVisual, BentoGridForm, BentoGridNotes } from './BentoGridTemplate';

// Catégories utilisées pour regrouper les modèles dans le sélecteur (menu déroulant et
// grille visuelle), pour qu'il soit plus rapide de trouver le bon type de slide.
export const templateCategories = [
  'Titre & Message',
  'Données & Chiffres',
  'Comparaison',
  'Structure & Progression',
  'Listes',
];

export const templates = {
  titre_image: {
    id: 'titre_image',
    name: 'Titre & Image',
    category: 'Titre & Message',
    Visual: TitreImageVisual,
    Form: TitreImageForm,
    Notes: TitreImageNotes,
  },
  titre_texte: {
    id: 'titre_texte',
    name: 'Titre & Texte',
    category: 'Titre & Message',
    Visual: TitreTexteVisual,
    Form: TitreTexteForm,
    Notes: TitreTexteNotes,
  },
  focus: {
    id: 'focus',
    name: 'Mise en avant (Spotlight)',
    category: 'Titre & Message',
    Visual: FocusVisual,
    Form: FocusForm,
    Notes: FocusNotes,
  },
  diagramme_circulaire: {
    id: 'diagramme_circulaire',
    name: 'Diagramme Circulaire',
    category: 'Données & Chiffres',
    Visual: DiagrammeCirculaireVisual,
    Form: DiagrammeCirculaireForm,
    Notes: DiagrammeCirculaireNotes,
  },
  kpi: {
    id: 'kpi',
    name: 'Données & KPIs',
    category: 'Données & Chiffres',
    Visual: KpiVisual,
    Form: KpiForm,
    Notes: KpiNotes,
  },
  comparatif: {
    id: 'comparatif',
    name: 'Comparatif Pros/Cons',
    category: 'Comparaison',
    Visual: ComparatifVisual,
    Form: ComparatifForm,
    Notes: ComparatifNotes,
  },
  deux_colonnes: {
    id: 'deux_colonnes',
    name: '2 Colonnes',
    category: 'Comparaison',
    Visual: DeuxColonnesVisual,
    Form: DeuxColonnesForm,
    Notes: DeuxColonnesNotes,
  },
  timeline: {
    id: 'timeline',
    name: 'Timeline / Roadmap',
    category: 'Structure & Progression',
    Visual: TimelineVisual,
    Form: TimelineForm,
    Notes: TimelineNotes,
  },
  piliers: {
    id: 'piliers',
    name: '3 Piliers / Valeurs',
    category: 'Structure & Progression',
    Visual: PiliersVisual,
    Form: PiliersForm,
    Notes: PiliersNotes,
  },
  bento_grid: {
    id: 'bento_grid',
    name: 'Bento Grid',
    category: 'Structure & Progression',
    Visual: BentoGridVisual,
    Form: BentoGridForm,
    Notes: BentoGridNotes,
  },
  liste_verticale: {
    id: 'liste_verticale',
    name: 'Liste Verticale Segmentée',
    category: 'Listes',
    Visual: ListeVerticaleVisual,
    Form: ListeVerticaleForm,
    Notes: ListeVerticaleNotes,
  },
};

export const templateList = Object.values(templates);