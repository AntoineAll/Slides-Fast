import { GenericForm } from '../GenericForm';
import { GenericNotes } from '../GenericNotes';

// Rendu visuel de la slide (Titre et Texte)
export const TitreTexteVisual = ({ content }) => (
  <div className="w-[850px] aspect-video bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-2xl relative overflow-hidden flex-shrink-0">
    {/* Effet lumineux de fond subtil, cohérent avec Bento Grid */}
    <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10 h-full w-full flex flex-col items-center justify-center p-12 text-center">
      <h3 className="text-5xl font-extrabold text-white mb-6 tracking-tight break-words max-w-full">
        {content?.titre || 'Aucun titre'}
      </h3>

      <div className="max-w-2xl text-lg text-gray-300 font-medium break-words">
        {content?.texte || 'Aucun texte ajouté pour le moment...'}
      </div>
    </div>
  </div>
);

const fields = [
  { key: 'titre', type: 'text', label: 'Titre de la slide', placeholder: 'Entrez votre titre...' },
  { key: 'texte', type: 'textarea', label: 'Contenu textuel', placeholder: 'Saisissez votre texte ici...', rows: 4 },
];

export const TitreTexteForm = (props) => <GenericForm fields={fields} {...props} />;
export const TitreTexteNotes = (props) => <GenericNotes {...props} />;
