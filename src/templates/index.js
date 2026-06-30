import { TitreImageVisual, TitreImageForm } from './TitreImageTemplate';
import { TitreTexteVisual, TitreTexteForm } from './TitreTexteTemplate';
import { DiagrammeCirculaireVisual, DiagrammeCirculaireForm } from './DiagrammeCirculaireTemplate';
import { ComparatifVisual, ComparatifForm } from './ComparatifTemplate';
import { TimelineVisual, TimelineForm } from './TimelineTemplate';
import { PiliersVisual, PiliersForm } from './PiliersTemplate';

export const templates = {
  titre_image: {
    id: 'titre_image',
    name: 'Titre & Image',
    Visual: TitreImageVisual,
    Form: TitreImageForm,
  },
  titre_texte: {
    id: 'titre_texte',
    name: 'Titre & Texte',
    Visual: TitreTexteVisual,
    Form: TitreTexteForm,
  },
  diagramme_circulaire: {
    id: 'diagramme_circulaire',
    name: 'Diagramme Circulaire',
    Visual: DiagrammeCirculaireVisual,
    Form: DiagrammeCirculaireForm,
  },
  comparatif: {
    id: 'comparatif',
    name: 'Comparatif Pros/Cons',
    Visual: ComparatifVisual,
    Form: ComparatifForm,
  },
  timeline: {
    id: 'timeline',
    name: 'Timeline / Roadmap',
    Visual: TimelineVisual,
    Form: TimelineForm,
  },
  piliers: { 
    id: 'piliers',
    name: '3 Piliers / Valeurs',
    Visual: PiliersVisual,
    Form: PiliersForm,
  },
};

export const templateList = Object.values(templates);