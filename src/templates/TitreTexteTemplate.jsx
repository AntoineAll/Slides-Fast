import { GenericForm } from './GenericForm';
import { GenericNotes } from './GenericNotes';

// Rendu visuel de la slide (Titre et Texte)
export const TitreTexteVisual = ({ content }) => (
  <div className="w-[850px] aspect-video bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col items-center justify-center p-12 relative overflow-hidden flex-shrink-0 text-center">
    <h3 className="text-5xl font-extrabold text-white mb-6 tracking-tight break-words max-w-full">
      {content?.titre || 'Aucun titre'}
    </h3>

    <div className="max-w-2xl text-lg text-gray-300 font-medium break-words">
      {content?.texte || 'Aucun texte ajouté pour le moment...'}
    </div>
  </div>
);

const fields = [
  { key: 'titre', type: 'text', label: 'Titre de la slide', placeholder: 'Entrez votre titre...' },
  { key: 'texte', type: 'textarea', label: 'Contenu textuel', placeholder: 'Saisissez votre texte ici...', rows: 4 },
];

export const TitreTexteForm = (props) => <GenericForm fields={fields} {...props} />;
export const TitreTexteNotes = (props) => <GenericNotes {...props} />;
