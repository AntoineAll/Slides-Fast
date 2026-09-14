import { GenericForm } from './GenericForm';
import { GenericNotes } from './GenericNotes';

// Rendu visuel de la slide (Style Bento Grid)
export const BentoGridVisual = ({ content }) => {
  const cards = content?.cards || [
    { titre: 'Performance', description: 'Optimisé pour une vitesse et une réactivité maximale sur tous les supports.', tag: '01' },
    { titre: 'Sécurité', description: 'Chiffrement de bout en bout et protection avancée de vos données.', tag: '02' },
    { titre: 'Évolutivité', description: 'Architecture conçue pour grandir au rythme de vos ambitions.', tag: '03' },
  ];

  return (
    <div className="w-[850px] aspect-video bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl flex flex-col p-8 relative overflow-hidden flex-shrink-0">
      {/* Effet lumineux de fond subtil */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* En-tête de la slide */}
      <div className="mb-6 z-10">
        <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
          {content?.badge || 'Aperçu global'}
        </span>
        <h3 className="text-2xl font-black text-white mt-2 tracking-tight">
          {content?.titre || 'Titre principal de la slide'}
        </h3>
      </div>

      {/* Grille Bento */}
      <div className="grid grid-cols-3 gap-4 flex-1 z-10 items-stretch">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 border border-slate-800/80 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between relative group shadow-lg"
          >
            {/* Liseré lumineux au survol */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
                  {card.tag || `0${index + 1}`}
                </span>
              </div>
              <h4 className="text-white font-bold text-base mb-2 tracking-wide group-hover:text-cyan-300 transition-colors">
                {card.titre || 'Titre de la carte'}
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                {card.description || 'Description courte du point clé...'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const fields = [
  { key: 'badge', type: 'text', label: 'Badge / Catégorie', placeholder: 'Ex: INNOVATION', small: true },
  { key: 'titre', type: 'text', label: 'Titre principal', placeholder: 'Titre de la slide...', small: true },
  {
    key: 'cards',
    type: 'objectList',
    countMode: 'addRemove',
    min: 1,
    max: 3,
    addLabel: 'Ajouter une carte Bento',
    fields: [
      { key: 'tag', type: 'text', label: null, placeholder: 'Tag' },
      { key: 'titre', type: 'text', label: null, placeholder: 'Titre de la carte...' },
      { key: 'description', type: 'textarea', label: null, placeholder: 'Description détaillée...' },
    ],
  },
];

export const BentoGridForm = (props) => <GenericForm fields={fields} {...props} />;
export const BentoGridNotes = (props) => <GenericNotes {...props} accent="cyan" surface="slate" />;
