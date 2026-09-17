import { GenericForm } from '../GenericForm';
import { GenericNotes } from '../GenericNotes';

// Rendu visuel de la slide (KPI / Indicateur)
export const KpiVisual = ({ content }) => {
  return (
    <div className="w-[850px] h-[478px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl relative flex-shrink-0 box-border overflow-hidden">
      {/* Effet lumineux de fond subtil, cohérent avec Bento Grid */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full w-full flex p-16">
        {/* Colonne Gauche : Chiffre principal */}
        <div className="w-1/2 flex flex-col justify-center border-r border-gray-800 pr-12">
          <h3 className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
            Indicateur Clé
          </h3>
          <div className="text-7xl font-extrabold text-white mb-3 tracking-tight">
            {content?.chiffre || '0%'}
          </div>
          <p className="text-gray-400 text-lg font-medium">
            {content?.label || 'Titre de l\'indicateur'}
          </p>
        </div>

        {/* Colonne Droite : Détails */}
        <div className="w-1/2 pl-12 flex flex-col justify-center">
          <h4 className="text-white font-semibold mb-8 text-sm uppercase tracking-wider text-gray-400">
            Détails de performance
          </h4>
          <div className="space-y-6">
            {(content?.points?.filter(p => p.trim() !== '') || ['Exemple de point']).map((point, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <p className="text-gray-300 text-base font-light tracking-wide group-hover:text-white transition-colors">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const fields = [
  { key: 'chiffre', type: 'text', label: 'Chiffre / Indicateur', placeholder: 'Ex: 85%' },
  { key: 'label', type: 'text', label: 'Label du chiffre', placeholder: 'Ex: Croissance annuelle' },
  { key: 'points', type: 'list', label: 'Points de contexte', min: 4, max: 4, itemPlaceholder: (i) => `Point ${i + 1}` },
];

export const KpiForm = (props) => <GenericForm fields={fields} {...props} />;
export const KpiNotes = (props) => <GenericNotes {...props} />;
