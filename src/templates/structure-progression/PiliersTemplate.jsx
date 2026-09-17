import { GenericForm } from '../GenericForm';
import { GenericNotes } from '../GenericNotes';

// Rendu visuel de la slide (3 Piliers / Cartes)
export const PiliersVisual = ({ content }) => {
  const pillars = content?.pillars || [
    { icone: '🚀', titre: 'Innovation', desc: 'Repousser les limites technologiques.' },
    { icone: '💎', titre: 'Qualité', desc: 'Une exigence de précision absolue.' },
    { icone: '🤝', titre: 'Confiance', desc: 'Un partenariat durable et transparent.' }
  ];

  return (
    <div className="w-[850px] h-[478px] bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col p-10 relative overflow-hidden flex-shrink-0 box-border justify-between">
      {/* Titre de la slide */}
      <h3 className="text-4xl font-extrabold text-white text-left tracking-tight">
        {content?.titre || 'Nos Valeurs Fondamentales'}
      </h3>

      <div className="flex gap-6 items-stretch h-[280px]">
        {pillars.map((pillar, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg transform hover:scale-[1.02] transition-transform"
          >
            {/* Icône / Emoji */}
            <div className="w-16 h-16 bg-blue-600/20 text-3xl flex items-center justify-center rounded-2xl mb-4 border border-blue-500/30 flex-shrink-0">
              {pillar.icone || '📍'}
            </div>

            {/* Texte */}
            <h4 className="text-white font-bold text-lg mb-2 tracking-tight">
              {pillar.titre || 'Pilier ' + (i + 1)}
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed break-words line-clamp-4">
              {pillar.desc || 'Description synthétique de ce point clé...'}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

const fields = [
  { key: 'titre', type: 'text', label: 'Titre de la slide', placeholder: 'Ex: Stratégie de Croissance' },
  {
    key: 'pillars',
    type: 'objectList',
    label: 'Configuration des 3 piliers',
    countMode: 'fixed',
    min: 3,
    max: 3,
    fields: [
      { key: 'icone', type: 'emojiPicker', label: 'Icône' },
      { key: 'titre', type: 'text', label: 'Titre du pilier', placeholder: 'Ex: Innovation' },
      { key: 'desc', type: 'textarea', label: 'Description', placeholder: 'Description courte...', rows: 2 },
    ],
  },
];

export const PiliersForm = (props) => <GenericForm fields={fields} {...props} />;
export const PiliersNotes = (props) => <GenericNotes {...props} />;
