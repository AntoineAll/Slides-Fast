import { TitreImageVisual, TitreImageForm } from './TitreImageTemplate';
import { TitreTexteVisual, TitreTexteForm } from './TitreTexteTemplate';

// Registre central des templates avec leurs métadonnées, composants visuels et formulaires
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
};
// Liste pour un sélecteur de template si l'utilisateur doit changer de modèle depuis l'éditeur
export const templateList = Object.values(templates);