import { GenericForm } from './GenericForm';
import { GenericNotes } from './GenericNotes';

// Rendu visuel de la slide (utilisé dans l'onglet Visuel)
export const TitreImageVisual = ({ content }) => (
  <div className="w-[850px] aspect-video bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden flex-shrink-0">
    <h3 className="text-4xl font-extrabold text-white mb-8 text-center break-words max-w-full tracking-tight">
      {content?.titre || 'Aucun titre'}
    </h3>

    {content?.imageUrl ? (
      <>
        {/* min-h-0 : sans ça, un enfant flex-1 dans une colonne ne peut pas rétrécir
            sous sa hauteur naturelle, et pousse la légende hors du cadre de la slide. */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
          <img
            src={content.imageUrl}
            alt="Aperçu de la slide"
            className="max-h-full max-w-full rounded-xl object-contain shadow-md"
          />
        </div>
        {content?.legende && (
          <p className="text-gray-400 text-sm italic text-center mt-4 max-w-full break-words flex-shrink-0">
            {content.legende}
          </p>
        )}
      </>
    ) : (
      <div className="text-gray-500 italic text-sm mt-4">Aucune image définie</div>
    )}
  </div>
);

const fields = [
  { key: 'titre', type: 'text', label: 'Titre de la slide', placeholder: 'Entrez votre titre...' },
  { key: 'imageUrl', type: 'image', label: 'Image', placeholder: 'https://exemple.com/image.jpg' },
  { key: 'legende', type: 'text', label: 'Légende (optionnel)', placeholder: 'Ex : Figure 1 — schéma du procédé' },
];

export const TitreImageForm = (props) => <GenericForm fields={fields} {...props} />;
export const TitreImageNotes = (props) => <GenericNotes {...props} />;
