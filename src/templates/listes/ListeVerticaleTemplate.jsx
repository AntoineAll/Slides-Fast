import { GenericForm } from '../GenericForm';
import { GenericNotes } from '../GenericNotes';

// Rendu visuel de la slide (Sections en colonnes compactes avec des polices optimisées)
export const ListeVerticaleVisual = ({ content }) => {
  const sections = content?.sections || [
    { titre: 'Première section', items: ['Élément 1', 'Élément 2'] },
  ];

  const gridColsClass =
    sections.length === 1 ? 'grid-cols-1 max-w-xl mx-auto w-full' :
    sections.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="w-[850px] aspect-video bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-2xl relative overflow-hidden flex-shrink-0">
      {/* Effet lumineux de fond subtil, cohérent avec Bento Grid */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full w-full flex flex-col p-8">
        {/* Titre de la slide */}
        <h3 className="text-3xl font-extrabold text-white text-center mb-6 tracking-tight break-words max-w-full">
          {content?.titre || 'Titre de la slide'}
        </h3>

        <div className={`flex-1 grid ${gridColsClass} gap-4 items-start`}>
          {sections.map((section, sIndex) => (
            <div key={sIndex} className="bg-gray-800/40 border border-gray-700/60 rounded-xl p-4 flex flex-col h-full">
              {section.titre && (
                <h4 className="text-blue-400 font-bold text-base mb-3 border-b border-gray-700 pb-1.5 break-words">
                  {section.titre}
                </h4>
              )}
              <ul className="space-y-4.5 flex-1">
                {section.items && section.items.length > 0 ? (
                  section.items.map((item, iIndex) => (
                    <li key={iIndex} className="text-gray-200 text-sm flex items-start gap-2">
                      <span className="text-blue-500 font-bold select-none mt-0.5">•</span>
                      <span className="break-words flex-1">{item || '...'}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-xs italic">Aucun élément</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const fields = [
  { key: 'titre', type: 'text', label: 'Titre de la slide', placeholder: 'Ex: Programme de la session...' },
  {
    key: 'sections',
    type: 'objectList',
    countMode: 'addRemove',
    min: 1,
    max: 3,
    addLabel: 'Ajouter une nouvelle section',
    fields: [
      { key: 'titre', type: 'text', label: null, placeholder: 'Titre de la section (optionnel)...' },
      { key: 'items', type: 'list', label: null, min: 1, max: 5, itemPlaceholder: 'Élément de la liste...', addLabel: 'Ajouter un élément' },
    ],
  },
];

export const ListeVerticaleForm = (props) => <GenericForm fields={fields} {...props} />;
export const ListeVerticaleNotes = (props) => <GenericNotes {...props} />;
