import { GenericForm } from '../GenericForm';
import { GenericNotes } from '../GenericNotes';

// Rendu visuel de la slide Timeline
export const TimelineVisual = ({ content }) => {
  const steps = content?.steps || [
    { date: '2023', titre: 'Lancement', desc: 'Initialisation du projet' },
    { date: '2024', titre: 'Expansion', desc: 'Déploiement à l\'international' }
  ];

  return (
    <div className="w-[850px] aspect-video bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-2xl relative overflow-hidden flex-shrink-0">
      {/* Effet lumineux de fond subtil, cohérent avec Bento Grid */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full w-full flex flex-col p-12">
        {/* Titre de la slide */}
        <h3 className="text-4xl font-extrabold text-white text-center mb-16 tracking-tight">
          {content?.titre || 'Feuille de route'}
        </h3>

        <div className="relative flex-1 flex items-center justify-center">
          {/* La ligne de fond */}
          <div className="absolute h-1 bg-gray-700 w-full top-1/2 transform -translate-y-1/2 z-0"></div>

          {/* Les étapes */}
          <div className="flex justify-between w-full z-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center group" style={{ width: `${100 / steps.length}%` }}>
                {/* Date / Label en haut */}
                <div className="mb-4 text-blue-400 font-mono text-sm font-bold bg-slate-950 px-2">
                  {step.date || 'Etape ' + (i + 1)}
                </div>

                {/* Le point sur la ligne */}
                <div className="w-6 h-6 bg-blue-600 border-4 border-slate-950 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] mb-4"></div>

                {/* Titre et description en bas */}
                <div className="text-center px-2">
                  <h4 className="text-white font-bold text-sm mb-1 break-words line-clamp-2">
                    {step.titre || 'Titre'}
                  </h4>
                  <p className="text-gray-400 text-[11px] leading-tight break-words line-clamp-3">
                    {step.desc || 'Description...'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const fields = [
  { key: 'titre', type: 'text', label: 'Titre de la slide', placeholder: 'Ex: Roadmap 2024' },
  {
    key: 'steps',
    type: 'objectList',
    label: 'Étapes (max 5)',
    countMode: 'addRemove',
    min: 1,
    max: 5,
    addLabel: 'Ajouter',
    fields: [
      { key: 'date', type: 'text', label: null, placeholder: 'Date/Label' },
      { key: 'titre', type: 'text', label: null, placeholder: 'Titre' },
      { key: 'desc', type: 'textarea', label: null, placeholder: 'Description courte...', rows: 2 },
    ],
  },
];

export const TimelineForm = (props) => <GenericForm fields={fields} {...props} />;
export const TimelineNotes = (props) => <GenericNotes {...props} />;
