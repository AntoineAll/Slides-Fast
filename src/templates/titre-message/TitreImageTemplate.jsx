import { GenericForm } from '../GenericForm';
import { GenericNotes } from '../GenericNotes';

// Rendu visuel de la slide (utilisé dans l'onglet Visuel)
export const TitreImageVisual = ({ content }) => (
  <div className="w-[850px] aspect-video bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-2xl relative overflow-hidden flex-shrink-0">
    {/* Effet lumineux de fond subtil, cohérent avec Bento Grid */}
    <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

    {/* z-10 : les halos sont en position absolue donc au-dessus du contenu normal par défaut
        (règles d'empilement CSS), il faut le relever explicitement pour rester lisible. */}
    <div className="relative z-10 h-full w-full flex flex-col items-center justify-center p-8">
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
  </div>
);

const fields = [
  { key: 'titre', type: 'text', label: 'Titre de la slide', placeholder: 'Entrez votre titre...' },
  { key: 'imageUrl', type: 'image', label: 'Image', placeholder: 'https://exemple.com/image.jpg' },
  { key: 'legende', type: 'text', label: 'Légende (optionnel)', placeholder: 'Ex : Figure 1 — schéma du procédé' },
];

export const TitreImageForm = (props) => <GenericForm fields={fields} {...props} />;
export const TitreImageNotes = (props) => <GenericNotes {...props} />;
