import { GenericForm } from './GenericForm';
import { GenericNotes } from './GenericNotes';

// Rendu visuel de la slide (2 Colonnes)
export const DeuxColonnesVisual = ({ content }) => {
  const colG = content?.colGauche || { titre: 'Colonne 1', items: ['Élément 1', 'Élément 2'] };
  const colD = content?.colDroite || { titre: 'Colonne 2', items: ['Élément 1', 'Élément 2'] };

  return (
    <div className="w-[850px] aspect-video bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col p-10 relative overflow-hidden flex-shrink-0">
      {/* Titre de la slide */}
      <h3 className="text-4xl font-extrabold text-white text-center mb-8 tracking-tight break-words max-w-full">
        {content?.titre || 'Vue d\'ensemble'}
      </h3>

      <div className="flex-1 flex gap-8">
        {/* Colonne Gauche */}
        <div className="flex-1 bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6 flex flex-col">
          <h4 className="text-blue-400 font-bold text-xl mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
            <span className="w-6 h-6 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center text-xs">🔹</span>
            {colG.titre}
          </h4>
          <ul className="space-y-3">
            {colG.items.map((item, i) => (
              <li key={i} className="text-gray-200 text-sm flex items-start gap-3">
                <span className="text-blue-500 mt-1">•</span>
                <span className="break-words">{item || '...'}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne Droite */}
        <div className="flex-1 bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6 flex flex-col">
          <h4 className="text-blue-400 font-bold text-xl mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
            <span className="w-6 h-6 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center text-xs">🔹</span>
            {colD.titre}
          </h4>
          <ul className="space-y-3">
            {colD.items.map((item, i) => (
              <li key={i} className="text-gray-200 text-sm flex items-start gap-3">
                <span className="text-blue-500 mt-1">•</span>
                <span className="break-words">{item || '...'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const fields = [
  { key: 'titre', type: 'text', label: 'Titre de la slide', placeholder: "Ex: Vue d'ensemble du projet" },
  {
    type: 'twoColumnList',
    maxItems: 6,
    columns: [
      {
        key: 'colGauche',
        defaultTitle: 'Colonne 1',
        titlePlaceholder: 'Titre Colonne 1',
        itemPlaceholder: 'Élément...',
        containerClass: 'bg-gray-900/60 border-gray-800',
        titleClass: 'text-blue-400',
        addClass: 'border-gray-700 text-gray-400 hover:text-white',
      },
      {
        key: 'colDroite',
        defaultTitle: 'Colonne 2',
        titlePlaceholder: 'Titre Colonne 2',
        itemPlaceholder: 'Élément...',
        containerClass: 'bg-gray-900/60 border-gray-800',
        titleClass: 'text-blue-400',
        addClass: 'border-gray-700 text-gray-400 hover:text-white',
      },
    ],
  },
];

export const DeuxColonnesForm = (props) => <GenericForm fields={fields} {...props} />;
export const DeuxColonnesNotes = (props) => <GenericNotes {...props} />;
