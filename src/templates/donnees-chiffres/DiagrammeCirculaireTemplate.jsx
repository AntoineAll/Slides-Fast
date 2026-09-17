import { GenericForm } from '../GenericForm';
import { GenericNotes } from '../GenericNotes';

// Rendu visuel de la slide (Diagramme + Légende)
export const DiagrammeCirculaireVisual = ({ content }) => {
  const parts = content?.parts || [];
  const unite = content?.unite || 'quantite'; // 'quantite' ou 'pourcentage'

  // Calcul de la somme totale pour les calculs de proportion
  const total = parts.reduce((sum, p) => sum + Number(p.valeur || 0), 0);

  // Génération des portions du diagramme circulaire en SVG
  let cumulativePercent = 0;
  const svgSlices = parts.map((part, index) => {
    const value = Number(part.valeur || 0);
    if (total === 0 || value === 0) return null;

    const percent = value / total;
    const startPercent = cumulativePercent;
    const endPercent = cumulativePercent + percent;
    cumulativePercent += percent;

    const [startX, startY] = [Math.cos(2 * Math.PI * startPercent), Math.sin(2 * Math.PI * startPercent)];
    const [endX, endY] = [Math.cos(2 * Math.PI * endPercent), Math.sin(2 * Math.PI * endPercent)];

    const largeArcFlag = percent > 0.5 ? 1 : 0;

    const pathData = [
      `M 0 0`,
      `L ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `Z`
    ].join(' ');

    return (
      <path
        key={index}
        d={pathData}
        fill={part.couleur || '#3B82F6'}
        stroke="#1F2937"
        strokeWidth="0.02"
      />
    );
  });

  return (
    <div className="w-[850px] aspect-video bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-2xl relative overflow-hidden flex-shrink-0">
      {/* Effet lumineux de fond subtil, cohérent avec Bento Grid */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full w-full flex flex-col justify-between p-8">
        {/* Titre en haut */}
        <h3 className="text-4xl font-extrabold text-white text-center tracking-tight break-words max-w-full">
          {content?.titre || 'Aucun titre'}
        </h3>

        {/* Contenu : Diagramme à gauche, Légende à droite */}
        <div className="flex-1 flex items-center justify-around px-4">
          {/* Diagramme Circulaire (SVG centré) */}
          <div className="w-[320px] h-[320px] flex items-center justify-center">
            {parts.length > 0 && total > 0 ? (
              <svg viewBox="-1.1 -1.1 2.2 2.2" className="w-full h-full transform -rotate-90">
                {svgSlices}
                <circle cx="0" cy="0" r="0.45" fill="#111827" />
              </svg>
            ) : (
              <div className="text-gray-500 italic text-center text-sm">
                Ajoutez des parts avec des valeurs &gt; 0
              </div>
            )}
          </div>

          {/* Légende (à droite) */}
          <div className="w-[300px] bg-gray-950/40 border border-gray-800 p-4 rounded-xl max-h-[280px] overflow-y-auto space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Répartition :
            </h4>
            {parts.length > 0 ? (
              parts.map((part, index) => {
                const value = Number(part.valeur || 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

                // Affichage conditionnel selon l'unité choisie
                const displayValue = unite === 'pourcentage'
                  ? `${percentage}%`
                  : `${value} (${percentage}%)`;

                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: part.couleur || '#3B82F6' }}
                      />
                      <span className="text-white font-medium truncate" title={part.label || `Part ${index + 1}`}>
                        {part.label || `Part ${index + 1}`}
                      </span>
                    </div>
                    <span className="text-white font-medium text-xs">
                      {displayValue}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-600 text-xs italic">Aucune part définie</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const fields = [
  { key: 'titre', type: 'text', label: 'Titre de la slide', placeholder: 'Ex: Répartition du budget' },
  {
    key: 'unite',
    type: 'toggle',
    label: "Unité d'affichage des parts",
    options: [
      { value: 'quantite', label: 'Quantités (Valeurs brutes)' },
      { value: 'pourcentage', label: 'Pourcentages (%)' },
    ],
  },
  {
    key: 'parts',
    type: 'objectList',
    label: 'Configuration des parts',
    countMode: 'select',
    min: 2,
    max: 7,
    unitLabel: 'parts',
    fields: [
      { key: 'label', type: 'text', label: null, placeholder: 'Libellé' },
      { key: 'valeur', type: 'number', label: null, placeholder: 'Valeur', defaultValue: 10 },
      { key: 'couleur', type: 'color', label: 'Couleur :' },
    ],
  },
];

export const DiagrammeCirculaireForm = (props) => <GenericForm fields={fields} {...props} />;
export const DiagrammeCirculaireNotes = (props) => <GenericNotes {...props} />;
