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

export const templates = {
  titre_image: {
    id: 'titre_image',
    name: 'Titre & Image',
    Visual: TitreImageVisual,
    Form: TitreImageForm,
    Notes: TitreImageNotes,
  },
  titre_texte: {
    id: 'titre_texte',
    name: 'Titre & Texte',
    Visual: TitreTexteVisual,
    Form: TitreTexteForm,
    Notes: TitreTexteNotes,
  },
  diagramme_circulaire: {
    id: 'diagramme_circulaire',
    name: 'Diagramme Circulaire',
    Visual: DiagrammeCirculaireVisual,
    Form: DiagrammeCirculaireForm,
    Notes: DiagrammeCirculaireNotes,
  },
  comparatif: {
    id: 'comparatif',
    name: 'Comparatif Pros/Cons',
    Visual: ComparatifVisual,
    Form: ComparatifForm,
    Notes: ComparatifNotes,
  },
  timeline: {
    id: 'timeline',
    name: 'Timeline / Roadmap',
    Visual: TimelineVisual,
    Form: TimelineForm,
    Notes: TimelineNotes,
  },
  piliers: {
    id: 'piliers',
    name: '3 Piliers / Valeurs',
    Visual: PiliersVisual,
    Form: PiliersForm,
    Notes: PiliersNotes,
  },
  focus: {
    id: 'focus',
    name: 'Mise en avant (Spotlight)',
    Visual: FocusVisual,
    Form: FocusForm,
    Notes: FocusNotes,
  },
  kpi: {
    id: 'kpi',
    name: 'Données & KPIs',
    Visual: KpiVisual,
    Form: KpiForm,
    Notes: KpiNotes,
  },
  deux_colonnes: {
    id: 'deux_colonnes',
    name: '2 Colonnes',
    Visual: DeuxColonnesVisual,
    Form: DeuxColonnesForm,
    Notes: DeuxColonnesNotes,
  },
  liste_verticale: {
    id: 'liste_verticale',
    name: 'Liste Verticale Segmentée',
    Visual: ListeVerticaleVisual,
    Form: ListeVerticaleForm,
    Notes: ListeVerticaleNotes,
  },
  bento_grid: {
    id: 'bento_grid',
    name: 'Bento Grid',
    Visual: BentoGridVisual,
    Form: BentoGridForm,
    Notes: BentoGridNotes,
  },
};

export const templateList = Object.values(templates);