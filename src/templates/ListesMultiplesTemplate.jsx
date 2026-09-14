import { GenericForm } from './GenericForm';
import { GenericNotes } from './GenericNotes';

// Rendu visuel de la slide (Listes Multiples)
export const ListesMultiplesVisual = ({ content }) => {
  const lists = content?.lists || [
    { titre: 'Catégorie 1', items: ['Élément A', 'Élément B'] },
    { titre: 'Catégorie 2', items: ['Élément C', 'Élément D'] },
    { titre: 'Catégorie 3', items: ['Élément E', 'Élément F'] },
  ];

  return (
    <div className="w-[850px] aspect-video bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col p-10 relative overflow-hidden flex-shrink-0">
      {/* Titre de la slide */}
      <h3 className="text-4xl font-extrabold text-white text-center mb-8 tracking-tight break-words max-w-full">
        {content?.titre || 'Mes listes d\'éléments'}
      </h3>

      <div className="flex-1 grid grid-cols-3 gap-6">
        {lists.map((list, colIndex) => (
          <div key={colIndex} className="bg-gray-800/40 border border-gray-700/60 rounded-xl p-5 flex flex-col">
            <h4 className="text-blue-400 font-bold text-lg mb-3 border-b border-gray-700 pb-2 break-words">
              {list.titre || `Liste ${colIndex + 1}`}
            </h4>
            <ul className="space-y-2">
              {list.items && list.items.length > 0 ? (
                list.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-200 text-sm flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="break-words">{item || '...'}</span>
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
  );
};

const fields = [
  { key: 'titre', type: 'text', label: 'Titre de la slide', placeholder: 'Ex: Répartition des tâches...' },
  {
    key: 'lists',
    type: 'objectList',
    countMode: 'fixed',
    min: 3,
    max: 3,
    fields: [
      { key: 'titre', type: 'text', label: null, placeholder: (i) => `Titre liste ${i + 1}`, defaultValue: (i) => `Catégorie ${i + 1}` },
      { key: 'items', type: 'list', label: null, min: 1, max: 5, itemPlaceholder: 'Élément...', addLabel: 'Élément' },
    ],
  },
];

export const ListesMultiplesForm = (props) => <GenericForm fields={fields} {...props} />;
export const ListesMultiplesNotes = (props) => <GenericNotes {...props} />;
