// Rendu visuel de la slide (utilisé dans l'onglet Visuel)
export const TitreImageVisual = ({ content }) => (
  <div className="w-[850px] aspect-video bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden flex-shrink-0">
    <h3 className="text-4xl font-extrabold text-white mb-8 text-center break-words max-w-full tracking-tight">
      {content?.titre || 'Aucun titre'}
    </h3>
    
    {content?.imageUrl ? (
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
        <img
          src={content.imageUrl}
          alt="Aperçu de la slide"
          className="max-h-full max-w-full rounded-xl object-contain shadow-md"
        />
      </div>
    ) : (
      <div className="text-gray-500 italic text-sm mt-4">Aucune image définie</div>
    )}
  </div>
);

// Formulaire d'édition dynamique (utilisé dans l'onglet Formulaire)
export const TitreImageForm = ({ content, onChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Titre de la slide
      </label>
      <input
        type="text"
        value={content?.titre || ''}
        onChange={(e) => onChange('titre', e.target.value)}
        placeholder="Entrez votre titre..."
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        URL de l'image
      </label>
      <input
        type="text"
        value={content?.imageUrl || ''}
        onChange={(e) => onChange('imageUrl', e.target.value)}
        placeholder="https://exemple.com/image.jpg"
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500"
      />
    </div>
  </div>
);