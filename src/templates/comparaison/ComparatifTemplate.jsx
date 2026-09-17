import { GenericForm } from '../GenericForm';
import { GenericNotes } from '../GenericNotes';

// Rendu visuel de la slide (Comparatif / Pros & Cons)
export const ComparatifVisual = ({ content }) => {
  const colG = content?.colGauche || { titre: 'Avantages', items: ['Point positif 1', 'Point positif 2'] };
  const colD = content?.colDroite || { titre: 'Inconvénients', items: ['Point négatif 1', 'Point négatif 2'] };

  return (
    <div className="w-[850px] aspect-video bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-2xl relative overflow-hidden flex-shrink-0">
      {/* Effet lumineux de fond subtil, cohérent avec Bento Grid */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full w-full flex flex-col p-10">
        {/* Titre de la slide */}
        <h3 className="text-4xl font-extrabold text-white text-center mb-8 tracking-tight break-words max-w-full">
          {content?.titre || 'Analyse Comparative'}
        </h3>

        <div className="flex-1 flex gap-8">
          {/* Colonne Gauche (Positif) */}
          <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex flex-col">
            <h4 className="text-emerald-400 font-bold text-xl mb-4 flex items-center gap-2 border-b border-emerald-500/20 pb-2">
              <span className="w-6 h-6 bg-emerald-500 text-gray-900 rounded-full flex items-center justify-center text-xs">✓</span>
              {colG.titre}
            </h4>
            <ul className="space-y-3">
              {colG.items.map((item, i) => (
                <li key={i} className="text-gray-200 text-sm flex items-start gap-3">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span className="break-words">{item || '...'}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne Droite (Négatif) */}
          <div className="flex-1 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 flex flex-col">
            <h4 className="text-rose-400 font-bold text-xl mb-4 flex items-center gap-2 border-b border-rose-500/20 pb-2">
              <span className="w-6 h-6 bg-rose-500 text-gray-900 rounded-full flex items-center justify-center text-xs font-black">✕</span>
              {colD.titre}
            </h4>
            <ul className="space-y-3">
              {colD.items.map((item, i) => (
                <li key={i} className="text-gray-200 text-sm flex items-start gap-3">
                  <span className="text-rose-500 mt-1">•</span>
                  <span className="break-words">{item || '...'}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const fields = [
  { key: 'titre', type: 'text', label: 'Titre de la slide', placeholder: 'Ex: Analyse de la Solution A' },
  {
    type: 'twoColumnList',
    maxItems: 6,
    columns: [
      {
        key: 'colGauche',
        defaultTitle: 'Avantages',
        titlePlaceholder: 'Titre Gauche',
        itemPlaceholder: 'Argument...',
        containerClass: 'bg-emerald-950/20 border-emerald-900/30',
        titleClass: 'text-emerald-400',
        addClass: 'border-emerald-800/50 text-emerald-600 hover:text-emerald-400',
      },
      {
        key: 'colDroite',
        defaultTitle: 'Inconvénients',
        titlePlaceholder: 'Titre Droite',
        itemPlaceholder: 'Argument...',
        containerClass: 'bg-rose-950/20 border-rose-900/30',
        titleClass: 'text-rose-400',
        addClass: 'border-rose-800/50 text-rose-600 hover:text-rose-400',
      },
    ],
  },
];

export const ComparatifForm = (props) => <GenericForm fields={fields} {...props} />;
export const ComparatifNotes = (props) => <GenericNotes {...props} />;
